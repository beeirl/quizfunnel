import { Block, getBlockInfo } from '@/components/block'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Block as BlockType } from '@shopfunnel/core/quiz/types'
import { IconPlus as PlusIcon } from '@tabler/icons-react'
import { useViewport } from '@xyflow/react'
import * as React from 'react'
import { AddBlockMenu } from './add-block-menu'
import { useCanvas } from './canvas-context'
import { useCanvasPage } from './canvas-page-context'

export function CanvasBlock({
  block,
  index,
  static: isStatic,
  dragging,
}: {
  block: BlockType
  index: number
  static?: boolean
  dragging?: boolean
}) {
  const { dropping, selectedBlockId, onSelectBlock, onBlockAdd } = useCanvas()
  const { page } = useCanvasPage()
  const { zoom } = useViewport()

  const [addMenuOpen, setAddMenuOpen] = React.useState(false)

  const blockInfo = getBlockInfo(block.type)
  const selected = selectedBlockId === block.id

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: block.id,
    data: { type: 'block' },
    disabled: isStatic,
  })

  const style: React.CSSProperties = isDragging
    ? { opacity: 0, pointerEvents: 'none' }
    : isStatic
      ? {}
      : {
          transform: dropping
            ? undefined
            : CSS.Transform.toString(
                transform
                  ? {
                      ...transform,
                      x: transform.x / zoom,
                      y: transform.y / zoom,
                    }
                  : null,
              ),
          transition: dropping ? 'none' : transition,
          pointerEvents: 'all',
          touchAction: 'none',
        }

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onSelectBlock(block.id)
  }

  const handleAddMenuOpenChange = (open: boolean) => {
    setAddMenuOpen(open)
    if (open) {
      onSelectBlock(null)
    }
  }

  if (isStatic) {
    return (
      <div className={cn('relative w-full select-none', dragging && 'shadow-lg ring-2 ring-primary')}>
        <div
          className={cn(
            'absolute bottom-full left-0 z-10 mb-1 text-xs font-medium text-primary',
            selected || addMenuOpen ? 'block' : 'hidden group-hover/canvas-block:block',
          )}
        >
          {blockInfo.name}
        </div>
        <Block block={block} index={index} static />
      </div>
    )
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group/canvas-block nopan nodrag relative"
      data-slot="canvas-block"
      onClick={handleClick}
      {...attributes}
      {...listeners}
    >
      <div
        className={cn(
          'relative ring-primary',
          (selected || addMenuOpen) && 'ring-2',
          !selected && !addMenuOpen && 'group-hover/canvas-block:ring-2',
        )}
      >
        <div className="relative w-full select-none">
          <div
            className={cn(
              'absolute bottom-full left-0 z-10 mb-1 text-xs font-medium text-primary',
              selected || addMenuOpen ? 'block' : 'hidden group-hover/canvas-block:block',
            )}
          >
            {blockInfo.name}
          </div>
          <Block block={block} index={index} static />
        </div>
        <div
          className="pointer-events-none absolute top-0 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2 scale-0 opacity-0 transition-[opacity,transform] group-hover/canvas-block:pointer-events-auto group-hover/canvas-block:scale-100 group-hover/canvas-block:opacity-100 has-data-popup-open:pointer-events-auto has-data-popup-open:scale-100 has-data-popup-open:opacity-100"
          onClick={(e) => e.stopPropagation()}
        >
          <AddBlockMenu.Root
            onBlockAdd={(block) => onBlockAdd(block, page.id, index)}
            onOpenChange={handleAddMenuOpenChange}
          >
            <AddBlockMenu.Trigger
              render={
                <Button className="cursor-crosshair" size="icon-sm">
                  <PlusIcon />
                </Button>
              }
            />
            <AddBlockMenu.Content />
          </AddBlockMenu.Root>
        </div>
        <div
          className="pointer-events-none absolute bottom-0 left-1/2 z-10 -translate-x-1/2 translate-y-1/2 scale-0 opacity-0 transition-[opacity,transform] group-hover/canvas-block:pointer-events-auto group-hover/canvas-block:scale-100 group-hover/canvas-block:opacity-100 has-data-popup-open:pointer-events-auto has-data-popup-open:scale-100 has-data-popup-open:opacity-100"
          onClick={(e) => e.stopPropagation()}
        >
          <AddBlockMenu.Root
            onBlockAdd={(block) => onBlockAdd(block, page.id, index + 1)}
            onOpenChange={handleAddMenuOpenChange}
          >
            <AddBlockMenu.Trigger
              render={
                <Button className="cursor-crosshair" size="icon-sm">
                  <PlusIcon />
                </Button>
              }
            />
            <AddBlockMenu.Content />
          </AddBlockMenu.Root>
        </div>
      </div>
    </div>
  )
}
