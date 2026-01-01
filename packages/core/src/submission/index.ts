import { eq, sql } from 'drizzle-orm'
import { z } from 'zod'
import { Database } from '../database'
import { Identifier } from '../identifier'
import { fn } from '../utils/fn'
import { SubmissionTable } from './index.sql'

export namespace Submission {
  export const create = fn(
    z.object({
      quizId: Identifier.schema('quiz'),
      workspaceId: Identifier.schema('workspace'),
      sessionId: z.string(),
    }),
    async (input) => {
      const id = Identifier.create('submission')
      await Database.use((tx) =>
        tx.insert(SubmissionTable).values({
          id,
          quizId: input.quizId,
          workspaceId: input.workspaceId,
          sessionId: input.sessionId,
        }),
      )
      return id
    },
  )

  export const fromSessionId = fn(z.string(), async (sessionId) =>
    Database.use((tx) =>
      tx
        .select({ id: SubmissionTable.id })
        .from(SubmissionTable)
        .where(eq(SubmissionTable.sessionId, sessionId))
        .then((rows) => rows[0]?.id),
    ),
  )

  export const complete = fn(Identifier.schema('submission'), async (id) => {
    await Database.use((tx) =>
      tx
        .update(SubmissionTable)
        .set({ completedAt: sql`NOW(3)` })
        .where(eq(SubmissionTable.id, id)),
    )
  })
}
