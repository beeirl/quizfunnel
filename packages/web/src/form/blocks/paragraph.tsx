import { cn } from '@/lib/utils'
import type { ParagraphBlock as ParagraphBlockData } from '@shopfunnel/core/form/types'

export interface ParagraphBlockProps {
  data: ParagraphBlockData
  index: number
  static?: boolean
}

export function ParagraphBlock(props: ParagraphBlockProps) {
  return (
    <div className={cn(props.index > 0 && 'mt-3')}>
      <p
        className={cn(
          'text-[0.9375rem] tracking-tight text-balance text-(--sf-color-foreground)/70',
          props.data.properties.alignment === 'center' && 'text-center',
        )}
      >
        {props.data.properties.text}
      </p>
    </div>
  )
}
