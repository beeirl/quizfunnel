import { json, mysqlTable, primaryKey } from 'drizzle-orm/mysql-core'
import { id, timestamp, timestampColumns, workspaceColumns, workspaceIndexes } from '../database/types'

export const SubmissionsTable = mysqlTable(
  'submissions',
  {
    ...workspaceColumns,
    ...timestampColumns,
    calculations: json('calculations'),
    completedAt: timestamp('completed_at'),
  },
  (table) => [...workspaceIndexes(table)],
)

export const SubmissionAnswerTable = mysqlTable(
  'submission_answer',
  {
    ...timestampColumns,
    workspaceId: id('workspace_id').notNull(),
    submissionId: id('submission_id').notNull(),
    fieldId: id('field_id').notNull(),
    value: json('value').$type<string | number | boolean | any[]>(),
  },
  (table) => [primaryKey({ columns: [table.workspaceId, table.submissionId, table.fieldId] })],
)
