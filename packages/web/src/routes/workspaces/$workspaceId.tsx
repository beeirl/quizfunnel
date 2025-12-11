import { withActor } from '@/context/auth.withActor'
import { AppLayout } from '@beeirl/ui/app-layout'
import { Account } from '@shopfunnel/core/account/index'
import { Actor } from '@shopfunnel/core/actor'
import { Identifier } from '@shopfunnel/core/identifier'
import { User } from '@shopfunnel/core/user/index'
import { queryOptions } from '@tanstack/react-query'
import { createFileRoute, Outlet } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'

const getUserEmail = createServerFn()
  .inputValidator(Identifier.schema('workspace'))
  .handler(({ data: workspaceId }) => {
    return withActor(async () => {
      const actor = Actor.assert('user')
      const email = await User.getAuthEmail(actor.properties.userId)
      return email
    }, workspaceId)
  })

const getWorkspaces = createServerFn().handler(() => {
  return withActor(() => {
    return Account.workspaces()
  })
})

const workspacesQueryOptions = () =>
  queryOptions({
    queryKey: ['workspaces'],
    queryFn: () => getWorkspaces(),
  })

export const Route = createFileRoute('/workspaces/$workspaceId')({
  component: WorkspaceLayoutRoute,
  ssr: 'data-only',
  loader: async ({ context, params }) => {
    await getUserEmail({ data: params.workspaceId })
    // await context.queryClient.ensureQueryData(workspacesQueryOptions())
  },
})

function WorkspaceLayoutRoute() {
  // const workspacesQuery = useSuspenseQuery(workspacesQueryOptions())
  return (
    <AppLayout.Root>
      <Outlet />
    </AppLayout.Root>
  )
}
