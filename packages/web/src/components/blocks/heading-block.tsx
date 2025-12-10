import type { Funnel } from '@shopfunnel/core/funnel/index'

export interface HeadingBlockProps {
  block: Funnel.Page.HeadingBlock
}

export function HeadingBlock(_props: HeadingBlockProps) {
  return (
    <div className="flex h-12 items-center justify-center rounded-lg bg-gray-100 text-sm text-gray-400">
      Heading block
    </div>
  )
}
