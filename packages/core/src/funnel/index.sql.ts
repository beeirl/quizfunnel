import { json, mysqlTable, uniqueIndex, varchar } from 'drizzle-orm/mysql-core'
import { timestampColumns, workspaceColumns, workspaceIndexes } from '../database/types'
import { FunnelPage } from './page'
import { FunnelRule } from './rule'
import { FunnelVariables } from './variable'

export const FunnelTable = mysqlTable(
  'funnel',
  {
    ...workspaceColumns,
    ...timestampColumns,
    shortId: varchar('short_id', { length: 8 }).notNull(),
    themeId: varchar('theme_id', { length: 255 }).notNull(),
    title: varchar('title', { length: 255 }).notNull(),
    pages: json('pages').$type<FunnelPage[]>().notNull(),
    rules: json('rules').$type<FunnelRule[]>().notNull(),
    variables: json('variables').$type<FunnelVariables>().notNull(),
  },
  (table) => [...workspaceIndexes(table), uniqueIndex('short_id').on(table.workspaceId, table.shortId)],
)
