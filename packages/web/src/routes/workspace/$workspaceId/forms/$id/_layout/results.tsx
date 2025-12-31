import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/workspace/$workspaceId/forms/$id/_layout/results')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <p className="text-muted-foreground">Results coming soon</p>
    </div>
  )
}
