import { mysqlTable, uniqueIndex, varchar } from 'drizzle-orm/mysql-core'
import { id, timestampColumns } from '../database/types'

export const WorkspaceTable = mysqlTable(
  'workspace',
  {
    id: id('id').notNull().primaryKey(),
    slug: varchar('slug', { length: 255 }),
    name: varchar('name', { length: 255 }).notNull(),
    ...timestampColumns,
  },
  (table) => [uniqueIndex('slug').on(table.slug)],
)
