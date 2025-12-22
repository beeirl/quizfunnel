import type { HeadingBlock as HeadingBlockData } from '@shopfunnel/core/form/types'

export interface HeadingBlockProps {
  static: boolean
  data: HeadingBlockData
}

export function HeadingBlock(props: HeadingBlockProps) {
  return <h2 className="text-2xl font-bold text-foreground">{props.data.properties.text}</h2>
}
