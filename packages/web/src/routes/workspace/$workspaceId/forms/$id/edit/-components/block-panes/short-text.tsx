import { Input } from '@/components/ui/input'
import { SegmentedControl } from '@/components/ui/segmented-control'
import { getFormBlockType } from '@/form/block'
import type { ShortTextBlock as ShortTextBlockData } from '@shopfunnel/core/form/types'
import { Field } from '../field'
import { Pane } from '../pane'

export function ShortTextBlockPane({
  data,
  onDataUpdate,
}: {
  data: ShortTextBlockData
  onDataUpdate: (data: Partial<ShortTextBlockData>) => void
}) {
  const block = getFormBlockType(data.type)
  return (
    <Pane.Root>
      <Pane.Header>
        <Pane.Title>{block?.name}</Pane.Title>
      </Pane.Header>
      <Pane.Content>
        <Pane.Group>
          <Pane.GroupHeader>
            <Pane.GroupLabel>Question</Pane.GroupLabel>
          </Pane.GroupHeader>
          <Input
            placeholder="Your question here..."
            value={data.properties.label}
            onValueChange={(value) => onDataUpdate({ properties: { ...data.properties, label: value } })}
          />
        </Pane.Group>
        <Pane.Separator />
        <Pane.Group>
          <Pane.GroupHeader>
            <Pane.GroupLabel>Description</Pane.GroupLabel>
          </Pane.GroupHeader>
          <Input
            placeholder="Enter description..."
            value={data.properties.description ?? ''}
            onValueChange={(value) =>
              onDataUpdate({
                properties: { ...data.properties, description: value || undefined },
              })
            }
          />
        </Pane.Group>
        <Pane.Separator />
        <Pane.Group>
          <Pane.GroupHeader>
            <Pane.GroupLabel>Validation</Pane.GroupLabel>
          </Pane.GroupHeader>
          <Field.Root>
            <Field.Label>Required</Field.Label>
            <Field.Control>
              <SegmentedControl.Root
                value={data.validations.required ?? false}
                onValueChange={(value: boolean) =>
                  onDataUpdate({ validations: { ...data.validations, required: value } })
                }
              >
                <SegmentedControl.Segment value={false}>No</SegmentedControl.Segment>
                <SegmentedControl.Segment value={true}>Yes</SegmentedControl.Segment>
              </SegmentedControl.Root>
            </Field.Control>
          </Field.Root>
          <Field.Root>
            <Field.Label>Email</Field.Label>
            <Field.Control>
              <SegmentedControl.Root
                value={data.validations.email ?? false}
                onValueChange={(value: boolean) => onDataUpdate({ validations: { ...data.validations, email: value } })}
              >
                <SegmentedControl.Segment value={false}>No</SegmentedControl.Segment>
                <SegmentedControl.Segment value={true}>Yes</SegmentedControl.Segment>
              </SegmentedControl.Root>
            </Field.Control>
          </Field.Root>
        </Pane.Group>
      </Pane.Content>
    </Pane.Root>
  )
}
