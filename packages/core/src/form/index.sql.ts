import { jsonb, pgTable, uniqueIndex, varchar } from 'drizzle-orm/pg-core'
import { timestampColumns, workspaceColumns, workspaceIndexes } from '../database/types'
import { FunnelSchema } from './schema'

export const FunnelTable = pgTable(
  'funnel',
  {
    ...workspaceColumns,
    ...timestampColumns,
    shortId: varchar('short_id', { length: 6 }).notNull(),
    templateId: varchar('template_id', { length: 255 }),
    title: varchar('title', { length: 255 }).notNull(),
    schema: jsonb('schema').$type<FunnelSchema>().notNull(),
  },
  (table) => [...workspaceIndexes(table), uniqueIndex('short_id').on(table.workspaceID, table.shortId)],
)
