import {
  DeleteObjectCommand,
  DeleteObjectsCommand,
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3'
import { getSignedUrl as originalGetSignedUrl } from '@aws-sdk/s3-request-presigner'
import { Resource } from 'sst'
import { z } from 'zod/v4'
import { fn } from '../utils/fn'

export namespace Storage {
  let client: S3Client
  function useClient() {
    if (!client) {
      client = new S3Client({
        endpoint: Resource.Storage.endpoint,
        credentials: {
          accessKeyId: Resource.Storage.accessKeyId,
          secretAccessKey: Resource.Storage.secretAccessKey,
        },
      })
    }
    return client
  }

  export const get = fn(
    z.object({
      key: z.string(),
      public: z.boolean().optional(),
      temporary: z.boolean().optional(),
    }),
    async (input) => {
      const client = useClient()
      const output = await client.send(
        new GetObjectCommand({
          Key: !input.temporary ? input.key : `temporary/daily/${input.key}`,
          Bucket: Resource.Storage.name,
        }),
      )
      if (!output.Body) return
      const body = await output.Body.transformToByteArray()
      return Buffer.from(body)
    },
  )

  export const getSignedUrl = fn(
    z.object({
      contentType: z.string(),
      method: z.enum(['get', 'put']),
      key: z.string(),
      public: z.boolean().optional(),
    }),
    async (input) => {
      const client = useClient()
      return originalGetSignedUrl(
        client,
        {
          get: new GetObjectCommand({
            Bucket: Resource.Storage.name,
            Key: input.key,
          }),
          put: new PutObjectCommand({
            Bucket: Resource.Storage.name,
            ContentType: input.contentType,
            Key: input.key,
          }),
        }[input.method],
      )
    },
  )

  export const head = fn(
    z.object({
      key: z.string(),
      public: z.boolean().optional(),
    }),
    (input) => {
      const client = useClient()
      return client.send(
        new HeadObjectCommand({
          Key: input.key,
          Bucket: Resource.Storage.name,
        }),
      )
    },
  )

  export const put = fn(
    z.object({
      key: z.string(),
      body: z.instanceof(Buffer),
      contentType: z.string(),
      public: z.boolean().optional(),
      temporary: z.boolean().optional(),
    }),
    async (input) => {
      const client = useClient()
      await client.send(
        new PutObjectCommand({
          Key: !input.temporary ? input.key : `temporary/daily/${input.key}`,
          Body: input.body,
          ContentType: input.contentType,
          Bucket: Resource.Storage.name,
        }),
      )
    },
  )

  export const remove = fn(
    z.object({
      keys: z.array(z.string()),
      public: z.boolean().optional(),
    }),
    async (input) => {
      const client = useClient()
      if (input.keys.length === 1) {
        await client.send(
          new DeleteObjectCommand({
            Key: input.keys[0],
            Bucket: Resource.Storage.name,
          }),
        )
      } else {
        await client.send(
          new DeleteObjectsCommand({
            Bucket: Resource.Storage.name,
            Delete: {
              Objects: input.keys.map((key) => ({ Key: key })),
            },
          }),
        )
      }
    },
  )
}
