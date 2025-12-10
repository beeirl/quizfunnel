import type { Funnel } from '@shopfunnel/core/funnel/index'

export interface ParagraphBlockProps {
  block: Funnel.Page.ParagraphBlock
}

export function ParagraphBlock(_props: ParagraphBlockProps) {
  return (
    <div className="flex h-12 items-center justify-center rounded-lg bg-gray-100 text-sm text-gray-400">
      Paragraph block
    </div>
  )
}
