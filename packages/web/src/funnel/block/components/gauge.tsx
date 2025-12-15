import type { GaugeBlock } from '@shopfunnel/core/funnel/schema'

export interface GaugeProps {
  block: GaugeBlock
}

export function Gauge(_props: GaugeProps) {
  return (
    <div className="flex h-12 items-center justify-center rounded-lg bg-gray-100 text-sm text-gray-400">
      Gauge block
    </div>
  )
}
