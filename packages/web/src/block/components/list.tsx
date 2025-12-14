import type { ListBlock } from '@shopfunnel/core/funnel/schema'

export interface ListProps {
  block: ListBlock
}

export function List(_props: ListProps) {
  return (
    <div className="flex h-12 items-center justify-center rounded-lg bg-gray-100 text-sm text-gray-400">List block</div>
  )
}
