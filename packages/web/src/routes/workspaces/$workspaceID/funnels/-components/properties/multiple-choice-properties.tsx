import { Field } from '@beeirl/ui/field'
import { IconButton } from '@beeirl/ui/icon-button'
import { Input } from '@beeirl/ui/input'
import { PlusIcon, TrashIcon } from '@beeirl/ui/line-icons'
import { Switch } from '@beeirl/ui/switch'
import { move } from '@dnd-kit/helpers'
import { DragDropProvider, PointerSensor } from '@dnd-kit/react'
import { useSortable } from '@dnd-kit/react/sortable'
import type { FunnelSchema } from '@shopfunnel/core/form/schema'

import { Property } from '../property'

type Choice = FunnelSchema.Page.MultipleChoiceComponent['properties']['choices'][number]

interface MultipleChoicePropertiesProps {
  component: FunnelSchema.Page.MultipleChoiceComponent
  onUpdate: (updates: Partial<FunnelSchema.Page.MultipleChoiceComponent>) => void
}

function ChoiceItem({
  choice,
  index,
  onUpdate,
  onDelete,
}: {
  choice: Choice
  index: number
  onUpdate: (updates: Partial<Choice>) => void
  onDelete: () => void
}) {
  const { ref } = useSortable({ id: choice.id, index })

  return (
    <div ref={ref} className="flex items-center gap-2">
      <Input
        className="flex-1"
        value={choice.label}
        placeholder="Choice label..."
        onValueChange={(label) => onUpdate({ label })}
        onMouseDown={(e) => e.stopPropagation()}
      />
      <IconButton className="mx-0" color="gray" size="sm" variant="ghost" onClick={onDelete}>
        <TrashIcon />
      </IconButton>
    </div>
  )
}

export function MultipleChoiceProperties({ component, onUpdate }: MultipleChoicePropertiesProps) {
  const choices = component.properties.choices

  const handleChoiceUpdate = (choiceId: string, updates: Partial<Choice>) => {
    onUpdate({
      properties: {
        ...component.properties,
        choices: choices.map((c) => (c.id === choiceId ? { ...c, ...updates } : c)),
      },
    })
  }

  const handleChoiceDelete = (choiceId: string) => {
    onUpdate({
      properties: {
        ...component.properties,
        choices: choices.filter((c) => c.id !== choiceId),
      },
    })
  }

  const handleChoiceAdd = () => {
    const newChoice: Choice = {
      id: `choice-${Date.now()}`,
      label: '',
    }
    onUpdate({
      properties: {
        ...component.properties,
        choices: [...choices, newChoice],
      },
    })
  }

  const handleChoicesReorder = (newChoices: Choice[]) => {
    onUpdate({
      properties: {
        ...component.properties,
        choices: newChoices,
      },
    })
  }

  return (
    <div>
      <Property.Root>
        <Property.Header>
          <Property.Title>Label</Property.Title>
        </Property.Header>
        <Property.Content>
          <Input
            value={component.properties.label}
            placeholder="Enter label..."
            onValueChange={(label) =>
              onUpdate({
                properties: { ...component.properties, label },
              })
            }
          />
        </Property.Content>
      </Property.Root>

      <Property.Root>
        <Property.Header>
          <Property.Title>Description</Property.Title>
        </Property.Header>
        <Property.Content>
          <Input
            value={component.properties.description ?? ''}
            placeholder="Enter description..."
            onValueChange={(description) =>
              onUpdate({
                properties: { ...component.properties, description: description || undefined },
              })
            }
          />
        </Property.Content>
      </Property.Root>

      <Property.Root>
        <Property.Header>
          <Property.Title>Choices</Property.Title>
          <IconButton className="mx-0" color="gray" size="sm" variant="ghost" onClick={handleChoiceAdd}>
            <PlusIcon />
          </IconButton>
        </Property.Header>
        <Property.Content>
          <DragDropProvider
            sensors={[
              PointerSensor.configure({
                activationConstraints: {
                  delay: {
                    value: 100,
                    tolerance: 5,
                  },
                },
              }),
            ]}
            onDragEnd={(event) => handleChoicesReorder(move(choices, event))}
          >
            <div className="flex flex-col gap-2">
              {choices.map((choice, index) => (
                <ChoiceItem
                  key={choice.id}
                  choice={choice}
                  index={index}
                  onUpdate={(updates) => handleChoiceUpdate(choice.id, updates)}
                  onDelete={() => handleChoiceDelete(choice.id)}
                />
              ))}
            </div>
          </DragDropProvider>
          {choices.length === 0 && (
            <div className="flex items-center justify-center py-4 text-sm text-gray-400">No choices yet</div>
          )}
        </Property.Content>
      </Property.Root>

      <Property.Root>
        <Property.Header>
          <Property.Title>Options</Property.Title>
        </Property.Header>
        <Property.Content>
          <Field.Root orientation="horizontal">
            <Field.Label>Allow multiple selections</Field.Label>
            <Switch
              checked={component.properties.multiple ?? false}
              onCheckedChange={(multiple) =>
                onUpdate({
                  properties: { ...component.properties, multiple },
                })
              }
            />
          </Field.Root>
          <Field.Root orientation="horizontal">
            <Field.Label>Required</Field.Label>
            <Switch
              checked={component.validations.required ?? false}
              onCheckedChange={(required) =>
                onUpdate({
                  validations: { ...component.validations, required },
                })
              }
            />
          </Field.Root>
        </Property.Content>
      </Property.Root>
    </div>
  )
}
