import { cn } from '@/lib/utils'
import type { HeadingBlock as BlockType } from '@shopfunnel/core/quiz/types'

export interface HeadingBlockProps {
  block: BlockType
  static?: boolean
}

export function HeadingBlock(props: HeadingBlockProps) {
  return (
    <div className="group-not-data-first/block:mt-3">
      <span
        className={cn(
          'text-2xl font-bold tracking-tight text-balance text-(--qz-foreground)',
          props.block.properties.alignment === 'center' && 'text-center',
        )}
      >
        {props.block.properties.text}
      </span>
    </div>
  )
}
