import { withActor } from '@/context/auth.withActor'
import { Funnel } from '@shopfunnel/core/funnel/index'
import { Identifier } from '@shopfunnel/core/identifier'
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
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

export const Route = createFileRoute('/workspaces/$workspaceId/')({
  component: RouteComponent,
  ssr: 'data-only',
  loader: async ({ context, params }) => {
    await context.queryClient.ensureQueryData(listFunnelsQueryOptions(params.workspaceId))
  },
})

function RouteComponent() {
  const params = Route.useParams()
  const listFunnelsQuery = useSuspenseQuery(listFunnelsQueryOptions(params.workspaceId))
  console.log(listFunnelsQuery.data)
  return <div>Hello "/$workspaceId/"!</div>
}
