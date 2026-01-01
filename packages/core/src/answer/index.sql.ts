import { index, json, mysqlTable } from 'drizzle-orm/mysql-core'
import { id, timestampColumns, workspaceColumns, workspaceIndexes } from '../database/types'

export const AnswerTable = mysqlTable(
  'answer',
  {
    ...timestampColumns,
    ...workspaceColumns,
    submissionId: id('submission_id').notNull(),
    questionId: id('question_id').notNull(),
    value: json('value').$type<string | number | boolean | any[]>(),
  },
  (table) => [...workspaceIndexes(table), index('question_idx').on(table.workspaceId, table.questionId)],
)
