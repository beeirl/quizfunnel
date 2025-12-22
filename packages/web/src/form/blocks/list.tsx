import type { ListBlock as ListBlockData } from '@shopfunnel/core/form/types'

export interface ListBlockProps {
  static: boolean
  data: ListBlockData
}

export function ListBlock(_props: ListBlockProps) {
  return (
    <div className="flex h-12 items-center justify-center rounded-(--radius) bg-muted text-sm text-muted-foreground">
      List block
    </div>
  )
}
