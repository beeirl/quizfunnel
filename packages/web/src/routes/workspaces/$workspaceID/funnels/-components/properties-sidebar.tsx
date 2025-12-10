import type { FunnelSchema } from '@shopfunnel/core/form/schema'
import { MultipleChoiceProperties } from './properties/multiple-choice-properties'
import { ShortTextProperties } from './properties/short-text-properties'

const COMPONENT_TYPE_LABELS: Record<FunnelSchema.Page.Component['type'], string> = {
  short_text: 'Short Text',
  multiple_choice: 'Multiple Choice',
  dropdown: 'Dropdown',
  slider: 'Slider',
  heading: 'Heading',
  paragraph: 'Paragraph',
  gauge: 'Gauge',
  list: 'List',
  progress: 'Progress',
}

interface PropertiesSidebarProps {
  component: FunnelSchema.Page.Component
  onUpdateComponent: (componentId: string, updates: Partial<FunnelSchema.Page.Component>) => void
}

export function PropertiesSidebar({ component, onUpdateComponent }: PropertiesSidebarProps) {
  const typeLabel = COMPONENT_TYPE_LABELS[component.type]

  const handleUpdate = (updates: Partial<FunnelSchema.Page.Component>) => {
    onUpdateComponent(component.id, updates)
  }

  const renderProperties = () => {
    switch (component.type) {
      case 'short_text':
        return (
          <ShortTextProperties
            component={component}
            onUpdate={handleUpdate as (updates: Partial<FunnelSchema.Page.ShortTextComponent>) => void}
          />
        )
      case 'multiple_choice':
        return (
          <MultipleChoiceProperties
            component={component}
            onUpdate={handleUpdate as (updates: Partial<FunnelSchema.Page.MultipleChoiceComponent>) => void}
          />
        )
      default:
        return (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <span className="text-sm text-gray-400">Properties editor not yet implemented</span>
            <span className="mt-1 text-xs text-gray-300">for {typeLabel}</span>
          </div>
        )
    }
  }

  return (
    <div className="flex w-[300px] flex-col border-l border-gray-200 bg-white">
      <div className="flex h-11 items-center border-b border-gray-200 px-4">
        <span className="text-xs-plus font-medium">{typeLabel}</span>
      </div>
      <div className="flex-1 overflow-y-auto">{renderProperties()}</div>
    </div>
  )
}
