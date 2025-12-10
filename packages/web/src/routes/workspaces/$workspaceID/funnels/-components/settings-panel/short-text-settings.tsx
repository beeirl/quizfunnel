import { Field } from '@beeirl/ui/field'
import { Input } from '@beeirl/ui/input'
import { Switch } from '@beeirl/ui/switch'
import type { Funnel } from '@shopfunnel/core/funnel/index'
import { Section } from './section'

interface ShortTextSettingsProps {
  block: Funnel.Page.ShortTextBlock
  onUpdate: (updates: Partial<Funnel.Page.ShortTextBlock>) => void
}

export function ShortTextSettings({ block, onUpdate }: ShortTextSettingsProps) {
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
          <Section.Title>Validations</Section.Title>
        </Section.Header>
        <Section.Content>
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
          <Field.Root orientation="horizontal">
            <Field.Label>Email validation</Field.Label>
            <Switch
              checked={block.validations.email ?? false}
              onCheckedChange={(email) =>
                onUpdate({
                  validations: { ...block.validations, email },
                })
              }
            />
          </Field.Root>
          {block.validations.email === false && (
            <Field.Root size="sm">
              <Field.Label>Max length</Field.Label>
              <Input
                value={block.validations.maxLength?.toString() ?? ''}
                placeholder="No limit"
                onValueChange={(value) => {
                  const maxLength = value ? parseInt(value, 10) : undefined
                  onUpdate({
                    validations: { ...block.validations, maxLength: isNaN(maxLength!) ? undefined : maxLength },
                  })
                }}
              />
            </Field.Root>
          )}
        </Section.Content>
      </Section.Root>
    </div>
  )
}
