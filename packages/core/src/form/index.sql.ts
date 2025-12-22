import { int, json, mysqlTable, primaryKey, uniqueIndex, varchar } from 'drizzle-orm/mysql-core'
import { id, timestamp, timestampColumns, workspaceColumns, workspaceIndexes } from '../database/types'
import type { Page, Rule, Theme, Variables } from './types'

export const FormTable = mysqlTable(
  'form',
  {
    ...workspaceColumns,
    ...timestampColumns,
    shortId: varchar('short_id', { length: 8 }).notNull(),
    title: varchar('title', { length: 255 }).notNull(),
    currentVersion: int('current_version').notNull(),
    publishedVersion: int('published_version'),
    publishedAt: timestamp('published_at'),
  },
  (table) => [...workspaceIndexes(table), uniqueIndex('short_id').on(table.shortId)],
)

export const FormVersionTable = mysqlTable(
  'form_version',
  {
    ...timestampColumns,
    workspaceId: id('workspace_id').notNull(),
    formId: id('form_id').notNull(),
    version: int('version').notNull(),
    pages: json('pages').$type<Page[]>().notNull(),
    rules: json('rules').$type<Rule[]>().notNull(),
    variables: json('variables').$type<Variables>().notNull(),
    theme: json('theme').$type<Theme>().notNull(),
  },
  (table) => [primaryKey({ columns: [table.workspaceId, table.formId, table.version] })],
)

export const FormFileTable = mysqlTable(
  'form_file',
  {
    ...timestampColumns,
    workspaceId: id('workspace_id').notNull(),
    formId: id('form_id').notNull(),
    fileId: id('file_id').notNull(),
  },
  (table) => [primaryKey({ columns: [table.workspaceId, table.formId, table.fileId] })],
)
