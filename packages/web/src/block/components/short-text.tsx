import { Input as BaseInput } from '@base-ui-components/react/input'
import { cn } from '@beeirl/ui/styles'
import type { ShortTextBlock } from '@shopfunnel/core/funnel/schema'

import { Field } from './field'

export type ShortTextProps =
  | {
      mode: 'preview'
      block: ShortTextBlock
    }
  | {
      mode: 'live'
      block: ShortTextBlock
      value?: string
      onChange?: (value: string) => void
    }

export function ShortText(props: ShortTextProps) {
  return (
    <Field mode={props.mode} label={props.block.properties.label} description={props.block.properties.description}>
      <BaseInput
        className={cn(
          'w-full rounded-lg border-2 border-gray-200 bg-white px-4 py-2.5 text-base transition-colors placeholder:text-gray-400',
          'focus:border-blue-500 focus:outline-none',
          'data-invalid:border-red-500',
          props.mode === 'preview' && 'pointer-events-none',
        )}
        disabled={props.mode === 'preview'}
        placeholder={props.block.properties.placeholder}
        type={props.block.validations.email ? 'email' : 'text'}
        value={props.mode === 'preview' ? undefined : props.value}
        onChange={props.mode === 'preview' ? undefined : (e) => props.onChange?.(e.target.value)}
      />
    </Field>
  )
}
