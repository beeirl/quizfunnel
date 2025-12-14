import type { HeadingBlock } from '@shopfunnel/core/funnel/schema'

export interface HeadingProps {
  block: HeadingBlock
}

export function Heading({ block }: HeadingProps) {
  return <h2 className="text-2xl font-bold text-gray-900">{block.properties.text}</h2>
}
