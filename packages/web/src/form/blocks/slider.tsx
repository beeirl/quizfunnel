import { Field } from '@/form/components/field'
import type { SliderBlock as SliderBlockData } from '@shopfunnel/core/form/types'

export interface SliderBlockProps {
  data: SliderBlockData
  static?: boolean
  value?: number
  onValueChange?: (value: number) => void
}

export function SliderBlock(props: SliderBlockProps) {
  return (
    <Field static={props.static} label={props.data.properties.label} description={props.data.properties.description}>
      <div className="flex h-12 items-center justify-center rounded-(--radius) bg-muted text-sm text-muted-foreground">
        Slider block
      </div>
    </Field>
  )
}
