import { Funnel as FunnelComponent } from '@/funnel'
import { Funnel } from '@shopfunnel/core/funnel/index'
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, notFound } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'

const getFunnel = createServerFn()
  .inputValidator(z.object({ shortId: z.string().length(8) }))
  .handler(async ({ data }) => {
    const funnel = await Funnel.fromShortId(data.shortId)
    if (!funnel) throw notFound()
    return funnel
  })

const getFunnelQueryOptions = (shortId: string) =>
  queryOptions({
    queryKey: ['funnel', 'public', shortId],
    queryFn: () => getFunnel({ data: { shortId } }),
  })

export const Route = createFileRoute('/(funnel)/f/$id')({
  component: RouteComponent,
  loader: async ({ context, params }) => {
    await context.queryClient.ensureQueryData(getFunnelQueryOptions(params.id))
  },
})

function RouteComponent() {
  const params = Route.useParams()

  const funnelQuery = useSuspenseQuery(getFunnelQueryOptions(params.id))

  return (
    <div className="min-h-screen w-full p-6">
      <div className="mx-auto max-w-md">
        <FunnelComponent funnel={funnelQuery.data} />
      </div>
    </div>
  )
}
