import type { SliderBlock } from '@shopfunnel/core/funnel/schema'

import { Field } from './field'

export type SliderProps =
  | {
      mode: 'preview'
      block: SliderBlock
    }
  | {
      mode: 'live'
      block: SliderBlock
      value?: number
      onChange?: (value: number) => void
    }

export function Slider(props: SliderProps) {
  return (
    <Field mode={props.mode} label={props.block.properties.label} description={props.block.properties.description}>
      <div className="flex h-12 items-center justify-center rounded-lg bg-gray-100 text-sm text-gray-400">
        Slider block
      </div>
    </Field>
  )
}
