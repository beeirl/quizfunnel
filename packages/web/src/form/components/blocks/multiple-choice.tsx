import { Checkbox } from '@base-ui-components/react/checkbox'
import { CheckboxGroup } from '@base-ui-components/react/checkbox-group'
import { Radio } from '@base-ui-components/react/radio'
import { RadioGroup } from '@base-ui-components/react/radio-group'
import { cn, cva } from '@beeirl/ui/styles'
import { motion } from 'motion/react'
import * as React from 'react'
import type { FormBlock } from '../../types'
import { Field } from '../field'

const choiceButtonStyles = cva({
  base: 'flex cursor-pointer items-center rounded-xl border-2 gap-4 px-5 py-4 text-left transition-all',
  variants: {
    selected: {
      true: 'border-blue-500 bg-blue-50 ring-2 ring-blue-500/20 dark:border-blue-400 dark:bg-blue-900/20',
      false:
        'border-neutral-200 bg-white hover:border-neutral-300 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:border-neutral-600 dark:hover:bg-neutral-800',
    },
  },
})

const choiceLabelStyles = cva({
  base: 'flex-1 font-medium text-base',
  variants: {
    selected: {
      true: 'text-blue-700 dark:text-blue-300',
      false: 'text-neutral-900 dark:text-white',
    },
  },
})

type Choice = Extract<FormBlock, { type: 'multiple_choice' }>['properties']['choices'][number]

export function MultipleChoiceBlock({
  block,
  value: valueProp,
  onValueChange,
  onValueChangeComplete,
}: MultipleChoiceBlock.Props) {
  const [value, setValue] = React.useState<string | string[]>(valueProp ?? (block.properties.multiple ? [] : ''))
  const [isAnimating, setIsAnimating] = React.useState(false)

  const CheckboxButton = ({ choice }: { choice: Choice }) => {
    const isSelected = Array.isArray(value) && value.includes(choice.id)

    return (
      <label className={cn(choiceButtonStyles({ selected: isSelected }))}>
        {choice.attachment?.type === 'emoji' && <span className="text-2xl">{choice.attachment.emoji}</span>}
        <span className={cn(choiceLabelStyles({ selected: isSelected }))}>{choice.label}</span>
        <Checkbox.Root
          value={choice.id}
          className="flex h-6 w-6 items-center justify-center rounded-md border-2 border-neutral-300 transition-colors data-checked:border-blue-500 data-checked:bg-blue-500 dark:border-neutral-600 dark:data-checked:border-blue-400 dark:data-checked:bg-blue-400"
        >
          <Checkbox.Indicator className="h-4 w-4 text-white">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </Checkbox.Indicator>
        </Checkbox.Root>
      </label>
    )
  }

  const RadioButton = ({ choice }: { choice: Choice }) => {
    const isSelected = value === choice.id
    const shouldAnimate = isAnimating && isSelected

    return (
      <motion.label
        key={shouldAnimate ? 'animating' : 'idle'}
        className={cn(choiceButtonStyles({ selected: isSelected }))}
        initial={false}
        animate={shouldAnimate ? { opacity: [1, 0.3, 1, 0.3, 1, 0.3, 1] } : { opacity: 1 }}
        transition={
          shouldAnimate ? { duration: 1.2, ease: 'linear', times: [0, 0.166, 0.333, 0.5, 0.666, 0.833, 1] } : undefined
        }
        onAnimationComplete={
          shouldAnimate
            ? () => {
                setIsAnimating(false)
                onValueChangeComplete()
              }
            : undefined
        }
      >
        {choice.attachment?.type === 'emoji' && <span className="text-2xl">{choice.attachment.emoji}</span>}
        <span className={cn(choiceLabelStyles({ selected: isSelected }))}>{choice.label}</span>
        <Radio.Root
          value={choice.id}
          className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-neutral-300 transition-colors data-checked:border-blue-500 dark:border-neutral-600 dark:data-checked:border-blue-400"
        >
          <Radio.Indicator className="h-3 w-3 rounded-full bg-blue-500 dark:bg-blue-400" />
        </Radio.Root>
      </motion.label>
    )
  }

  return (
    <Field label={block.properties.label} description={block.properties.description}>
      {block.properties.multiple ? (
        <CheckboxGroup
          value={Array.isArray(value) ? value : []}
          onValueChange={(newValue) => {
            setValue(newValue)
            onValueChange(newValue)
          }}
          className="grid gap-3"
        >
          {block.properties.choices.map((choice) => (
            <CheckboxButton key={choice.id} choice={choice} />
          ))}
        </CheckboxGroup>
      ) : (
        <RadioGroup
          value={typeof value === 'string' ? value : ''}
          onValueChange={(newValue: string) => {
            setIsAnimating(true)
            setValue(newValue)
            onValueChange(newValue)
          }}
          className="grid gap-3"
        >
          {block.properties.choices.map((choice) => (
            <RadioButton key={choice.id} choice={choice} />
          ))}
        </RadioGroup>
      )}
    </Field>
  )
}

export namespace MultipleChoiceBlock {
  export interface Props {
    block: Extract<FormBlock, { type: 'multiple_choice' }>
    value?: string | string[]
    onValueChange: (value: string | string[]) => void
    onValueChangeComplete: () => void
  }
}
