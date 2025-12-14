import { withActor } from '@/context/auth.withActor'
import { AppLayout } from '@beeirl/ui/app-layout'
import { Button } from '@beeirl/ui/button'
import { EmptyState } from '@beeirl/ui/empty-state'
import { FileTextIcon } from '@beeirl/ui/line-icons'
import { Funnel } from '@shopfunnel/core/funnel/index'
import { Identifier } from '@shopfunnel/core/identifier'
import { mutationOptions, queryOptions, useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'

const listFunnels = createServerFn()
  .inputValidator(Identifier.schema('workspace'))
  .handler(({ data: workspaceId }) => {
    return withActor(() => Funnel.list(), workspaceId)
  })

const listFunnelsQueryOptions = (workspaceId: string) =>
  queryOptions({
    queryKey: ['funnels', workspaceId],
    queryFn: () => listFunnels({ data: workspaceId }),
  })

const createFunnel = createServerFn({ method: 'POST' })
  .inputValidator(Identifier.schema('workspace'))
  .handler(({ data: workspaceId }) => {
    return withActor(() => Funnel.create(), workspaceId)
  })

const createFunnelMutationOptions = (workspaceId: string) =>
  mutationOptions({
    mutationFn: () => createFunnel({ data: workspaceId }),
  })

export const Route = createFileRoute('/workspace/$workspaceId/_dashboard/')({
  component: RouteComponent,
  ssr: 'data-only',
  loader: async ({ context, params }) => {
    await context.queryClient.ensureQueryData(listFunnelsQueryOptions(params.workspaceId))
  },
})

function RouteComponent() {
  const params = Route.useParams()
  const navigate = Route.useNavigate()
  const queryClient = useQueryClient()

  const listFunnelsQuery = useSuspenseQuery(listFunnelsQueryOptions(params.workspaceId))
  const funnels = listFunnelsQuery.data ?? []

  const createFunnelMutation = useMutation(createFunnelMutationOptions(params.workspaceId))

  async function handleFunnelCreate() {
    const id = await createFunnelMutation.mutateAsync()
    queryClient.invalidateQueries(listFunnelsQueryOptions(params.workspaceId))
    navigate({ to: 'funnels/$funnelId', params: { funnelId: id } })
  }

  return (
    <AppLayout.Content>
      <AppLayout.Body className="overflow-auto">
        <div className="mx-auto h-full max-w-2xl pb-12">
          <AppLayout.Section className="h-full">
            <AppLayout.Heading className="flex flex-row items-center justify-between">
              <div className="flex flex-col">
                <AppLayout.Title>Funnels</AppLayout.Title>
                <AppLayout.Description>View, create, and manage your funnels.</AppLayout.Description>
              </div>
              {funnels.length > 0 && (
                <Button color="gray" variant="surface" onClick={handleFunnelCreate}>
                  Create
                </Button>
              )}
            </AppLayout.Heading>
            {funnels.length > 0 ? (
              <div className="mt-4 flex flex-col gap-2">
                {funnels.map((funnel) => (
                  <Link
                    key={funnel.id}
                    className="flex items-center rounded-lg-plus border border-gray-200 px-4 py-3 text-sm font-medium transition-colors hover:bg-gray-50"
                    to="/workspaces/$workspaceId/funnels/$funnelId"
                    params={{ workspaceId: params.workspaceId, funnelId: funnel.id }}
                  >
                    {funnel.title}
                  </Link>
                ))}
              </div>
            ) : (
              <EmptyState.Root className="flex-1 justify-center">
                <EmptyState.Icon>
                  <FileTextIcon />
                </EmptyState.Icon>
                <EmptyState.Title>No funnels yet</EmptyState.Title>
                <EmptyState.Description>Create your first funnel to get started.</EmptyState.Description>
                <Button onClick={handleFunnelCreate}>Create funnel</Button>
              </EmptyState.Root>
            )}
          </AppLayout.Section>
        </div>
      </AppLayout.Body>
    </AppLayout.Content>
  )
}
