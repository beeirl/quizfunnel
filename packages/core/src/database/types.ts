import { sql } from 'drizzle-orm'
import { primaryKey, timestamp, varchar } from 'drizzle-orm/mysql-core'

export const id = (name: string) => varchar(name, { length: 30 })

export const workspaceColumns = {
  get id() {
    return id('id').notNull()
  },
  get workspaceId() {
    return id('workspace_id').notNull()
  },
}

export function workspaceIndexes(table: any) {
  return [
    primaryKey({
      columns: [table.workspaceId, table.id],
    }),
  ]
}

export const utc = (name: string) =>
  timestamp(name, {
    fsp: 3,
  })

export const timestampColumns = {
  createdAt: utc('created_at').notNull().defaultNow(),
  updatedAt: utc('updated_at')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)`),
  archivedAt: utc('archived_at'),
}

// Re-export for files using timestamp directly
export { utc as timestamp }
