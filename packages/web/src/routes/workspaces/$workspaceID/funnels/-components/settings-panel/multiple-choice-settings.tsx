import { Field } from '@beeirl/ui/field'
import { IconButton } from '@beeirl/ui/icon-button'
import { Input } from '@beeirl/ui/input'
import { PlusIcon, TrashIcon } from '@beeirl/ui/line-icons'
import { Switch } from '@beeirl/ui/switch'
import { move } from '@dnd-kit/helpers'
import { DragDropProvider, PointerSensor } from '@dnd-kit/react'
import { useSortable } from '@dnd-kit/react/sortable'
import type { Funnel } from '@shopfunnel/core/funnel/index'
import { Section } from './section'

type Choice = Funnel.Page.MultipleChoiceBlock['properties']['choices'][number]

interface MultipleChoiceSettingsProps {
  block: Funnel.Page.MultipleChoiceBlock
  onUpdate: (updates: Partial<Funnel.Page.MultipleChoiceBlock>) => void
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

export function MultipleChoiceSettings({ block, onUpdate }: MultipleChoiceSettingsProps) {
  const choices = block.properties.choices

  const handleChoiceUpdate = (choiceId: string, updates: Partial<Choice>) => {
    onUpdate({
      properties: {
        ...block.properties,
        choices: choices.map((c) => (c.id === choiceId ? { ...c, ...updates } : c)),
      },
    })
  }

  const handleChoiceDelete = (choiceId: string) => {
    onUpdate({
      properties: {
        ...block.properties,
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
        ...block.properties,
        choices: [...choices, newChoice],
      },
    })
  }

  const handleChoicesReorder = (newChoices: Choice[]) => {
    onUpdate({
      properties: {
        ...block.properties,
        choices: newChoices,
      },
    })
  }

  return (
    <div>
      <Section.Root>
        <Section.Header>
          <Section.Title>Label</Section.Title>
        </Section.Header>
        <Section.Content>
          <Input
            value={block.properties.label}
            placeholder="Enter label..."
            onValueChange={(label) =>
              onUpdate({
                properties: { ...block.properties, label },
              })
            }
          />
        </Section.Content>
      </Section.Root>

      <Section.Root>
        <Section.Header>
          <Section.Title>Description</Section.Title>
        </Section.Header>
        <Section.Content>
          <Input
            value={block.properties.description ?? ''}
            placeholder="Enter description..."
            onValueChange={(description) =>
              onUpdate({
                properties: { ...block.properties, description: description || undefined },
              })
            }
          />
        </Section.Content>
      </Section.Root>

      <Section.Root>
        <Section.Header>
          <Section.Title>Choices</Section.Title>
          <IconButton className="mx-0" color="gray" size="sm" variant="ghost" onClick={handleChoiceAdd}>
            <PlusIcon />
          </IconButton>
        </Section.Header>
        <Section.Content>
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
        </Section.Content>
      </Section.Root>

      <Section.Root>
        <Section.Header>
          <Section.Title>Options</Section.Title>
        </Section.Header>
        <Section.Content>
          <Field.Root orientation="horizontal">
            <Field.Label>Allow multiple selections</Field.Label>
            <Switch
              checked={block.properties.multiple ?? false}
              onCheckedChange={(multiple) =>
                onUpdate({
                  properties: { ...block.properties, multiple },
                })
              }
            />
          </Field.Root>
          <Field.Root orientation="horizontal">
            <Field.Label>Required</Field.Label>
            <Switch
              checked={block.validations.required ?? false}
              onCheckedChange={(required) =>
                onUpdate({
                  validations: { ...block.validations, required },
                })
              }
            />
          </Field.Root>
        </Section.Content>
      </Section.Root>
    </div>
  )
}
