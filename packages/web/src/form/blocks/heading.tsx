import { cn } from '@/lib/utils'
import type { HeadingBlock as HeadingBlockData } from '@shopfunnel/core/form/types'

export interface HeadingBlockProps {
  data: HeadingBlockData
  index: number
  static?: boolean
}

export function HeadingBlock(props: HeadingBlockProps) {
  return (
    <div className={cn(props.index > 0 && 'mt-3')}>
      <h2
        className={cn(
          'text-2xl font-bold tracking-tight text-balance text-(--sf-color-foreground)',
          props.data.properties.alignment === 'center' && 'text-center',
        )}
      >
        {props.data.properties.text}
      </h2>
    </div>
  )
}
