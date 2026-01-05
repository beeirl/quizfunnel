import * as React from 'react'
import { createPortal } from 'react-dom'

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

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

import '@xyflow/react/dist/style.css'

// iPhone 16 logical dimensions
const PAGE_WIDTH = 393
const PAGE_HEIGHT = 852

interface BlockData {
  id: string
  label: string
  height: number
}

interface PageData {
  id: string
  title: string
  blocks: BlockData[]
}

type PagesContainerNodeData = {
  pages: PageData[]
  activePage: PageData | null
  activeBlock: BlockData | null
  zoom: number
  isDropping: boolean
  isDraggingPage: boolean
  isDraggingBlock: boolean
  sensors: ReturnType<typeof useSensors>
  selectedPageId: string | null
  selectedBlockId: string | null
  onSelectPage: (pageId: string | null) => void
  onSelectBlock: (blockId: string | null) => void
  onDragStart: (event: DragStartEvent) => void
  onDragEnd: (event: DragEndEvent) => void
  onAddPage: (index: number) => void
}

type PagesContainerNodeType = Node<PagesContainerNodeData, 'pagesContainer'>

const INITIAL_PAGES: PageData[] = [
  {
    id: 'page-1',
    title: 'Page 1',
    blocks: [
      { id: 'p1-b1', label: 'Block 1', height: 80 },
      { id: 'p1-b2', label: 'Block 2', height: 120 },
      { id: 'p1-b3', label: 'Block 3', height: 60 },
      { id: 'p1-b4', label: 'Block 4', height: 140 },
      { id: 'p1-b5', label: 'Block 5', height: 100 },
      { id: 'p1-b6', label: 'Block 6', height: 90 },
      { id: 'p1-b7', label: 'Block 7', height: 110 },
      { id: 'p1-b8', label: 'Block 8', height: 75 },
    ],
  },
  {
    id: 'page-2',
    title: 'Page 2',
    blocks: [
      { id: 'p2-b1', label: 'Block 1', height: 95 },
      { id: 'p2-b2', label: 'Block 2', height: 130 },
      { id: 'p2-b3', label: 'Block 3', height: 70 },
      { id: 'p2-b4', label: 'Block 4', height: 85 },
      { id: 'p2-b5', label: 'Block 5', height: 145 },
      { id: 'p2-b6', label: 'Block 6', height: 65 },
      { id: 'p2-b7', label: 'Block 7', height: 105 },
    ],
  },
  {
    id: 'page-3',
    title: 'Page 3',
    blocks: [
      { id: 'p3-b1', label: 'Block 1', height: 110 },
      { id: 'p3-b2', label: 'Block 2', height: 60 },
      { id: 'p3-b3', label: 'Block 3', height: 135 },
      { id: 'p3-b4', label: 'Block 4', height: 80 },
      { id: 'p3-b5', label: 'Block 5', height: 125 },
      { id: 'p3-b6', label: 'Block 6', height: 70 },
      { id: 'p3-b7', label: 'Block 7', height: 150 },
      { id: 'p3-b8', label: 'Block 8', height: 90 },
    ],
  },
]

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

// Helper to check if an ID is a block ID
function isBlockId(id: string): boolean {
  return id.includes('-b')
}

function BlockContent({
  block,
  isDragging,
  isSelected,
}: {
  block: BlockData
  isDragging?: boolean
  isSelected?: boolean
}) {
  return (
    <div
      className={cn(
        'flex w-full items-center justify-center rounded-lg bg-muted text-sm font-medium text-muted-foreground select-none',
        isDragging && 'shadow-lg ring-1 ring-primary',
        isSelected && 'ring-1 ring-blue-500',
      )}
      style={{ height: block.height }}
    >
      {block.label}
    </div>
  )
}

function SortableBlock({
  block,
  zoom,
  isDropping,
  isSelected,
  onSelect,
}: {
  block: BlockData
  zoom: number
  isDropping: boolean
  isSelected: boolean
  onSelect: (blockId: string) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: block.id,
  })

  const style: React.CSSProperties = isDragging
    ? { opacity: 0, pointerEvents: 'none' }
    : {
        transform: isDropping
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
        transition: isDropping ? 'none' : transition,
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
      {isSelected && (
        <div className="absolute bottom-full left-0 z-10 mb-1 text-xs font-medium text-blue-500">{block.label}</div>
      )}
      <BlockContent block={block} isSelected={isSelected} />
    </div>
  )
}

function Page({
  page,
  zoom,
  isDropping,
  isOverlay,
  isDraggingPage,
  isSelected,
  selectedBlockId,
  onSelectBlock,
}: {
  page: PageData
  zoom: number
  isDropping: boolean
  isOverlay?: boolean
  isDraggingPage?: boolean
  isSelected?: boolean
  selectedBlockId?: string | null
  onSelectBlock?: (blockId: string) => void
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className={cn('text-sm font-medium', isSelected ? 'text-blue-500' : 'text-muted-foreground')}>
        {page.title}
      </div>
      <div className={cn('relative', isSelected && 'ring-1 ring-blue-500')}>
        <div
          className="nowheel no-scrollbar flex flex-col overflow-y-scroll bg-card p-3"
          style={{ width: PAGE_WIDTH, height: PAGE_HEIGHT }}
        >
          {isOverlay || isDraggingPage ? (
            <div className="flex flex-col gap-2">
              {page.blocks.map((block) => (
                <BlockContent key={block.id} block={block} />
              ))}
            </div>
          ) : (
            <SortableContext items={page.blocks} strategy={verticalListSortingStrategy}>
              <div className="flex flex-col gap-2">
                {page.blocks.map((block) => (
                  <SortableBlock
                    key={block.id}
                    block={block}
                    zoom={zoom}
                    isDropping={isDropping}
                    isSelected={selectedBlockId === block.id}
                    onSelect={onSelectBlock!}
                  />
                ))}
              </div>
            </SortableContext>
          )}
        </div>
      </div>
    </div>
  )
}

function AddPageZone({ index, onAddPage }: { index: number; onAddPage: (index: number) => void }) {
  const [isHovered, setIsHovered] = React.useState(false)

  const handleClick = React.useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      onAddPage(index)
    },
    [index, onAddPage],
  )

  return (
    <div
      className="nopan nodrag pointer-events-auto flex w-12 shrink-0 items-center justify-center"
      style={{ height: PAGE_HEIGHT + 28 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Button
        size="icon"
        className={cn('transition-opacity', isHovered ? 'opacity-100' : 'opacity-0')}
        onClick={handleClick}
      >
        <PlusIcon />
      </Button>
    </div>
  )
}

function SortablePage({
  page,
  zoom,
  isDropping,
  isSelected,
  onSelect,
  isDraggingPage,
  selectedBlockId,
  onSelectBlock,
}: {
  page: PageData
  zoom: number
  isDropping: boolean
  isSelected: boolean
  onSelect: (pageId: string) => void
  isDraggingPage: boolean
  selectedBlockId: string | null
  onSelectBlock: (blockId: string) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: page.id,
  })

  const style: React.CSSProperties = isDragging
    ? { opacity: 0, pointerEvents: 'none' }
    : {
        transform: isDropping
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
        transition: isDropping ? 'none' : transition,
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
        zoom={zoom}
        isDropping={isDropping}
        isDraggingPage={isDraggingPage}
        isSelected={isSelected}
        selectedBlockId={selectedBlockId}
        onSelectBlock={onSelectBlock}
      />
    </div>
  )
}

function PagesContainerNode({ data }: NodeProps<PagesContainerNodeType>) {
  const {
    pages,
    activePage,
    activeBlock,
    zoom,
    isDropping,
    isDraggingPage,
    sensors,
    selectedPageId,
    selectedBlockId,
    onSelectPage,
    onSelectBlock,
    onDragStart,
    onDragEnd,
    onAddPage,
  } = data

  return (
    <div className="nopan nodrag">
      <DndContext sensors={sensors} collisionDetection={pointerWithin} onDragStart={onDragStart} onDragEnd={onDragEnd}>
        <SortableContext items={pages} strategy={horizontalListSortingStrategy}>
          <div className="flex items-start">
            <AddPageZone index={0} onAddPage={onAddPage} />
            {pages.map((page, i) => (
              <React.Fragment key={page.id}>
                <SortablePage
                  page={page}
                  zoom={zoom}
                  isDropping={isDropping}
                  isSelected={selectedPageId === page.id}
                  onSelect={onSelectPage}
                  isDraggingPage={isDraggingPage}
                  selectedBlockId={selectedBlockId}
                  onSelectBlock={onSelectBlock}
                />
                <AddPageZone index={i + 1} onAddPage={onAddPage} />
              </React.Fragment>
            ))}
          </div>
        </SortableContext>

        {createPortal(
          <DragOverlay dropAnimation={DROP_ANIMATION}>
            {activePage ? (
              <div style={{ transform: `scale(${zoom})`, transformOrigin: 'top left', width: 'fit-content' }}>
                <Page page={activePage} zoom={zoom} isDropping={false} isOverlay />
              </div>
            ) : activeBlock ? (
              <div style={{ transform: `scale(${zoom})`, transformOrigin: 'top left', width: PAGE_WIDTH - 24 }}>
                <BlockContent block={activeBlock} isDragging />
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
  pagesContainer: PagesContainerNode,
}

function CanvasInner() {
  const [pages, setPages] = React.useState(INITIAL_PAGES)
  const [activePageId, setActivePageId] = React.useState<string | null>(null)
  const [activeBlockId, setActiveBlockId] = React.useState<string | null>(null)
  const [isDropping, setIsDropping] = React.useState(false)
  const [selectedPageId, setSelectedPageId] = React.useState<string | null>(null)
  const [selectedBlockId, setSelectedBlockId] = React.useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
  )

  const handleDragStart = React.useCallback((event: DragStartEvent) => {
    const id = String(event.active.id)
    setIsDropping(false)

    if (isBlockId(id)) {
      setActiveBlockId(id)
      setActivePageId(null)
    } else {
      setActivePageId(id)
      setActiveBlockId(null)
    }
  }, [])

  const handleDragEnd = React.useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event

      setIsDropping(true)

      if (over && active.id !== over.id) {
        const activeId = String(active.id)
        const overId = String(over.id)

        if (isBlockId(activeId)) {
          // Block reordering within the same page
          const pageIndex = pages.findIndex((p) => p.blocks.some((b) => b.id === activeId))
          if (pageIndex !== -1) {
            setPages((prev) => {
              const newPages = [...prev]
              const page = newPages[pageIndex]
              if (!page) return prev

              const blocks = page.blocks
              const oldIndex = blocks.findIndex((b) => b.id === activeId)
              const newIndex = blocks.findIndex((b) => b.id === overId)

              if (oldIndex !== -1 && newIndex !== -1) {
                newPages[pageIndex] = {
                  id: page.id,
                  title: page.title,
                  blocks: arrayMove(blocks, oldIndex, newIndex),
                }
              }
              return newPages
            })
          }
        } else {
          // Page reordering
          setPages((prev) => {
            const oldIndex = prev.findIndex((p) => p.id === activeId)
            const newIndex = prev.findIndex((p) => p.id === overId)
            if (oldIndex !== -1 && newIndex !== -1) {
              return arrayMove(prev, oldIndex, newIndex)
            }
            return prev
          })
        }
      }

      setActivePageId(null)
      setActiveBlockId(null)
      requestAnimationFrame(() => setIsDropping(false))
    },
    [pages],
  )

  const activePage = pages.find((page) => page.id === activePageId) ?? null
  const activeBlock = pages.flatMap((page) => page.blocks).find((block) => block.id === activeBlockId) ?? null
  const { zoom } = useViewport()

  const handleSelectPage = React.useCallback((pageId: string | null) => {
    setSelectedPageId(pageId)
    setSelectedBlockId(null) // Deselect block when selecting page
  }, [])

  const handleSelectBlock = React.useCallback((blockId: string | null) => {
    setSelectedBlockId(blockId)
    setSelectedPageId(null) // Deselect page when selecting block
  }, [])

  const handlePaneClick = React.useCallback(() => {
    setSelectedPageId(null)
    setSelectedBlockId(null)
  }, [])

  const handleAddPage = React.useCallback(
    (index: number) => {
      const newPage: PageData = {
        id: `page-${Date.now()}`,
        title: `Page ${pages.length + 1}`,
        blocks: [],
      }
      setPages((prev) => {
        const newPages = [...prev]
        newPages.splice(index, 0, newPage)
        return newPages
      })
    },
    [pages.length],
  )

  const handleDeleteSelectedPage = React.useCallback(() => {
    if (selectedPageId) {
      setPages((prev) => prev.filter((page) => page.id !== selectedPageId))
      setSelectedPageId(null)
    }
  }, [selectedPageId])

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Backspace' && selectedPageId) {
        event.preventDefault()
        handleDeleteSelectedPage()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedPageId, handleDeleteSelectedPage])

  const nodes = React.useMemo<PagesContainerNodeType[]>(
    () => [
      {
        id: 'pages-container',
        type: 'pagesContainer',
        position: { x: 0, y: 0 },
        data: {
          pages,
          activePage,
          activeBlock,
          zoom,
          isDropping,
          isDraggingPage: activePageId !== null,
          isDraggingBlock: activeBlockId !== null,
          sensors,
          selectedPageId,
          selectedBlockId,
          onSelectPage: handleSelectPage,
          onSelectBlock: handleSelectBlock,
          onDragStart: handleDragStart,
          onDragEnd: handleDragEnd,
          onAddPage: handleAddPage,
        },
      },
    ],
    [
      pages,
      activePage,
      activeBlock,
      zoom,
      isDropping,
      activePageId,
      activeBlockId,
      sensors,
      selectedPageId,
      selectedBlockId,
      handleSelectPage,
      handleSelectBlock,
      handleDragStart,
      handleDragEnd,
      handleAddPage,
    ],
  )

  return (
    <div className="h-screen w-screen overscroll-x-none bg-muted">
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
        noWheelClassName="nowheel"
        onPaneClick={handlePaneClick}
        proOptions={{
          hideAttribution: true,
        }}
      >
        <Background />
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
  )
}

export function Canvas() {
  return (
    <ReactFlowProvider>
      <CanvasInner />
    </ReactFlowProvider>
  )
}
