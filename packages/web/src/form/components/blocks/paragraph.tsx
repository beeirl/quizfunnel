import type { FormBlock } from '../../types'

export function ParagraphBlock({ block }: ParagraphBlock.Props) {
  return (
    <p className="text-lg leading-relaxed text-neutral-600 dark:text-neutral-400">
      {block.properties.text}
    </p>
  )
}

export namespace ParagraphBlock {
  export interface Props {
    block: Extract<FormBlock, { type: 'paragraph' }>
  }
}

