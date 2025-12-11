import { mysqlTable, primaryKey } from 'drizzle-orm/mysql-core'
import { id, timestampColumns } from '../database/types'

export const AccountTable = mysqlTable(
  'account',
  {
    id: id('id').notNull(),
    ...timestampColumns,
  },
  (table) => [primaryKey({ columns: [table.id] })],
)
