import type { ProgressBlock } from '@shopfunnel/core/funnel/schema'

export interface ProgressProps {
  block: ProgressBlock
}

export function Progress(_props: ProgressProps) {
  return (
    <div className="flex h-12 items-center justify-center rounded-lg bg-gray-100 text-sm text-gray-400">
      Progress block
    </div>
  )
}
