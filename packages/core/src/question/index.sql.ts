import { index, int, json, mysqlTable, unique, varchar } from 'drizzle-orm/mysql-core'
import { id, timestampColumns, ulid, workspaceColumns, workspaceIndexes } from '../database/types'

export const QuestionTable = mysqlTable(
  'question',
  {
    ...workspaceColumns,
    ...timestampColumns,
    quizId: id('quiz_id').notNull(),
    blockId: ulid('block_id').notNull(),
    type: varchar('type', { length: 255 }).notNull(),
    title: varchar('title', { length: 255 }).notNull(),
    index: int('index').notNull(),
    options: json('options').$type<Array<{ id: string; label: string; archived?: boolean }>>(),
  },
  (table) => [
    ...workspaceIndexes(table),
    index('quiz').on(table.quizId),
    unique('quiz_block').on(table.workspaceId, table.quizId, table.blockId),
  ],
)
