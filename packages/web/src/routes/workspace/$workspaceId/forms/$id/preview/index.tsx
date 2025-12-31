import { Form } from '@/components/form'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { getFormQueryOptions } from '../-common'

export const Route = createFileRoute('/workspace/$workspaceId/forms/$id/preview/')({
  component: RouteComponent,
  loader: async ({ context, params }) => {
    await context.queryClient.ensureQueryData(getFormQueryOptions(params.workspaceId, params.id))
  },
})

function RouteComponent() {
  const params = Route.useParams()

  const formQuery = useSuspenseQuery(getFormQueryOptions(params.workspaceId, params.id))
  const form = formQuery.data

  return <Form form={form} mode="preview" />
}
