import type { Funnel } from '@shopfunnel/core/funnel/index'

export interface GaugeBlockProps {
  block: Funnel.Page.GaugeBlock
}

export function GaugeBlock(_props: GaugeBlockProps) {
  return (
    <div className="flex h-12 items-center justify-center rounded-lg bg-gray-100 text-sm text-gray-400">
      Gauge block
    </div>
  )
}
