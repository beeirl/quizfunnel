import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/workspace/$workspaceId/forms/$id/_layout/insights')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <p className="text-muted-foreground">Insights coming soon</p>
    </div>
  )
}
