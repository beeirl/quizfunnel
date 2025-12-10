import { Field } from '@beeirl/ui/field'
import { Input } from '@beeirl/ui/input'
import { Switch } from '@beeirl/ui/switch'
import type { FunnelSchema } from '@shopfunnel/core/form/schema'

import { Property } from '../property'

interface ShortTextPropertiesProps {
  component: FunnelSchema.Page.ShortTextComponent
  onUpdate: (updates: Partial<FunnelSchema.Page.ShortTextComponent>) => void
}

export function ShortTextProperties({ component, onUpdate }: ShortTextPropertiesProps) {
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
          <Property.Title>Validations</Property.Title>
        </Property.Header>
        <Property.Content>
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
          <Field.Root orientation="horizontal">
            <Field.Label>Email validation</Field.Label>
            <Switch
              checked={component.validations.email ?? false}
              onCheckedChange={(email) =>
                onUpdate({
                  validations: { ...component.validations, email },
                })
              }
            />
          </Field.Root>
          {component.validations.email === false && (
            <Field.Root size="sm">
              <Field.Label>Max length</Field.Label>
              <Input
                value={component.validations.maxLength?.toString() ?? ''}
                placeholder="No limit"
                onValueChange={(value) => {
                  const maxLength = value ? parseInt(value, 10) : undefined
                  onUpdate({
                    validations: { ...component.validations, maxLength: isNaN(maxLength!) ? undefined : maxLength },
                  })
                }}
              />
            </Field.Root>
          )}
        </Property.Content>
      </Property.Root>
    </div>
  )
}
