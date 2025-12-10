import { Select as BaseUISelect } from '@base-ui-components/react/select'
import { CheckIcon, ChevronDownIcon } from '@beeirl/ui/line-icons'
import { cn } from '@beeirl/ui/styles'

interface Option {
  id: string
  label: string
  value: string
}

export type DropdownProps =
  | {
      mode: 'preview'
      options: Option[]
      placeholder?: string
    }
  | {
      mode: 'live'
      options: Option[]
      value?: string
      placeholder?: string
      onValueChange?: (value: string) => void
    }

const triggerClassName =
  'flex w-full items-center justify-between rounded-lg border-2 border-gray-200 bg-white px-4 py-3 text-left text-lg'
const iconClassName = 'size-3.5 text-gray-500'

export function Dropdown(props: DropdownProps) {
  if (props.mode === 'preview') {
    return (
      <div className={triggerClassName}>
        <span className="text-gray-400">{props.placeholder ?? 'Select an option...'}</span>
        <ChevronDownIcon className={iconClassName} />
      </div>
    )
  }

  return (
    <BaseUISelect.Root items={props.options} value={props.value} onValueChange={props.onValueChange}>
      <BaseUISelect.Trigger
        className={cn(triggerClassName, 'transition-colors focus:border-blue-500 focus:outline-none')}
      >
        <BaseUISelect.Value />
        <BaseUISelect.Icon className="transition-transform">
          <ChevronDownIcon className={iconClassName} />
        </BaseUISelect.Icon>
      </BaseUISelect.Trigger>
      <BaseUISelect.Portal>
        <BaseUISelect.Positioner className="z-50 outline-none" sideOffset={4} alignItemWithTrigger={false}>
          <BaseUISelect.Popup className="group max-h-(--available-height) min-w-(--anchor-width) origin-(--transform-origin) overflow-y-auto rounded-lg border border-gray-200 bg-[canvas] bg-clip-padding py-1 text-gray-900 shadow-lg shadow-gray-200 transition-[transform,scale,opacity]">
            <BaseUISelect.List className="max-h-60 overflow-y-auto">
              {props.options.map((option) => (
                <BaseUISelect.Item
                  key={option.id}
                  value={option.id}
                  className="grid cursor-default scroll-my-1 grid-cols-[1fr_0.75rem] items-center gap-2 py-3.5 pr-5.5 pl-4.5 leading-4 outline-none select-none"
                >
                  <BaseUISelect.ItemText className="col-start-1">{option.label}</BaseUISelect.ItemText>
                  <BaseUISelect.ItemIndicator className="col-start-2">
                    <CheckIcon />
                  </BaseUISelect.ItemIndicator>
                </BaseUISelect.Item>
              ))}
            </BaseUISelect.List>
          </BaseUISelect.Popup>
        </BaseUISelect.Positioner>
      </BaseUISelect.Portal>
    </BaseUISelect.Root>
  )
}
