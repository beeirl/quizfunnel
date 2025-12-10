import { Select as BaseSelect } from '@base-ui-components/react/select'
import { CheckIcon, ChevronDownIcon } from '@beeirl/ui/line-icons'
import { cn } from '@beeirl/ui/styles'
import type { Funnel } from '@shopfunnel/core/funnel/index'

import { Field } from './field'

export type DropdownBlockProps =
  | {
      mode: 'preview'
      block: Funnel.Page.DropdownBlock
    }
  | {
      mode: 'live'
      block: Funnel.Page.DropdownBlock
      value?: string
      onValueChange?: (value: string) => void
    }

const triggerClassName =
  'flex w-full items-center justify-between rounded-lg border-2 border-gray-200 bg-white px-4 py-3 text-left text-lg'
const iconClassName = 'size-3.5 text-gray-500'

export function DropdownBlock(props: DropdownBlockProps) {
  const { mode, block } = props

  const options = block.properties.options.map((option) => ({
    id: option.id,
    label: option.label,
    value: option.id,
  }))

  return (
    <Field mode={mode} label={block.properties.label} description={block.properties.description}>
      {props.mode === 'preview' ? (
        <div className={triggerClassName}>
          <span className="text-gray-400">Select an option...</span>
          <ChevronDownIcon className={iconClassName} />
        </div>
      ) : (
        <BaseSelect.Root items={options} value={props.value} onValueChange={props.onValueChange}>
          <BaseSelect.Trigger
            className={cn(triggerClassName, 'transition-colors focus:border-blue-500 focus:outline-none')}
          >
            <BaseSelect.Value />
            <BaseSelect.Icon className="transition-transform">
              <ChevronDownIcon className={iconClassName} />
            </BaseSelect.Icon>
          </BaseSelect.Trigger>
          <BaseSelect.Portal>
            <BaseSelect.Positioner className="z-50 outline-none" sideOffset={4} alignItemWithTrigger={false}>
              <BaseSelect.Popup className="group max-h-(--available-height) min-w-(--anchor-width) origin-(--transform-origin) overflow-y-auto rounded-lg border border-gray-200 bg-[canvas] bg-clip-padding py-1 text-gray-900 shadow-lg shadow-gray-200 transition-[transform,scale,opacity]">
                <BaseSelect.List className="max-h-60 overflow-y-auto">
                  {options.map((option) => (
                    <BaseSelect.Item
                      key={option.id}
                      value={option.id}
                      className="grid cursor-default scroll-my-1 grid-cols-[1fr_0.75rem] items-center gap-2 py-3.5 pr-5.5 pl-4.5 leading-4 outline-none select-none"
                    >
                      <BaseSelect.ItemText className="col-start-1">{option.label}</BaseSelect.ItemText>
                      <BaseSelect.ItemIndicator className="col-start-2">
                        <CheckIcon />
                      </BaseSelect.ItemIndicator>
                    </BaseSelect.Item>
                  ))}
                </BaseSelect.List>
              </BaseSelect.Popup>
            </BaseSelect.Positioner>
          </BaseSelect.Portal>
        </BaseSelect.Root>
      )}
    </Field>
  )
}
