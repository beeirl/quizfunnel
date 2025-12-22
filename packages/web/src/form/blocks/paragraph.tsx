import type { ParagraphBlock as ParagraphBlockData } from '@shopfunnel/core/form/types'

export interface ParagraphBlockProps {
  data: ParagraphBlockData
  static?: boolean
}

export function ParagraphBlock(props: ParagraphBlockProps) {
  return <p className="text-base text-muted-foreground">{props.data.properties.text}</p>
}
