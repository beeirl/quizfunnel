import type { Funnel } from '@shopfunnel/core/funnel/index'

export interface ListBlockProps {
  block: Funnel.Page.ListBlock
}

export function ListBlock(_props: ListBlockProps) {
  return (
    <div className="flex h-12 items-center justify-center rounded-lg bg-gray-100 text-sm text-gray-400">List block</div>
  )
}
