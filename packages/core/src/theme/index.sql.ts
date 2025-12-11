import { mysqlEnum, mysqlTable, varchar } from 'drizzle-orm/mysql-core'
import { id, timestampColumns, workspaceColumns, workspaceIndexes } from '../database/types'

export const ThemeBorderRadius = ['none', 'sm', 'md', 'lg'] as const

export const ThemeTable = mysqlTable(
  'theme',
  {
    ...workspaceColumns,
    ...timestampColumns,
    name: varchar('name', { length: 255 }).notNull(),
    logoFileId: id('logo_file_id'),
    faviconFileId: id('favicon_file_id'),
    backgroundColor: varchar('background_color', { length: 6 }).notNull(),
    textColor: varchar('text_color', { length: 6 }).notNull(),
    accentColor: varchar('accent_color', { length: 6 }).notNull(),
    buttonBackgroundColor: varchar('button_background_color', { length: 6 }).notNull(),
    buttonTextColor: varchar('button_text_color', { length: 6 }).notNull(),
    borderRadius: mysqlEnum('border_radius', ThemeBorderRadius).notNull(),
  },
  (table) => [...workspaceIndexes(table)],
)
