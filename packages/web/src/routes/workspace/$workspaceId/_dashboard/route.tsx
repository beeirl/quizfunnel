import { withActor } from '@/context/auth.withActor'
import { AppLayout } from '@beeirl/ui/app-layout'
import { Avatar } from '@beeirl/ui/avatar'
import { ChevronDownIcon, FileTextIcon } from '@beeirl/ui/line-icons'
import { Menu } from '@beeirl/ui/menu'
import { Sidebar } from '@beeirl/ui/sidebar'
import { Account } from '@shopfunnel/core/account/index'
import { Actor } from '@shopfunnel/core/actor'
import { Identifier } from '@shopfunnel/core/identifier'
import { User } from '@shopfunnel/core/user/index'
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, Link, linkOptions, MatchRoute, Outlet } from '@tanstack/react-router'
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

export const Route = createFileRoute('/workspace/$workspaceId/_dashboard')({
  component: WorkspaceLayoutRoute,
  ssr: 'data-only',
  loader: async ({ context, params }) => {
    await getUserEmail({ data: params.workspaceId })
    await context.queryClient.ensureQueryData(workspacesQueryOptions())
  },
})

export const appSidebarHandle = Sidebar.createHandle()

const sidebarMenuItems = [
  {
    icon: FileTextIcon,
    title: 'Funnels',
    linkOptions: linkOptions({
      from: Route.fullPath,
      to: '.',
    }),
  },
]

function WorkspaceLayoutRoute() {
  const params = Route.useParams()

  const workspacesQuery = useSuspenseQuery(workspacesQueryOptions())
  const workspaces = workspacesQuery.data ?? []
  const currentWorkspace = workspaces.find((w) => w.id === params.workspaceId)

  return (
    <AppLayout.Root>
      <Sidebar.Provider>
        <Sidebar.Root handle={appSidebarHandle} name="app">
          <Sidebar.Header>
            <Sidebar.Menu>
              <Sidebar.MenuItem>
                <Menu.Root>
                  <Menu.Trigger
                    render={(props, state) => (
                      <Sidebar.MenuButton {...props} active={state.open} className="w-fit">
                        <Avatar.Root className="rounded-md" color="gray" variant="soft">
                          <Avatar.Fallback>
                            <Avatar.Initials>{currentWorkspace?.name ?? 'W'}</Avatar.Initials>
                          </Avatar.Fallback>
                        </Avatar.Root>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{currentWorkspace?.name ?? 'Workspace'}</span>
                          <ChevronDownIcon className="size-3.5 text-gray-500" />
                        </div>
                      </Sidebar.MenuButton>
                    )}
                  />
                  <Menu.Positioner align="start" side="bottom" sideOffset={5}>
                    <Menu.Popup className="min-w-48">
                      <Menu.Group>
                        {workspaces.map((workspace) => (
                          <Menu.Item
                            key={workspace.id}
                            render={
                              <Link
                                to="/workspaces/$workspaceId"
                                params={{ workspaceId: workspace.id }}
                                className={workspace.id === params.workspaceId ? 'font-semibold' : ''}
                              />
                            }
                          >
                            {workspace.name}
                          </Menu.Item>
                        ))}
                      </Menu.Group>
                    </Menu.Popup>
                  </Menu.Positioner>
                </Menu.Root>
              </Sidebar.MenuItem>
            </Sidebar.Menu>
          </Sidebar.Header>
          <Sidebar.Content className="no-scrollbar">
            <Sidebar.Group>
              <Sidebar.GroupContent>
                <Sidebar.Menu>
                  {sidebarMenuItems.map((item, index) => (
                    <MatchRoute key={`sidebar-menu-item-${index}`} {...item.linkOptions}>
                      {(match) => (
                        <Sidebar.MenuItem>
                          <Sidebar.MenuButton active={!!match} render={<Link {...item.linkOptions} />}>
                            <item.icon />
                            {item.title}
                          </Sidebar.MenuButton>
                        </Sidebar.MenuItem>
                      )}
                    </MatchRoute>
                  ))}
                </Sidebar.Menu>
              </Sidebar.GroupContent>
            </Sidebar.Group>
          </Sidebar.Content>
          <Sidebar.Footer className="pt-0" />
        </Sidebar.Root>
        <Outlet />
      </Sidebar.Provider>
    </AppLayout.Root>
  )
}
