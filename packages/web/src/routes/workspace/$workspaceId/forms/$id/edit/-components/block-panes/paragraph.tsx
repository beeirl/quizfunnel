import { Textarea } from '@/components/ui/textarea'
import { getFormBlockType } from '@/form/block'
import type { ParagraphBlock as ParagraphBlockData } from '@shopfunnel/core/form/types'
import { Pane } from '../pane'

export function ParagraphBlockPane({
  data,
  onDataUpdate,
}: {
  data: ParagraphBlockData
  onDataUpdate: (data: Partial<ParagraphBlockData>) => void
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
          <Textarea
            placeholder="Your text here..."
            value={data.properties.text}
            onChange={(e) => onDataUpdate({ properties: { ...data.properties, text: e.target.value } })}
          />
        </Pane.Group>
      </Pane.Content>
    </Pane.Root>
  )
}
