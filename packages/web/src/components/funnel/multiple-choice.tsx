import { cn } from '@beeirl/ui/styles'
import { ListBox as ReactAriaListbox, ListBoxItem as ReactAriaListboxItem } from 'react-aria-components'

interface Choice {
  id: string
  label: string
  value: string
  attachment?: {
    type: 'emoji' | 'image'
    value: string
  }
}

export type MultipleChoiceProps =
  | {
      mode: 'preview'
      choices: Choice[]
    }
  | {
      mode: 'live'
      choices: Choice[]
      multiple?: boolean
      value?: string | string[] | null
      onValueChange?: (value: string | string[] | null) => void
    }

export function MultipleChoice(props: MultipleChoiceProps) {
  const isPreview = props.mode === 'preview'

  return (
    <ReactAriaListbox
      className="flex flex-col gap-2"
      disallowEmptySelection={isPreview ? false : !props.multiple}
      selectionMode={isPreview ? 'none' : props.multiple ? 'multiple' : 'single'}
      selectedKeys={
        isPreview ? undefined : Array.isArray(props.value) ? props.value : props.value ? [props.value] : undefined
      }
      onSelectionChange={(selection) => {
        if (isPreview) return
        if (selection === 'all') return
        const value = Array.from(selection) as string[]
        props.onValueChange?.(props.multiple ? value : (value[0] ?? null))
      }}
    >
      {props.choices.map((choice) => (
        <ReactAriaListboxItem
          key={choice.id}
          id={choice.id}
          isDisabled={isPreview}
          className={cn(
            'relative flex items-center gap-3.5 rounded-xl border-2 border-gray-200 bg-white px-4.5 py-3.5 text-left transition-all outline-none',
            !isPreview && [
              'cursor-pointer',
              'hover:border-gray-300 hover:bg-gray-50',
              'data-focused:border-blue-500 data-focused:bg-blue-50',
              'data-selected:border-blue-500',
            ],
          )}
        >
          {choice.attachment?.type === 'emoji' && <span className="text-xl">{choice.attachment.value}</span>}
          <span className="flex-1 text-base font-semibold text-gray-900">{choice.label}</span>
        </ReactAriaListboxItem>
      ))}
    </ReactAriaListbox>
  )
}
