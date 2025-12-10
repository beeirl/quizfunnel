import { jsonb, pgTable, uniqueIndex, varchar } from 'drizzle-orm/pg-core'
import { timestampColumns, workspaceColumns, workspaceIndexes } from '../database/types'
import { FunnelPage } from './page'
import { FunnelRule } from './rule'
import { FunnelVariables } from './variable'

export const FunnelTable = pgTable(
  'funnel',
  {
    ...workspaceColumns,
    ...timestampColumns,
    shortId: varchar('short_id', { length: 6 }).notNull(),
    templateId: varchar('template_id', { length: 255 }),
    title: varchar('title', { length: 255 }).notNull(),
    pages: jsonb('pages').$type<FunnelPage[]>().notNull(),
    rules: jsonb('rules').$type<FunnelRule[]>().notNull(),
    variables: jsonb('variables').$type<FunnelVariables>().notNull(),
  },
  (table) => [...workspaceIndexes(table), uniqueIndex('short_id').on(table.workspaceID, table.shortId)],
)
