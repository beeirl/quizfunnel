import { Combobox } from '@base-ui-components/react/combobox'
import { Badge } from '@beeirl/ui/badge'
import { Button } from '@beeirl/ui/button'
import { Dialog } from '@beeirl/ui/dialog'
import { cn } from '@beeirl/ui/styles'
import type { FunnelSchema } from '@shopfunnel/core/form/schema'
import * as React from 'react'

import { Dropdown } from '@/components/funnel/dropdown'
import { Field } from '@/components/funnel/field'
import { Input } from '@/components/funnel/input'
import { MultipleChoice } from '@/components/funnel/multiple-choice'
import { Icon } from '@/components/icon'

// ============================================================================
// Component Type Metadata
// ============================================================================

interface ComponentTypeInfo {
  type: FunnelSchema.Page.Component['type']
  label: string
  icon: React.ComponentProps<typeof Icon>['name']
  description: string
  createDefault: () => Omit<FunnelSchema.Page.Component, 'id'>
}

const COMPONENT_TYPES: ComponentTypeInfo[] = [
  {
    type: 'short_text',
    label: 'Short Text',
    icon: 'short_text',
    description:
      'Use this to insert a question combined with a short text answer. Add an answer label or placeholder text for guidance.',
    createDefault: () => ({
      type: 'short_text',
      properties: {
        label: 'Your question here',
        description: '',
        placeholder: 'Type your answer...',
      },
      validations: {},
    }),
  },
  {
    type: 'multiple_choice',
    label: 'Multiple Choice',
    icon: 'multiple_choice',
    description:
      'Let users select from a list of predefined options. Supports single or multiple selection with optional images or emojis.',
    createDefault: () => ({
      type: 'multiple_choice',
      properties: {
        label: 'Your question here',
        description: '',
        multiple: false,
        choices: [
          { id: crypto.randomUUID(), label: 'Option 1' },
          { id: crypto.randomUUID(), label: 'Option 2' },
          { id: crypto.randomUUID(), label: 'Option 3' },
        ],
      },
      validations: {},
    }),
  },
  {
    type: 'dropdown',
    label: 'Dropdown',
    icon: 'dropdown',
    description: 'A compact way to present many options. Users can select one option from a dropdown menu.',
    createDefault: () => ({
      type: 'dropdown',
      properties: {
        label: 'Your question here',
        description: '',
        options: [
          { id: crypto.randomUUID(), label: 'Option 1' },
          { id: crypto.randomUUID(), label: 'Option 2' },
          { id: crypto.randomUUID(), label: 'Option 3' },
        ],
      },
      validations: {},
    }),
  },
  {
    type: 'slider',
    label: 'Slider',
    icon: 'slider',
    description: 'Allow users to select a numeric value by dragging a slider between min and max values.',
    createDefault: () => ({
      type: 'slider',
      properties: {
        label: 'Your question here',
        description: '',
        minValue: 0,
        maxValue: 100,
        step: 1,
        defaultValue: 50,
      },
    }),
  },
  {
    type: 'heading',
    label: 'Heading',
    icon: 'heading',
    description: 'Add a title or section header to organize your form and guide users through different sections.',
    createDefault: () => ({
      type: 'heading',
      properties: {
        text: 'Section Title',
      },
    }),
  },
  {
    type: 'paragraph',
    label: 'Paragraph',
    icon: 'paragraph',
    description: 'Add explanatory text, instructions, or additional context to help users understand what to do.',
    createDefault: () => ({
      type: 'paragraph',
      properties: {
        text: 'Add your explanatory text here...',
      },
    }),
  },
  {
    type: 'gauge',
    label: 'Gauge',
    icon: 'gauge',
    description: 'Display a visual gauge to show progress or a value within a range.',
    createDefault: () => ({
      type: 'gauge',
      properties: {
        minValue: 0,
        maxValue: 100,
        step: 1,
        value: '50',
      },
    }),
  },
  {
    type: 'list',
    label: 'List',
    icon: 'list',
    description: 'Display a list of items with icons and text. Great for showing features or benefits.',
    createDefault: () => ({
      type: 'list',
      properties: {
        orientation: 'vertical',
        textPlacement: 'right',
        size: 'sm',
        items: [
          { id: crypto.randomUUID(), icon: '✓', title: 'Item 1' },
          { id: crypto.randomUUID(), icon: '✓', title: 'Item 2' },
          { id: crypto.randomUUID(), icon: '✓', title: 'Item 3' },
        ],
      },
    }),
  },
  {
    type: 'progress',
    label: 'Progress',
    icon: 'progress',
    description: 'Show users how far along they are in completing the form.',
    createDefault: () => ({
      type: 'progress',
    }),
  },
]

// ============================================================================
// Context
// ============================================================================

interface AddComponentDialogContextValue {
  onAddComponent: (afterComponentId: string | null, component: FunnelSchema.Page.Component) => void
  selectedComponentId: string | null
}

const AddComponentDialogContext = React.createContext<AddComponentDialogContextValue | null>(null)

function useAddComponentDialogContext() {
  const context = React.useContext(AddComponentDialogContext)
  if (!context) {
    throw new Error('AddComponentDialog components must be used within AddComponentDialog.Root')
  }
  return context
}

// ============================================================================
// Component Preview
// ============================================================================

function ComponentPreview({ componentType }: { componentType: ComponentTypeInfo }) {
  switch (componentType.type) {
    case 'short_text':
      return (
        <Field mode="preview" label="What is your first name?">
          <Input mode="preview" placeholder="Type your answer here..." />
        </Field>
      )

    case 'multiple_choice':
      return (
        <Field mode="preview" label="How did you hear about us?">
          <MultipleChoice
            mode="preview"
            choices={[
              { id: '1', label: 'Social Media', value: '1' },
              { id: '2', label: 'Friend Referral', value: '2' },
              { id: '3', label: 'Search Engine', value: '3' },
            ]}
          />
        </Field>
      )

    case 'dropdown':
      return (
        <Field mode="preview" label="Select your country">
          <Dropdown
            mode="preview"
            options={[
              { id: '1', label: 'United States', value: '1' },
              { id: '2', label: 'United Kingdom', value: '2' },
              { id: '3', label: 'Canada', value: '3' },
            ]}
            placeholder="Select an option..."
          />
        </Field>
      )

    case 'slider':
      return (
        <Field mode="preview" label="How satisfied are you?" description="Drag the slider to indicate your level">
          <div className="h-2 w-full rounded-full bg-gray-200">
            <div className="h-2 w-1/2 rounded-full bg-accent-500" />
          </div>
        </Field>
      )

    case 'heading':
      return <h2 className="text-2xl font-bold text-gray-900">Section Title</h2>

    case 'paragraph':
      return (
        <p className="text-base text-gray-600">
          This is an example paragraph. Use it to provide additional context or instructions to help guide your users.
        </p>
      )

    case 'gauge':
    case 'list':
    case 'progress':
      return (
        <div className="flex h-24 items-center justify-center rounded-lg bg-gray-100 text-sm text-gray-400">
          {componentType.label} preview
        </div>
      )

    default:
      return null
  }
}

// ============================================================================
// Dialog Components
// ============================================================================

interface RootProps {
  children: React.ReactNode
  onAddComponent: (afterComponentId: string | null, component: FunnelSchema.Page.Component) => void
  selectedComponentId: string | null
}

function Root({ children, onAddComponent, selectedComponentId }: RootProps) {
  return (
    <AddComponentDialogContext.Provider value={{ onAddComponent, selectedComponentId }}>
      <Dialog.Root>{children}</Dialog.Root>
    </AddComponentDialogContext.Provider>
  )
}

interface TriggerProps {
  render: React.ReactElement<Record<string, unknown>>
  children: React.ReactNode
}

interface CloseProps {
  render: React.ReactElement<Record<string, unknown>>
  children: React.ReactNode
  onClick?: () => void
}

function Trigger({ render, children }: TriggerProps) {
  return <Dialog.Trigger render={render}>{children}</Dialog.Trigger>
}

function Close({ render, children, onClick }: CloseProps) {
  return (
    <Dialog.Close render={render} onClick={onClick}>
      {children}
    </Dialog.Close>
  )
}

function Popup() {
  const { onAddComponent, selectedComponentId } = useAddComponentDialogContext()

  const [highlighted, setHighlighted] = React.useState<ComponentTypeInfo | undefined>(COMPONENT_TYPES[0])

  const handleAddComponent = (componentType: ComponentTypeInfo) => {
    const newComponent: FunnelSchema.Page.Component = {
      id: crypto.randomUUID(),
      ...componentType.createDefault(),
    } as FunnelSchema.Page.Component

    onAddComponent(selectedComponentId, newComponent)
  }

  return (
    <Dialog.Popup className="max-w-2xl gap-0 p-0">
      <Combobox.Root
        inline
        autoHighlight
        highlightItemOnHover={false}
        items={COMPONENT_TYPES}
        onItemHighlighted={(itemValue) => {
          setHighlighted(itemValue as ComponentTypeInfo)
        }}
      >
        <div className="flex flex-col">
          {/* Full-width search input */}
          <div className="relative flex h-12 shrink-0 items-center border-b border-gray-200">
            <Icon name="search" className="pointer-events-none absolute left-4.5 size-4 text-gray-400" />
            <Combobox.Input
              className="h-full flex-1 bg-transparent pl-10.5 text-sm outline-none placeholder:text-gray-400"
              placeholder="Find questions, input fields and layout options..."
            />
          </div>

          <div className="flex h-[650px] max-h-[calc(90vh-48px)]">
            {/* Left column: Component list */}
            <div className="flex w-full flex-col overflow-y-auto md:max-w-[250px] md:border-r md:border-gray-200">
              <Combobox.List className="flex flex-col gap-0.5 p-2">
                {(item: ComponentTypeInfo) => (
                  <Combobox.Item
                    key={item.type}
                    value={item}
                    onClick={() => setHighlighted(item)}
                    onDoubleClick={() => handleAddComponent(item)}
                    className={cn(
                      'flex h-8 cursor-pointer items-center gap-2.5 rounded-md px-2.5 text-sm transition-colors outline-none',
                      'hover:bg-gray-100',
                      highlighted?.type === item.type && 'bg-gray-100',
                    )}
                  >
                    <Icon name={item.icon} className="size-4 text-gray-400" />
                    <span className="font-medium">{item.label}</span>
                  </Combobox.Item>
                )}
              </Combobox.List>
            </div>

            {/* Right column: Preview + Insert button */}
            {highlighted && (
              <div className="hidden flex-1 flex-col md:flex">
                <div className="flex flex-1 flex-col overflow-y-auto">
                  <div className="border-b border-gray-200 px-6 pt-5 pb-6">
                    <h2 className="mb-2 text-xl font-bold text-gray-900">{highlighted.label}</h2>
                    <p className="text-sm text-gray-500">{highlighted.description}</p>
                  </div>

                  <div className="flex-1 px-6 pt-5 pb-6">
                    <Badge color="gray" variant="soft" size="md" className="mb-4">
                      Preview
                    </Badge>
                    <ComponentPreview componentType={highlighted} />
                  </div>
                </div>

                <div className="flex shrink-0 justify-end border-t border-gray-200 p-4">
                  <Close render={<Button color="blue" />} onClick={() => handleAddComponent(highlighted)}>
                    Insert
                    <svg className="ml-1.5 size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Close>
                </div>
              </div>
            )}
          </div>
        </div>
      </Combobox.Root>
    </Dialog.Popup>
  )
}

export const AddComponentDialog = { Root, Trigger, Popup, Close }
