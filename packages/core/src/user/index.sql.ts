import { index, mysqlEnum, mysqlTable, uniqueIndex, varchar } from 'drizzle-orm/mysql-core'
import { id, timestamp, timestampColumns, workspaceColumns, workspaceIndexes } from '../database/types'

export const UserRole = ['admin', 'member'] as const

export const UserTable = mysqlTable(
  'user',
  {
    ...workspaceColumns,
    ...timestampColumns,
    accountId: id('account_id'),
    email: varchar('email', { length: 255 }),
    name: varchar('name', { length: 255 }).notNull(),
    lastSeenAt: timestamp('last_seen_at'),
    role: mysqlEnum('role', UserRole).notNull(),
  },
  (table) => [
    ...workspaceIndexes(table),
    uniqueIndex('user_account_id').on(table.workspaceId, table.accountId),
    uniqueIndex('user_email').on(table.workspaceId, table.email),
    index('global_account_id').on(table.accountId),
    index('global_email').on(table.email),
  ],
)
