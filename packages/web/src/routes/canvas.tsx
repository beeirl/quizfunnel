import { Canvas } from '@/components/canvas'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/canvas')({
  component: Canvas,
  ssr: false,
})
