import { and, eq, inArray, lte } from 'drizzle-orm'
import { DateTime } from 'luxon'
import { chunk } from 'remeda'
import { z } from 'zod'
import { Actor } from '../actor'
import { Database } from '../database'
import { Identifier } from '../identifier'
import { Storage } from '../storage'
import { VisibleError, VisibleErrorCodes } from '../utils/error'
import { fn } from '../utils/fn'
import { fileTable, fileUploadTable } from './index.sql'

export namespace File {
  export const Metadata = z.object({
    id: z.string(),
    contentType: z.string(),
    name: z.string(),
    public: z.boolean(),
    size: z.number(),
    url: z.string().optional(),
    createdAt: z.date(),
  })
  export type Metadata = z.infer<typeof Metadata>

  export const Info = Metadata.extend({
    buffer: z.instanceof(Buffer),
  })
  export type Info = z.infer<typeof Info>

  export const Upload = z.object({
    contentType: z.string(),
    createdAt: z.date(),
    fileId: z.string(),
    name: z.string(),
    public: z.boolean(),
    size: z.number(),
  })
  export type Upload = z.infer<typeof Upload>

  export const fromId = fn(Info.shape.id, async (id) => {
    const metadata = await getMetadata(id)
    if (!metadata) {
      throw new VisibleError('not_found', VisibleErrorCodes.NotFound.RESOURCE_NOT_FOUND, 'File not found')
    }
    const buffer = await Storage.get({
      key: getKey({ fileId: id, workspaceId: Actor.workspaceId() }),
      public: metadata.public,
    })
    if (!buffer) {
      throw new VisibleError('not_found', VisibleErrorCodes.NotFound.RESOURCE_NOT_FOUND, 'File not found in storage')
    }
    return { ...metadata, buffer }
  })

  export const getMetadata = fn(Info.shape.id, (id) =>
    Database.transaction(async (tx) =>
      tx
        .select()
        .from(fileTable)
        .where(and(eq(fileTable.workspaceId, Actor.workspaceId()), eq(fileTable.id, id)))
        .then((rows) => {
          const firstRow = rows[0]
          if (!firstRow) return undefined
          return {
            id: firstRow.id,
            contentType: firstRow.contentType,
            name: firstRow.name,
            public: firstRow.public,
            size: firstRow.size,
            url: firstRow.public ? `${Storage.getBucket(true).url}/${firstRow.id}` : undefined,
            createdAt: firstRow.createdAt,
          }
        }),
    ),
  )

  export const getUrl = fn(
    z.object({
      fileId: Info.shape.id,
      workspaceId: z.string(),
    }),
    (input) => {
      return `${Storage.getBucket(true).url}/${getKey(input)}`
    },
  )

  export const create = fn(
    z.object({
      contentType: Info.shape.contentType,
      data: z.instanceof(Buffer),
      name: Info.shape.name,
      public: Info.shape.public.optional().default(false),
      size: Info.shape.size,
    }),
    async (input) => {
      const id = Identifier.create('file')
      await Storage.put({
        key: getKey({ fileId: id, workspaceId: Actor.workspaceId() }),
        body: input.data,
        contentType: input.contentType,
        public: input.public,
      })
      await Database.use(async (tx) =>
        tx.insert(fileTable).values({
          id,
          workspaceId: Actor.workspaceId(),
          contentType: input.contentType,
          name: input.name,
          public: input.public,
          size: input.data.length,
        }),
      )
      return id
    },
  )

  export const remove = fn(z.string(), async (id) => {
    const file = await Database.use(async (tx) =>
      tx
        .select()
        .from(fileTable)
        .where(and(eq(fileTable.workspaceId, Actor.workspaceId()), eq(fileTable.id, id)))
        .then((rows) => rows[0]),
    )
    if (!file) {
      throw new VisibleError('not_found', VisibleErrorCodes.NotFound.RESOURCE_NOT_FOUND, 'File not found')
    }

    await Storage.remove({
      keys: [getKey({ fileId: file.id, workspaceId: file.workspaceId })],
      public: file.public,
    })
    await Database.use(async (tx) =>
      tx.delete(fileTable).where(and(eq(fileTable.workspaceId, Actor.workspaceId()), eq(fileTable.id, file.id))),
    )
  })

  export const download = fn(Info.shape.id, async (id) => {
    const file = await Database.use(async (tx) =>
      tx
        .select()
        .from(fileTable)
        .where(and(eq(fileTable.workspaceId, Actor.workspaceId()), eq(fileTable.id, id)))
        .then((rows) => rows[0]),
    )
    if (!file) {
      throw new VisibleError('not_found', VisibleErrorCodes.NotFound.RESOURCE_NOT_FOUND, 'File not found')
    }
    const downloadUrl = await Storage.getSignedUrl({
      method: 'get',
      contentType: file.contentType,
      key: getKey({ fileId: file.id, workspaceId: file.workspaceId }),
      public: file.public,
    })
    return { downloadUrl }
  })

  export const upload = fn(
    Upload.pick({
      contentType: true,
      name: true,
      public: true,
      size: true,
    }).partial({
      public: true,
    }),
    async (input) => {
      const fileId = Identifier.create('file')
      await Database.use(async (tx) =>
        tx.insert(fileUploadTable).values({
          contentType: input.contentType,
          fileId,
          name: input.name,
          workspaceId: Actor.workspaceId(),
          public: input.public ?? false,
          size: input.size,
        }),
      )
      const uploadUrl = await Storage.getSignedUrl({
        method: 'put',
        contentType: input.contentType,
        key: getKey({ fileId, workspaceId: Actor.workspaceId() }),
        public: input.public,
      })
      return {
        fileId,
        uploadUrl,
      }
    },
  )

  export const finalizeUpload = fn(Upload.shape.fileId, (fileId) =>
    Database.transaction(async (tx) => {
      const fileUpload = await tx
        .select()
        .from(fileUploadTable)
        .where(and(eq(fileUploadTable.workspaceId, Actor.workspaceId()), eq(fileUploadTable.fileId, fileId)))
        .then((rows) => rows[0])
      if (!fileUpload) {
        throw new VisibleError('not_found', VisibleErrorCodes.NotFound.RESOURCE_NOT_FOUND, 'File upload not found')
      }
      await tx.insert(fileTable).values({
        id: fileUpload.fileId,
        workspaceId: fileUpload.workspaceId,
        contentType: fileUpload.contentType,
        name: fileUpload.name,
        public: fileUpload.public,
        size: fileUpload.size,
      })
      await tx
        .delete(fileUploadTable)
        .where(and(eq(fileUploadTable.workspaceId, Actor.workspaceId()), eq(fileUploadTable.fileId, fileId)))
    }),
  )

  // Purge file uploads that are not finalized and are older than 1 day
  export async function purgeUploads() {
    const fileUploads = await Database.use(async (tx) =>
      tx
        .select()
        .from(fileUploadTable)
        .where(lte(fileUploadTable.createdAt, DateTime.now().minus({ day: 1 }).toJSDate())),
    )
    for (const fileUploadChunk of chunk(fileUploads, 1000)) {
      await Storage.remove({
        keys: fileUploadChunk.map((fileUpload: (typeof fileUploads)[0]) =>
          getKey({ fileId: fileUpload.fileId, workspaceId: fileUpload.workspaceId }),
        ),
        public: fileUploadChunk[0]?.public ?? false,
      })
      await Database.use(async (tx) =>
        tx.delete(fileUploadTable).where(
          inArray(
            fileUploadTable.fileId,
            fileUploadChunk.map((fileUpload: (typeof fileUploads)[0]) => fileUpload.fileId),
          ),
        ),
      )
    }
  }

  const getKey = fn(
    z.object({
      fileId: Info.shape.id,
      workspaceId: z.string(),
    }),
    (input) => {
      return `workspace/${input.workspaceId}/${input.fileId}`
    },
  )
}
