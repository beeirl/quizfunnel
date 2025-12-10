import type { Funnel } from '@shopfunnel/core/funnel/index'

import { Field } from './field'

export type SliderBlockProps =
  | {
      mode: 'preview'
      block: Funnel.Page.SliderBlock
    }
  | {
      mode: 'live'
      block: Funnel.Page.SliderBlock
      value?: number
      onValueChange?: (value: number) => void
    }

export function SliderBlock(props: SliderBlockProps) {
  return (
    <Field mode={props.mode} label={props.block.properties.label} description={props.block.properties.description}>
      <div className="flex h-12 items-center justify-center rounded-lg bg-gray-100 text-sm text-gray-400">
        Slider block
      </div>
    </Field>
  )
}
