import { Actor } from '@shopfunnel/core/actor'
import { getActor } from './auth'

export async function withActor<T>(fn: () => T, workspaceId?: string) {
  const actor = await getActor(workspaceId)
  return Actor.provide(actor.type, actor.properties, fn)
}
