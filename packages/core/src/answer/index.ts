import { and, eq, isNull } from 'drizzle-orm'
import { z } from 'zod'
import { Database } from '../database'
import { Identifier } from '../identifier'
import { QuestionTable } from '../question/index.sql'
import { Quiz } from '../quiz'
import { Submission } from '../submission'
import { fn } from '../utils/fn'
import { AnswerTable } from './index.sql'

export namespace Answer {
  export const submit = fn(
    z.object({
      quizId: Identifier.schema('quiz'),
      sessionId: z.string(),
      answers: z.array(
        z.object({
          blockId: z.string(),
          value: z.unknown(),
        }),
      ),
    }),
    async (input) => {
      if (input.answers.length === 0) return

      const quiz = await Quiz.getPublishedVersion(input.quizId)
      if (!quiz) throw new Error('Quiz not found')

      let submissionId = await Submission.fromSessionId(input.sessionId)
      if (!submissionId) {
        submissionId = await Submission.create({
          quizId: quiz.id,
          workspaceId: quiz.workspaceId,
          sessionId: input.sessionId,
        })
      }

      await Database.use(async (tx) => {
        // Resolve blockIds to questionIds
        const questions = await tx
          .select({ id: QuestionTable.id, blockId: QuestionTable.blockId })
          .from(QuestionTable)
          .where(
            and(
              eq(QuestionTable.workspaceId, quiz.workspaceId),
              eq(QuestionTable.quizId, quiz.id),
              isNull(QuestionTable.archivedAt),
            ),
          )

        const questionByBlockId = new Map(questions.map((q) => [q.blockId, q.id]))

        for (const answer of input.answers) {
          const questionId = questionByBlockId.get(answer.blockId)
          if (!questionId) {
            // Question doesn't exist for this block - skip
            // This can happen if the quiz was updated after the respondent started
            continue
          }

          const existingAnswer = await tx
            .select({ id: AnswerTable.id })
            .from(AnswerTable)
            .where(
              and(
                eq(AnswerTable.workspaceId, quiz.workspaceId),
                eq(AnswerTable.submissionId, submissionId),
                eq(AnswerTable.questionId, questionId),
              ),
            )
            .then((rows) => rows[0])

          if (existingAnswer) {
            await tx
              .update(AnswerTable)
              .set({ value: answer.value as any })
              .where(and(eq(AnswerTable.workspaceId, quiz.workspaceId), eq(AnswerTable.id, existingAnswer.id)))
          } else {
            await tx.insert(AnswerTable).values({
              id: Identifier.create('answer'),
              workspaceId: quiz.workspaceId,
              submissionId,
              questionId,
              value: answer.value as any,
            })
          }
        }
      })
    },
  )
}
