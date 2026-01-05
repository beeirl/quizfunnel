import { Block, getBlockInfo } from '@/components/block'
import { getThemeCssVars } from '@/components/quiz'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  defaultDropAnimationSideEffects,
  DndContext,
  DragOverlay,
  PointerSensor,
  pointerWithin,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
  type DropAnimation,
} from '@dnd-kit/core'
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Block as BlockType, Page as PageType, Theme } from '@shopfunnel/core/quiz/types'
import { IconPlus as PlusIcon } from '@tabler/icons-react'
import {
  Background,
  Controls,
  PanOnScrollMode,
  ReactFlow,
  ReactFlowProvider,
  useViewport,
  type Node,
  type NodeProps,
} from '@xyflow/react'
import * as React from 'react'
import { createPortal } from 'react-dom'
import { AddPageDialog } from './add-page-dialog'

import '@xyflow/react/dist/style.css'

const PAGE_WIDTH = 393
const PAGE_HEIGHT = 852

const ZOOM_MIN = 0.25
const ZOOM_MAX = 2

const DROP_ANIMATION: DropAnimation = {
  duration: 200,
  easing: 'ease',
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: { opacity: '0' },
    },
  }),
}

function BlockContent({
  block,
  theme,
  index,
  dragging,
  selected,
}: {
  block: BlockType
  theme: Theme
  index: number
  dragging?: boolean
  selected?: boolean
}) {
  const blockInfo = getBlockInfo(block.type)

  return (
    <div
      className={cn(
        'relative w-full select-none',
        dragging && 'shadow-lg ring-1 ring-primary',
        selected && 'ring-2 ring-blue-500',
      )}
      style={getThemeCssVars(theme)}
    >
      {selected && (
        <div className="absolute bottom-full left-0 z-10 mb-1 text-xs font-medium text-blue-500">{blockInfo.name}</div>
      )}
      <Block block={block} index={index} static />
    </div>
  )
}

function SortableBlock({
  block,
  theme,
  index,
  dropping,
  selected,
  onSelect,
}: {
  block: BlockType
  theme: Theme
  index: number
  dropping: boolean
  selected: boolean
  onSelect: (blockId: string) => void
}) {
  const { zoom } = useViewport()

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: dragging,
  } = useSortable({
    id: block.id,
    data: { type: 'block' },
  })

  const style: React.CSSProperties = dragging
    ? { opacity: 0, pointerEvents: 'none' }
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

  const handleClick = React.useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      onSelect(block.id)
    },
    [onSelect, block.id],
  )

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="nopan nodrag relative"
      {...attributes}
      {...listeners}
      onClick={handleClick}
    >
      <BlockContent block={block} theme={theme} index={index} selected={selected} />
    </div>
  )
}

function Page({
  page,
  pageIndex,
  theme,
  dropping,
  overlay,
  draggingPage,
  selected,
  selectedBlockId,
  onSelectBlock,
  onBlockAdd,
}: {
  page: PageType
  pageIndex: number
  theme: Theme
  dropping: boolean
  overlay?: boolean
  draggingPage?: boolean
  selected?: boolean
  selectedBlockId?: string | null
  onSelectBlock?: (blockId: string) => void
  onBlockAdd?: (block: BlockType) => void
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className={cn('text-sm font-medium', selected ? 'text-blue-500' : 'text-muted-foreground')}>
        {page.name || `Page ${pageIndex + 1}`}
      </div>
      <div className={cn('relative border border-border', selected && 'border-blue-500 ring ring-blue-500')}>
        <div
          className="no-scrollbar flex flex-col overflow-y-auto bg-white"
          style={{ width: PAGE_WIDTH, height: PAGE_HEIGHT, ...getThemeCssVars(theme) }}
        >
          <div className="mx-auto flex w-full max-w-sm flex-1 flex-col px-6 pt-8">
            {overlay || draggingPage ? (
              <div className="flex flex-col">
                {page.blocks.map((block, index) => (
                  <BlockContent key={block.id} block={block} theme={theme} index={index} />
                ))}
              </div>
            ) : (
              <SortableContext items={page.blocks} strategy={verticalListSortingStrategy}>
                <div className="flex flex-col">
                  {page.blocks.map((block, index) => (
                    <SortableBlock
                      block={block}
                      theme={theme}
                      index={index}
                      dropping={dropping}
                      selected={selectedBlockId === block.id}
                      onSelect={onSelectBlock!}
                    />
                  ))}
                </div>
              </SortableContext>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function AddPageZone({
  index,
  pageCount,
  onPageAdd,
}: {
  index: number
  pageCount: number
  onPageAdd: (page: PageType, index: number) => void
}) {
  const [hovered, setHovered] = React.useState(false)

  const handlePageAdd = React.useCallback(
    (page: PageType) => {
      onPageAdd(page, index)
    },
    [index, onPageAdd],
  )

  return (
    <div
      className="nopan nodrag pointer-events-auto flex w-12 shrink-0 items-center justify-center"
      style={{ height: PAGE_HEIGHT + 28 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <AddPageDialog.Root onPageAdd={handlePageAdd} pageCount={pageCount}>
        <AddPageDialog.Trigger
          render={<Button size="icon" className={cn('transition-opacity', hovered ? 'opacity-100' : 'opacity-0')} />}
        >
          <PlusIcon />
        </AddPageDialog.Trigger>
        <AddPageDialog.Popup />
      </AddPageDialog.Root>
    </div>
  )
}

function SortablePage({
  page,
  pageIndex,
  theme,
  zoom,
  dropping,
  selected,
  onSelect,
  draggingPage,
  selectedBlockId,
  onSelectBlock,
  onBlockAdd,
}: {
  page: PageType
  pageIndex: number
  theme: Theme
  zoom: number
  dropping: boolean
  selected: boolean
  onSelect: (pageId: string) => void
  draggingPage: boolean
  selectedBlockId: string | null
  onSelectBlock: (blockId: string) => void
  onBlockAdd: (block: BlockType) => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: dragging,
  } = useSortable({
    id: page.id,
    data: { type: 'page' },
  })

  const style: React.CSSProperties = dragging
    ? { opacity: 0, pointerEvents: 'none' }
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

  const handleClick = React.useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      onSelect(page.id)
    },
    [onSelect, page.id],
  )

  return (
    <div ref={setNodeRef} style={style} className="nopan nodrag" {...attributes} {...listeners} onClick={handleClick}>
      <Page
        page={page}
        pageIndex={pageIndex}
        theme={theme}
        dropping={dropping}
        draggingPage={draggingPage}
        selected={selected}
        selectedBlockId={selectedBlockId}
        onSelectBlock={onSelectBlock}
        onBlockAdd={onBlockAdd}
      />
    </div>
  )
}

type NodeData = {
  pages: PageType[]
  theme: Theme
  draggingPage: PageType | null
  draggingBlock: BlockType | null
  dropping: boolean
  selectedPageId: string | null
  selectedBlockId: string | null
  onSelectPage: (pageId: string | null) => void
  onSelectBlock: (blockId: string | null) => void
  onDragStart: (event: DragStartEvent) => void
  onDragEnd: (event: DragEndEvent) => void
  onPageAdd: (page: PageType, index: number) => void
  onBlockAdd: (block: BlockType) => void
}

type NodeType = Node<NodeData, 'node'>

function Node({
  data: {
    pages,
    theme,
    draggingPage,
    draggingBlock,
    dropping,
    selectedPageId,
    selectedBlockId,
    onSelectPage,
    onSelectBlock,
    onDragStart,
    onDragEnd,
    onPageAdd,
    onBlockAdd,
  },
}: NodeProps<NodeType>) {
  const { zoom } = useViewport()

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
  )

  return (
    <div className="nopan nodrag">
      <DndContext sensors={sensors} collisionDetection={pointerWithin} onDragStart={onDragStart} onDragEnd={onDragEnd}>
        <SortableContext items={pages} strategy={horizontalListSortingStrategy}>
          <div className="flex items-start">
            <AddPageZone index={0} pageCount={pages.length} onPageAdd={onPageAdd} />
            {pages.map((page, i) => (
              <React.Fragment key={page.id}>
                <SortablePage
                  page={page}
                  pageIndex={i}
                  theme={theme}
                  zoom={zoom}
                  dropping={dropping}
                  selected={selectedPageId === page.id}
                  onSelect={onSelectPage}
                  draggingPage={draggingPage !== null}
                  selectedBlockId={selectedBlockId}
                  onSelectBlock={onSelectBlock}
                  onBlockAdd={onBlockAdd}
                />
                <AddPageZone index={i + 1} pageCount={pages.length} onPageAdd={onPageAdd} />
              </React.Fragment>
            ))}
          </div>
        </SortableContext>
        {createPortal(
          <DragOverlay dropAnimation={DROP_ANIMATION}>
            {draggingPage ? (
              <div style={{ transform: `scale(${zoom})`, transformOrigin: 'top left', width: 'fit-content' }}>
                <Page
                  page={draggingPage}
                  pageIndex={pages.findIndex((p) => p.id === draggingPage.id)}
                  theme={theme}
                  dropping={false}
                  overlay
                />
              </div>
            ) : draggingBlock ? (
              <div style={{ transform: `scale(${zoom})`, transformOrigin: 'top left', width: PAGE_WIDTH - 48 }}>
                <BlockContent block={draggingBlock} theme={theme} index={0} dragging />
              </div>
            ) : null}
          </DragOverlay>,
          document.body,
        )}
      </DndContext>
    </div>
  )
}

const nodeTypes = {
  node: Node,
}

export interface CanvasProps {
  pages: PageType[]
  theme: Theme
  selectedPageId: string | null
  selectedBlockId: string | null
  onPageSelect: (pageId: string | null) => void
  onBlockSelect: (blockId: string | null) => void
  onPagesReorder: (pages: PageType[]) => void
  onPageAdd: (page: PageType, index: number) => void
  onPageDelete: (pageId: string) => void
  onBlocksReorder: (pageId: string, blocks: BlockType[]) => void
  onBlockAdd: (block: BlockType) => void
  onBlockDelete: (blockId: string) => void
}

export function Canvas({
  pages,
  theme,
  selectedPageId,
  selectedBlockId,
  onPageSelect,
  onBlockSelect,
  onPagesReorder,
  onPageAdd,
  onPageDelete,
  onBlocksReorder,
  onBlockAdd,
  onBlockDelete,
}: CanvasProps) {
  const [draggingId, setDraggingId] = React.useState<string | null>(null)
  const [dropping, setDropping] = React.useState(false)

  const handleDragStart = React.useCallback((event: DragStartEvent) => {
    setDropping(false)
    setDraggingId(String(event.active.id))
  }, [])

  const handleDragEnd = React.useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event
      setDropping(true)

      if (over && active.id !== over.id) {
        const activeId = String(active.id)
        const overId = String(over.id)
        const type = active.data.current?.type

        if (type === 'block') {
          // Block reordering within the same page
          const page = pages.find((p) => p.blocks.some((b) => b.id === activeId))
          if (page) {
            const blocks = page.blocks
            const oldIndex = blocks.findIndex((b) => b.id === activeId)
            const newIndex = blocks.findIndex((b) => b.id === overId)

            if (oldIndex !== -1 && newIndex !== -1) {
              onBlocksReorder(page.id, arrayMove(blocks, oldIndex, newIndex))
            }
          }
        } else {
          // Page reordering
          const oldIndex = pages.findIndex((p) => p.id === activeId)
          const newIndex = pages.findIndex((p) => p.id === overId)
          if (oldIndex !== -1 && newIndex !== -1) {
            onPagesReorder(arrayMove(pages, oldIndex, newIndex))
          }
        }
      }

      setDraggingId(null)
      requestAnimationFrame(() => setDropping(false))
    },
    [pages, onBlocksReorder, onPagesReorder],
  )

  const draggingPage = pages.find((p) => p.id === draggingId) ?? null
  const draggingBlock = !draggingPage ? (pages.flatMap((p) => p.blocks).find((b) => b.id === draggingId) ?? null) : null

  const handleSelectPage = React.useCallback(
    (pageId: string | null) => {
      onPageSelect(pageId)
      onBlockSelect(null)
    },
    [onPageSelect, onBlockSelect],
  )

  const handleSelectBlock = React.useCallback(
    (blockId: string | null) => {
      onBlockSelect(blockId)
      onPageSelect(null)
    },
    [onBlockSelect, onPageSelect],
  )

  const handlePaneClick = React.useCallback(() => {
    onPageSelect(null)
    onBlockSelect(null)
  }, [onPageSelect, onBlockSelect])

  // Keyboard handler for deleting selected block
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't handle if we're in an input field
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return
      }

      if ((event.key === 'Backspace' || event.key === 'Delete') && selectedBlockId) {
        event.preventDefault()
        onBlockDelete(selectedBlockId)
      }

      if ((event.key === 'Backspace' || event.key === 'Delete') && selectedPageId && !selectedBlockId) {
        event.preventDefault()
        onPageDelete(selectedPageId)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedBlockId, selectedPageId, onBlockDelete, onPageDelete])

  const nodes = React.useMemo<NodeType[]>(
    () => [
      {
        id: 'node',
        type: 'node',
        position: { x: 0, y: 0 },
        data: {
          pages,
          theme,
          draggingPage,
          draggingBlock,
          dropping,
          selectedPageId,
          selectedBlockId,
          onSelectPage: handleSelectPage,
          onSelectBlock: handleSelectBlock,
          onDragStart: handleDragStart,
          onDragEnd: handleDragEnd,
          onPageAdd,
          onBlockAdd,
        },
      },
    ],
    [
      pages,
      theme,
      draggingPage,
      draggingBlock,
      dropping,
      selectedPageId,
      selectedBlockId,
      handleSelectPage,
      handleSelectBlock,
      handleDragStart,
      handleDragEnd,
      onPageAdd,
      onBlockAdd,
    ],
  )

  return (
    <div className="size-full overscroll-x-none bg-background">
      <ReactFlowProvider>
        <ReactFlow
          nodes={nodes}
          nodeTypes={nodeTypes}
          minZoom={ZOOM_MIN}
          maxZoom={ZOOM_MAX}
          fitView
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          panOnScroll
          panOnScrollSpeed={1}
          panOnScrollMode={PanOnScrollMode.Free}
          zoomOnScroll={false}
          zoomOnPinch
          zoomActivationKeyCode="Meta"
          panOnDrag={[0, 1, 2]}
          onPaneClick={handlePaneClick}
          proOptions={{
            hideAttribution: true,
          }}
        >
          <Background />
          <Controls showInteractive={false} />
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  )
}
