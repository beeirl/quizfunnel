import type { FormBlock } from '../../types'

export function HeadingBlock({ block }: HeadingBlock.Props) {
  return (
    <h1 className="'font-bold sm:text-4xl' text-3xl tracking-tight text-neutral-900 dark:text-white">
      {block.properties.text}
    </h1>
  )
}

export namespace HeadingBlock {
  export interface Props {
    block: Extract<FormBlock, { type: 'heading' }>
  }
}
