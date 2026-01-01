import { and, eq, isNull, sql } from 'drizzle-orm'
import { z } from 'zod'
import { Actor } from '../actor'
import { AnswerTable } from '../answer/index.sql'
import { Database } from '../database'
import { Identifier } from '../identifier'
import { Quiz } from '../quiz'
import type { Block, Step } from '../quiz/types'
import { fn } from '../utils/fn'
import { QuestionTable } from './index.sql'

export namespace Question {
  export const sync = fn(
    z.object({
      quizId: Identifier.schema('quiz'),
    }),
    async (input) => {
      await Database.use(async (tx) => {
        const quiz = await Quiz.getCurrentVersion(input.quizId)
        const inputBlocks = extractInputBlocks(quiz.steps)
        const blockIdSet = new Set(inputBlocks.map((b) => b.blockId))

        // Get existing non-archived questions for this quiz
        const existingQuestions = await tx
          .select()
          .from(QuestionTable)
          .where(
            and(
              eq(QuestionTable.workspaceId, Actor.workspaceId()),
              eq(QuestionTable.quizId, input.quizId),
              isNull(QuestionTable.archivedAt),
            ),
          )

        const existingByBlockId = new Map(existingQuestions.map((q) => [q.blockId, q]))

        // Upsert questions for each input block
        for (const block of inputBlocks) {
          const existing = existingByBlockId.get(block.blockId)

          if (existing) {
            // Update if title or blockType changed
            if (existing.title !== block.title || existing.blockType !== block.blockType) {
              await tx
                .update(QuestionTable)
                .set({
                  title: block.title,
                  blockType: block.blockType,
                })
                .where(and(eq(QuestionTable.workspaceId, Actor.workspaceId()), eq(QuestionTable.id, existing.id)))
            }
          } else {
            // Create new question
            await tx.insert(QuestionTable).values({
              id: Identifier.create('question'),
              workspaceId: Actor.workspaceId(),
              quizId: input.quizId,
              blockId: block.blockId,
              blockType: block.blockType,
              title: block.title,
            })
          }
        }

        // Handle questions that are no longer in the current version
        for (const question of existingQuestions) {
          if (!blockIdSet.has(question.blockId)) {
            // Check if this question has any answers
            const hasAnswers = await tx
              .select({ count: sql<number>`count(*)` })
              .from(AnswerTable)
              .where(and(eq(AnswerTable.workspaceId, Actor.workspaceId()), eq(AnswerTable.questionId, question.id)))
              .then((rows) => rows[0].count > 0)

            if (!hasAnswers) {
              // Archive the question
              await tx
                .update(QuestionTable)
                .set({ archivedAt: sql`NOW(3)` })
                .where(and(eq(QuestionTable.workspaceId, Actor.workspaceId()), eq(QuestionTable.id, question.id)))
            }
          }
        }
      })
    },
  )

  export const list = fn(Identifier.schema('quiz'), async (quizId) => {
    const [questions, quiz] = await Promise.all([
      Database.use((tx) =>
        tx
          .select()
          .from(QuestionTable)
          .where(
            and(
              eq(QuestionTable.workspaceId, Actor.workspace()),
              eq(QuestionTable.quizId, quizId),
              isNull(QuestionTable.archivedAt),
            ),
          ),
      ),
      Quiz.getCurrentVersion(quizId),
    ])
    if (!quiz) return []

    // Build order map from current version's steps
    const orderMap = new Map<string, { stepIndex: number; blockIndex: number }>()
    for (let stepIndex = 0; stepIndex < quiz.steps.length; stepIndex++) {
      const step = quiz.steps[stepIndex]
      for (let blockIndex = 0; blockIndex < step.blocks.length; blockIndex++) {
        const block = step.blocks[blockIndex]
        if (isInputBlock(block)) {
          orderMap.set(block.id, { stepIndex, blockIndex })
        }
      }
    }

    // Sort questions
    const sortedQuestions = questions.sort((a, b) => {
      const orderA = orderMap.get(a.blockId)
      const orderB = orderMap.get(b.blockId)

      // Both in current version: sort by position
      if (orderA && orderB) {
        if (orderA.stepIndex !== orderB.stepIndex) {
          return orderA.stepIndex - orderB.stepIndex
        }
        return orderA.blockIndex - orderB.blockIndex
      }

      // Only A in current version: A comes first
      if (orderA && !orderB) return -1

      // Only B in current version: B comes first
      if (!orderA && orderB) return 1

      // Neither in current version: sort by createdAt
      return a.createdAt.getTime() - b.createdAt.getTime()
    })

    return sortedQuestions.map((q) => ({
      id: q.id,
      blockId: q.blockId,
      blockType: q.blockType,
      title: q.title,
      active: orderMap.has(q.blockId),
      createdAt: q.createdAt,
    }))
  })

  const INPUT_BLOCK_TYPES = ['text_input', 'multiple_choice', 'picture_choice', 'dropdown'] as const
  type InputBlockType = (typeof INPUT_BLOCK_TYPES)[number]

  function isInputBlock(block: Block): block is Block & { type: InputBlockType } {
    return INPUT_BLOCK_TYPES.includes(block.type as InputBlockType)
  }

  function extractInputBlocks(steps: Step[]) {
    const blocks: Array<{
      blockId: string
      blockType: InputBlockType
      title: string
      stepIndex: number
      blockIndex: number
    }> = []

    for (let stepIndex = 0; stepIndex < steps.length; stepIndex++) {
      const step = steps[stepIndex]
      for (let blockIndex = 0; blockIndex < step.blocks.length; blockIndex++) {
        const block = step.blocks[blockIndex]
        if (isInputBlock(block)) {
          blocks.push({
            blockId: block.id,
            blockType: block.type,
            title: block.properties.name,
            stepIndex,
            blockIndex,
          })
        }
      }
    }

    return blocks
  }
}
