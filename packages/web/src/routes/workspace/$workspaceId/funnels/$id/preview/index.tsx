import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/workspace/$workspaceId/funnels/$id/preview/',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/workspace/$workspaceId/funnels/$funnelId/preview/"!</div>
}
