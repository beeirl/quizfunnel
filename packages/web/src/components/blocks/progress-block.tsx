import type { Funnel } from '@shopfunnel/core/funnel/index'

export interface ProgressBlockProps {
  block: Funnel.Page.ProgressBlock
}

export function ProgressBlock(_props: ProgressBlockProps) {
  return (
    <div className="flex h-12 items-center justify-center rounded-lg bg-gray-100 text-sm text-gray-400">
      Progress block
    </div>
  )
}
