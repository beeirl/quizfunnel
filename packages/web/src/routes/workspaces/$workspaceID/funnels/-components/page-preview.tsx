import { Dropdown } from '@/components/funnel/dropdown'
import { Field } from '@/components/funnel/field'
import { Input } from '@/components/funnel/input'
import { MultipleChoice } from '@/components/funnel/multiple-choice'
import { cn } from '@beeirl/ui/styles'
import type { FunnelSchema } from '@shopfunnel/core/form/schema'

interface PagePreviewProps {
  components: FunnelSchema.Page.Component[]
  selectedComponentId: string | null
  onSelectComponent: (componentId: string | null) => void
}

export function PagePreview({ components, selectedComponentId, onSelectComponent }: PagePreviewProps) {
  function renderComponent(component: FunnelSchema.Page.Component) {
    switch (component.type) {
      case 'short_text':
        return (
          <Field mode="preview" label={component.properties.label} description={component.properties.description}>
            <Input mode="preview" placeholder="Type your answer here..." />
          </Field>
        )

      case 'multiple_choice': {
        const choices = component.properties.choices.map((choice) => ({
          id: choice.id,
          label: choice.label,
          value: choice.id,
        }))
        return (
          <Field mode="preview" label={component.properties.label} description={component.properties.description}>
            <MultipleChoice mode="preview" choices={choices} />
          </Field>
        )
      }

      case 'dropdown': {
        const options = component.properties.options.map((option) => ({
          id: option.id,
          label: option.label,
          value: option.id,
        }))
        return (
          <Field mode="preview" label={component.properties.label} description={component.properties.description}>
            <Dropdown mode="preview" options={options} placeholder="Select an option..." />
          </Field>
        )
      }

      case 'heading':
        return <h2 className="text-2xl font-bold text-gray-900">{component.properties.text}</h2>

      case 'paragraph':
        return <p className="text-base text-gray-600">{component.properties.text}</p>

      case 'slider':
        return (
          <Field mode="preview" label={component.properties.label} description={component.properties.description}>
            <div className="h-2 w-full rounded-full bg-gray-200">
              <div className="h-2 w-1/2 rounded-full bg-accent-500" />
            </div>
          </Field>
        )

      case 'gauge':
      case 'list':
      case 'progress':
        return (
          <div className="flex h-20 items-center justify-center rounded-lg bg-gray-100 text-sm text-gray-400">
            {component.type.replace('_', ' ')} preview
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="flex flex-1 flex-col bg-white">
      <div className="h-11 w-full" />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto flex w-full max-w-xl flex-col gap-2">
          {components.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <span className="text-lg text-gray-400">No components on this page</span>
              <span className="mt-1 text-sm text-gray-300">Add components from the sidebar</span>
            </div>
          ) : (
            components.map((component) => (
              <div
                key={component.id}
                onClick={() => onSelectComponent(component.id)}
                className={cn(
                  'cursor-pointer rounded-xl p-4 ring ring-transparent transition-all',
                  'hover:ring-gray-200',
                  selectedComponentId === component.id && 'ring-3 ring-accent-200 hover:ring-accent-200',
                )}
              >
                {renderComponent(component)}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
