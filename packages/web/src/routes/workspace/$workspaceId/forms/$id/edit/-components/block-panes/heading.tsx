import { Input } from '@/components/ui/input'
import { getFormBlockType } from '@/form/block'
import type { HeadingBlock as HeadingBlockData } from '@shopfunnel/core/form/types'
import { Pane } from '../pane'

export function HeadingBlockPane({
  data,
  onDataUpdate,
}: {
  data: HeadingBlockData
  onDataUpdate: (data: Partial<HeadingBlockData>) => void
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
            <Pane.GroupLabel>Text</Pane.GroupLabel>
          </Pane.GroupHeader>
          <Input
            placeholder="Your heading here..."
            value={data.properties.text}
            onValueChange={(value) => onDataUpdate({ properties: { ...data.properties, text: value } })}
          />
        </Pane.Group>
      </Pane.Content>
    </Pane.Root>
  )
}
