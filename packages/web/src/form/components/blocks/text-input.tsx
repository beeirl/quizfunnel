import * as React from 'react'
import type { FormBlock } from '../../types'
import { Field } from '../field'

export function TextInputBlock({ block, value: valueProp, error, onValueChange }: TextInputBlock.Props) {
  const [value, setValue] = React.useState(valueProp ?? '')

  React.useEffect(() => {
    setValue(valueProp ?? '')
  }, [valueProp])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setValue(newValue)
    onValueChange(newValue)
  }

  return (
    <Field label={block.properties.label} description={block.properties.description} error={error}>
      <input
        type={block.validations.email ? 'email' : 'text'}
        value={value}
        onChange={handleChange}
        maxLength={block.validations.maxLength}
        className={`w-full rounded-lg border bg-white px-4 py-3 text-lg transition-colors placeholder:text-neutral-400 focus:ring-2 focus:ring-offset-2 focus:outline-none dark:bg-neutral-900 dark:placeholder:text-neutral-500 dark:focus:ring-offset-neutral-900 ${
          error
            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
            : 'border-neutral-300 focus:border-blue-500 focus:ring-blue-500/20 dark:border-neutral-700'
        }`}
        placeholder={block.validations.email ? 'Enter your email' : 'Type your answer...'}
      />
    </Field>
  )
}

export namespace TextInputBlock {
  export interface Props {
    block: Extract<FormBlock, { type: 'text_input' }>
    value?: string
    error?: string
    onValueChange: (value: string) => void
  }
}
