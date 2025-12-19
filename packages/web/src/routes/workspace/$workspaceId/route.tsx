import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/workspace/$workspaceId')({
  component: Outlet,
  ssr: false,
})
