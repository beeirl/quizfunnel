import type { GaugeBlock as GaugeBlockData } from '@shopfunnel/core/form/types'

export interface GaugeBlockProps {
  data: GaugeBlockData
  static?: boolean
}

export function GaugeBlock(_props: GaugeBlockProps) {
  return (
    <div className="flex h-12 items-center justify-center rounded-(--radius) bg-muted text-sm text-muted-foreground">
      Gauge block
    </div>
  )
}
