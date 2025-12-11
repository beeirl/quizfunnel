import { bigint, boolean, mysqlTable, primaryKey, varchar } from 'drizzle-orm/mysql-core'
import { id, timestampColumns, workspaceColumns, workspaceIndexes } from '../database/types'

export const fileTable = mysqlTable(
  'file',
  {
    ...workspaceColumns,
    ...timestampColumns,
    contentType: varchar('content_type', { length: 255 }).notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    public: boolean('public').notNull(),
    size: bigint('size', { mode: 'number' }).notNull(),
  },
  (table) => [...workspaceIndexes(table)],
)

export const fileUploadTable = mysqlTable(
  'file_upload',
  {
    ...timestampColumns,
    contentType: varchar('content_type', { length: 255 }).notNull(),
    fileId: id('file_id').notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    workspaceId: id('workspace_id').notNull(),
    public: boolean('public').notNull(),
    size: bigint('size', { mode: 'number' }).notNull(),
  },
  (table) => [primaryKey({ columns: [table.workspaceId, table.fileId] })],
)
