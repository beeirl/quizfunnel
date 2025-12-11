import { and, eq } from 'drizzle-orm'
import { z } from 'zod'
import { Account } from '../account'
import { Database } from '../database'
import { Identifier } from '../identifier'
import { fn } from '../utils/fn'
import { AuthProvider, AuthTable } from './index.sql'

export namespace Auth {
  export const create = fn(
    z.object({
      provider: z.enum(AuthProvider),
      subject: z.string(),
      accountId: z.string().optional(),
    }),
    async (input) => {
      const accountId = input.accountId ?? (await Account.create({}))
      return Database.transaction(async (tx) => {
        const id = Identifier.create('auth')
        await tx.insert(AuthTable).values({
          id,
          provider: input.provider,
          subject: input.subject,
          accountId,
        })
        return { id, accountId }
      })
    },
  )

  export const fromProvider = fn(
    z.object({
      provider: z.enum(AuthProvider),
      subject: z.string(),
    }),
    async (input) =>
      Database.use(async (tx) => {
        return tx
          .select()
          .from(AuthTable)
          .where(and(eq(AuthTable.provider, input.provider), eq(AuthTable.subject, input.subject)))
          .then((rows) => rows[0])
      }),
  )

  export const fromAccountId = fn(z.string(), async (accountId) =>
    Database.use(async (tx) => {
      return tx.select().from(AuthTable).where(eq(AuthTable.accountId, accountId)).execute()
    }),
  )
}
