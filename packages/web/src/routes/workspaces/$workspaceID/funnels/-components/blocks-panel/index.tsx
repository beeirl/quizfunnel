import { Icon } from '@/components/icon'
import { IconButton } from '@beeirl/ui/icon-button'
import { PlusIcon } from '@beeirl/ui/line-icons'
import { cn } from '@beeirl/ui/styles'
import { move } from '@dnd-kit/helpers'
import { DragDropProvider } from '@dnd-kit/react'
import { useSortable } from '@dnd-kit/react/sortable'
import type { Funnel } from '@shopfunnel/core/funnel/index'
import { getBlockIconName, getBlockName } from '../utils/block'
import { AddBlockDialog } from './add-block-dialog'

function SortableBlockItem({
  block,
  index,
  selected,
  onSelect,
}: {
  block: Funnel.Page.Block
  index: number
  selected: boolean
  onSelect: () => void
}) {
  const { ref } = useSortable({ id: block.id, index })

  return (
    <div
      ref={ref}
      className={cn(
        'flex h-8 cursor-grab items-center gap-2.5 rounded-md bg-white px-2.5 transition-all hover:bg-gray-100',
        selected && 'bg-gray-100 hover:bg-gray-100',
      )}
      onClick={onSelect}
    >
      <Icon name={getBlockIconName(block.type)} className="size-4 text-gray-400" />
      <span className="flex-1 truncate text-sm font-medium">{getBlockName(block.type)}</span>
    </div>
  )
}

interface BlocksPanelProps {
  blocks: Funnel.Page.Block[]
  selectedBlockId: string | null
  onSelectBlock: (blockId: string | null) => void
  onReorderBlocks: (blocks: Funnel.Page.Block[]) => void
  onAddBlock: (afterBlockId: string | null, block: Funnel.Page.Block) => void
}

export function BlocksPanel({ blocks, selectedBlockId, onSelectBlock, onReorderBlocks, onAddBlock }: BlocksPanelProps) {
  return (
    <div className="flex w-[220px] flex-col border-r border-gray-200 bg-white">
      <div className="flex h-11 items-center justify-between border-b border-gray-200 px-4">
        <span className="text-xs-plus font-medium">Blocks</span>
        <AddBlockDialog.Root onBlockAdd={(block) => onAddBlock(selectedBlockId, block)}>
          <AddBlockDialog.Trigger render={<IconButton color="gray" size="sm" variant="ghost" />}>
            <PlusIcon />
          </AddBlockDialog.Trigger>
          <AddBlockDialog.Popup />
        </AddBlockDialog.Root>
      </div>
      <div className="flex-1 overflow-y-auto p-3">
        {blocks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <span className="text-sm text-gray-400">No blocks yet</span>
          </div>
        ) : (
          <DragDropProvider
            onDragEnd={(event) => {
              onReorderBlocks(move(blocks, event))
            }}
          >
            <div className="flex flex-col gap-0.5">
              {blocks.map((block, index) => (
                <SortableBlockItem
                  key={block.id}
                  block={block}
                  index={index}
                  selected={selectedBlockId === block.id}
                  onSelect={() => onSelectBlock(block.id)}
                />
              ))}
            </div>
          </DragDropProvider>
        )}
      </div>
    </div>
  )
}

export { AddBlockDialog } from './add-block-dialog'
