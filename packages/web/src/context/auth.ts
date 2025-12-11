import { createClient } from '@openauthjs/openauth/client'
import { Actor } from '@shopfunnel/core/actor'
import { Database } from '@shopfunnel/core/database/index'
import { UserTable } from '@shopfunnel/core/user/index.sql'
import { redirect } from '@tanstack/react-router'
import { and, eq, inArray, isNull, sql } from 'drizzle-orm'
import { useAuthSession } from './auth.session'

export const AuthClient = createClient({
  clientID: 'app',
  issuer: import.meta.env.VITE_AUTH_URL || 'https://auth.opencode.ai',
})

export async function getActor(workspaceId?: string): Promise<Actor.Info> {
  const auth = await useAuthSession()
  if (!workspaceId) {
    const account = auth.data.account ?? {}
    const current = account[auth.data.current ?? '']
    if (current) {
      return {
        type: 'account',
        properties: {
          email: current.email,
          accountId: current.id,
        },
      }
    }
    if (Object.keys(account).length > 0) {
      const current = Object.values(account)[0]!
      await auth.update((val) => ({
        ...val,
        current: current.id,
      }))
      return {
        type: 'account',
        properties: {
          email: current.email,
          accountId: current.id,
        },
      }
    }
    return {
      type: 'public',
      properties: {},
    }
  }
  const accounts = Object.keys(auth.data.account ?? {})
  console.log('accounts', accounts)
  if (accounts.length) {
    const user = await Database.use((tx) =>
      tx
        .select()
        .from(UserTable)
        .where(
          and(
            eq(UserTable.workspaceId, workspaceId),
            isNull(UserTable.archivedAt),
            inArray(UserTable.accountId, accounts),
          ),
        )
        .limit(1)
        .then((rows) => rows[0]),
    )
    if (user) {
      await Database.use((tx) =>
        tx
          .update(UserTable)
          .set({ lastSeenAt: sql`now()` })
          .where(and(eq(UserTable.workspaceId, workspaceId), eq(UserTable.id, user.id))),
      )
      return {
        type: 'user',
        properties: {
          userId: user.id,
          workspaceId: user.workspaceId,
          accountId: user.accountId!,
          role: user.role,
        },
      }
    }
  }
  throw redirect({ to: '/auth/authorize' })
}
