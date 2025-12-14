import { and, eq, isNull } from 'drizzle-orm'
import z from 'zod'
import { Actor } from '../actor'
import { Database } from '../database'
import { Identifier } from '../identifier'
import { fn } from '../utils/fn'
import { FunnelTable } from './index.sql'
import type { Page, Rule, Variables } from './schema'

export namespace Funnel {
  export const Info = z.object({
    id: z.string(),
    shortId: z.string(),
    title: z.string(),
    schema: z.record(z.string(), z.any()),
  })
  export type Info = {
    id: string
    shortId: string
    title: string
    pages: Page[]
    rules: Rule[]
    variables: Variables
  }

  export const fromId = fn(Identifier.schema('funnel'), async (id) =>
    Database.use(async (tx) =>
      tx
        .select()
        .from(FunnelTable)
        .where(
          and(eq(FunnelTable.workspaceId, Actor.workspace()), eq(FunnelTable.id, id), isNull(FunnelTable.archivedAt)),
        )
        .then((rows) => rows[0]),
    ),
  )

  export const list = fn(z.void(), () =>
    Database.use(async (tx) =>
      tx
        .select()
        .from(FunnelTable)
        .where(and(eq(FunnelTable.workspaceId, Actor.workspace()), isNull(FunnelTable.archivedAt))),
    ),
  )

  export const create = async () => {
    const id = Identifier.create('funnel')
    const shortId = id.slice(-8)
    await Database.use(async (tx) =>
      tx.insert(FunnelTable).values({
        id,
        workspaceId: Actor.workspace(),
        shortId,
        themeId: '',
        title: 'My new funnel',
        pages: [],
        rules: [],
        variables: {},
      }),
    )
    return id
  }

  export const update = fn(
    z.object({
      id: Identifier.schema('funnel'),
      themeId: Identifier.schema('theme').optional(),
      title: z.string().min(1).max(255).optional(),
      pages: z.custom<Page[]>().optional(),
      rules: z.custom<Rule[]>().optional(),
      variables: z.custom<Variables>().optional(),
    }),
    (input) => {
      return Database.use(async (tx) =>
        tx
          .update(FunnelTable)
          .set({
            themeId: input.themeId,
            title: input.title,
            pages: input.pages,
            rules: input.rules,
            variables: input.variables,
          })
          .where(and(eq(FunnelTable.id, input.id), eq(FunnelTable.workspaceId, Actor.workspace()))),
      )
    },
  )
}
