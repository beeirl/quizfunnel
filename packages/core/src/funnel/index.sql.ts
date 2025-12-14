import { json, mysqlTable, uniqueIndex, varchar } from 'drizzle-orm/mysql-core'
import { timestampColumns, workspaceColumns, workspaceIndexes } from '../database/types'
import type { Page, Rule, Variables } from './schema'

export const FunnelTable = mysqlTable(
  'funnel',
  {
    ...workspaceColumns,
    ...timestampColumns,
    shortId: varchar('short_id', { length: 8 }).notNull(),
    themeId: varchar('theme_id', { length: 255 }).notNull(),
    title: varchar('title', { length: 255 }).notNull(),
    pages: json('pages').$type<Page[]>().notNull(),
    rules: json('rules').$type<Rule[]>().notNull(),
    variables: json('variables').$type<Variables>().notNull(),
  },
  (table) => [...workspaceIndexes(table), uniqueIndex('short_id').on(table.workspaceId, table.shortId)],
)
