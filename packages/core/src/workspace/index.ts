import { eq, sql } from 'drizzle-orm'
import { z } from 'zod'
import { Actor } from '../actor'
import { Database } from '../database'
import { Identifier } from '../identifier'
import { UserTable } from '../user/index.sql'
import { fn } from '../utils/fn'
import { WorkspaceTable } from './index.sql'

export namespace Workspace {
  export const fromID = fn(z.string(), async (id) =>
    Database.use(async (tx) => {
      return tx
        .select()
        .from(WorkspaceTable)
        .where(eq(WorkspaceTable.id, id))
        .then((rows) => rows[0])
    }),
  )

  export const create = fn(
    z.object({
      name: z.string().min(1),
    }),
    async ({ name }) => {
      const account = Actor.assert('account')
      const workspaceId = Identifier.create('workspace')
      const userId = Identifier.create('user')
      await Database.transaction(async (tx) => {
        await tx.insert(WorkspaceTable).values({
          id: workspaceId,
          name,
        })
        await tx.insert(UserTable).values({
          workspaceId,
          id: userId,
          accountId: account.properties.accountId,
          name: '',
          role: 'admin',
        })
      })
      return workspaceId
    },
  )

  export const update = fn(
    z.object({
      name: z.string().min(1).max(255),
    }),
    async ({ name }) => {
      Actor.assertAdmin()
      const workspaceId = Actor.workspace()
      return Database.use(async (tx) =>
        tx
          .update(WorkspaceTable)
          .set({
            name,
          })
          .where(eq(WorkspaceTable.id, workspaceId)),
      )
    },
  )

  export const remove = fn(z.void(), async () => {
    await Database.use(async (tx) =>
      tx
        .update(WorkspaceTable)
        .set({ archivedAt: sql`now()` })
        .where(eq(WorkspaceTable.id, Actor.workspace())),
    )
  })
}
