import { Select } from '@base-ui-components/react/select'
import { Field } from '../field'
import type { FormBlock } from '../../types'

export function DropdownBlock({ block, value, onValueChange }: DropdownBlock.Props) {
  const currentValue = value ?? null

  const handleValueChange = (value: string | null) => {
    if (value === null) return
    const option = block.properties.options.find((opt) => opt.id === value)
    if (option) {
      onValueChange(option.id)
    }
  }

  return (
    <Field label={block.properties.label} description={block.properties.description}>
      <Select.Root value={currentValue} onValueChange={handleValueChange}>
        <Select.Trigger className="flex w-full items-center justify-between rounded-lg border border-neutral-300 bg-white px-4 py-3 text-left text-lg transition-colors hover:border-neutral-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none data-popup-open:border-blue-500 data-popup-open:ring-2 data-popup-open:ring-blue-500/20 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:border-neutral-600">
          <Select.Value className="text-neutral-900 data-placeholder:text-neutral-500 dark:text-white dark:data-placeholder:text-neutral-400">
            {(value: string | null) => {
              if (!value) return 'Select an option...'
              const option = block.properties.options.find((opt) => opt.id === value)
              return option?.label ?? 'Select an option...'
            }}
          </Select.Value>
          <Select.Icon className="flex text-neutral-500 transition-transform data-popup-open:rotate-180">
            <ChevronDownIcon />
          </Select.Icon>
        </Select.Trigger>

        <Select.Portal>
          <Select.Positioner className="z-50 outline-none" sideOffset={4} alignItemWithTrigger={false}>
            <Select.Popup className="origin-[--transform-origin] rounded-lg border border-neutral-200 bg-white py-1 shadow-lg transition-[transform,scale,opacity] data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0 dark:border-neutral-700 dark:bg-neutral-900">
              <Select.List className="max-h-60 overflow-y-auto">
                {block.properties.options.map((option) => (
                  <Select.Item
                    key={option.id}
                    value={option.id}
                    className="grid min-w-[--anchor-width] cursor-default grid-cols-[1rem_1fr] items-center gap-2 px-3 py-2.5 text-neutral-900 outline-none select-none data-highlighted:bg-neutral-100 data-selected:font-medium dark:text-white dark:data-highlighted:bg-neutral-800"
                  >
                    <Select.ItemIndicator className="col-start-1">
                      <CheckIcon />
                    </Select.ItemIndicator>
                    <Select.ItemText className="col-start-2">{option.label}</Select.ItemText>
                  </Select.Item>
                ))}
              </Select.List>
            </Select.Popup>
          </Select.Positioner>
        </Select.Portal>
      </Select.Root>
    </Field>
  )
}

export namespace DropdownBlock {
  export interface Props {
    block: Extract<FormBlock, { type: 'dropdown' }>
    value?: string
    onValueChange: (value: string) => void
  }
}

function ChevronDownIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M6 9l6 6 6-6" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 10 10">
      <path d="M9.1603 1.12218C9.50684 1.34873 9.60427 1.81354 9.37792 2.16038L5.13603 8.66012C5.01614 8.8438 4.82192 8.96576 4.60451 8.99384C4.3871 9.02194 4.1683 8.95335 4.00574 8.80615L1.24664 6.30769C0.939709 6.02975 0.916013 5.55541 1.19372 5.24822C1.47142 4.94102 1.94536 4.91731 2.2523 5.19524L4.36085 7.10461L8.12299 1.33999C8.34934 0.993152 8.81376 0.895638 9.1603 1.12218Z" />
    </svg>
  )
}

