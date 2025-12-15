import type { ParagraphBlock } from '@shopfunnel/core/funnel/schema'

export interface ParagraphProps {
  block: ParagraphBlock
}

export function Paragraph({ block }: ParagraphProps) {
  return <p className="text-base text-gray-600">{block.properties.text}</p>
}
