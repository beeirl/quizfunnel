import { IconButton } from '@beeirl/ui/icon-button'
import { PlusIcon } from '@beeirl/ui/line-icons'
import { cn } from '@beeirl/ui/styles'
import { move } from '@dnd-kit/helpers'
import { DragDropProvider } from '@dnd-kit/react'
import { useSortable } from '@dnd-kit/react/sortable'
import type { FunnelSchema } from '@shopfunnel/core/form/schema'

import { Icon } from '@/components/icon'
import { AddComponentDialog } from './add-component-dialog'

interface ComponentsSidebarProps {
  components: FunnelSchema.Page.Component[]
  selectedComponentId: string | null
  onSelectComponent: (componentId: string | null) => void
  onReorderComponents: (components: FunnelSchema.Page.Component[]) => void
  onAddComponent: (afterComponentId: string | null, component: FunnelSchema.Page.Component) => void
}

const COMPONENT_ICONS: Record<FunnelSchema.Page.Component['type'], React.ComponentProps<typeof Icon>['name']> = {
  short_text: 'short_text',
  multiple_choice: 'multiple_choice',
  dropdown: 'dropdown',
  slider: 'slider',
  heading: 'heading',
  paragraph: 'paragraph',
  gauge: 'gauge',
  list: 'list',
  progress: 'progress',
}

const COMPONENT_LABELS: Record<FunnelSchema.Page.Component['type'], string> = {
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

function getComponentLabel(component: FunnelSchema.Page.Component): string {
  return COMPONENT_LABELS[component.type]
}

function ComponentItem({
  component,
  index,
  selected,
  onSelect,
}: {
  component: FunnelSchema.Page.Component
  index: number
  selected: boolean
  onSelect: () => void
}) {
  const { ref } = useSortable({ id: component.id, index })
  const icon = COMPONENT_ICONS[component.type]
  const label = getComponentLabel(component)

  return (
    <div
      ref={ref}
      onClick={onSelect}
      className={cn(
        'flex h-8 cursor-grab items-center gap-2.5 rounded-md bg-white px-2.5 transition-all hover:bg-gray-100',
        selected && 'bg-gray-100 hover:bg-gray-100',
      )}
    >
      <Icon name={icon} className="size-4 text-gray-400" />
      <span className="flex-1 truncate text-sm font-medium">{label}</span>
    </div>
  )
}

export function ComponentsSidebar({
  components,
  selectedComponentId,
  onSelectComponent,
  onReorderComponents,
  onAddComponent,
}: ComponentsSidebarProps) {
  return (
    <div className="flex w-[220px] flex-col border-r border-gray-200 bg-white">
      <div className="flex h-11 items-center justify-between border-b border-gray-200 px-4">
        <span className="text-xs-plus font-medium">Components</span>
        <AddComponentDialog.Root onAddComponent={onAddComponent} selectedComponentId={selectedComponentId}>
          <AddComponentDialog.Trigger render={<IconButton color="gray" size="sm" variant="ghost" />}>
            <PlusIcon />
          </AddComponentDialog.Trigger>
          <AddComponentDialog.Popup />
        </AddComponentDialog.Root>
      </div>
      <div className="flex-1 overflow-y-auto p-3">
        {components.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <span className="text-sm text-gray-400">No components yet</span>
          </div>
        ) : (
          <DragDropProvider
            onDragEnd={(event) => {
              onReorderComponents(move(components, event))
            }}
          >
            <div className="flex flex-col gap-0.5">
              {components.map((component, index) => (
                <ComponentItem
                  key={component.id}
                  component={component}
                  index={index}
                  selected={selectedComponentId === component.id}
                  onSelect={() => onSelectComponent(component.id)}
                />
              ))}
            </div>
          </DragDropProvider>
        )}
      </div>
    </div>
  )
}
