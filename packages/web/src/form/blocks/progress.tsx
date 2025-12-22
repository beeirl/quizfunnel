import type { ProgressBlock as ProgressBlockData } from '@shopfunnel/core/form/types'

export interface ProgressBlockProps {
  data: ProgressBlockData
  static?: boolean
}

export function ProgressBlock(_props: ProgressBlockProps) {
  return (
    <div className="flex h-12 items-center justify-center rounded-(--radius) bg-muted text-sm text-muted-foreground">
      Progress block
    </div>
  )
}
