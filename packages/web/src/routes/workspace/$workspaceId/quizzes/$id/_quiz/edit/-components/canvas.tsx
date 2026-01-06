import { getThemeCssVars } from '@/components/quiz'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
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
import { arrayMove, horizontalListSortingStrategy, SortableContext } from '@dnd-kit/sortable'
import type { Block as BlockType, Page as PageType, Theme } from '@shopfunnel/core/quiz/types'
import {
  IconMaximize as MaximizeIcon,
  IconPalette as PaletteIcon,
  IconZoomIn as ZoomInIcon,
  IconZoomOut as ZoomOutIcon,
} from '@tabler/icons-react'
import {
  Background,
  PanOnScrollMode,
  ReactFlow,
  Panel as ReactFlowPanel,
  ReactFlowProvider,
  useReactFlow,
  useViewport,
  type Node,
  type NodeProps,
} from '@xyflow/react'
import * as React from 'react'
import { createPortal } from 'react-dom'
import { CanvasBlock } from './canvas-block'
import { CanvasContext, type CanvasContextValue } from './canvas-context'
import { CanvasPage, PAGE_WIDTH } from './canvas-page'

import '@xyflow/react/dist/style.css'

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

type CanvasNodeData = {
  pages: PageType[]
}

type CanvasNode = Node<CanvasNodeData, 'canvasNode'>

function CanvasNodeComponent({ data: { pages } }: NodeProps<CanvasNode>) {
  const context = React.use(CanvasContext)
  if (!context) throw new Error('CanvasNode must be used within Canvas')

  const { theme, draggingPage, draggingBlock, onDragStart, onDragEnd } = context
  const { zoom } = useViewport()

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
  )

  return (
    <div className="nopan nodrag" style={getThemeCssVars(theme)}>
      <DndContext sensors={sensors} collisionDetection={pointerWithin} onDragStart={onDragStart} onDragEnd={onDragEnd}>
        <SortableContext items={pages} strategy={horizontalListSortingStrategy}>
          <div className="flex items-start gap-6">
            {pages.map((page, i) => (
              <CanvasPage key={page.id} page={page} pageIndex={i} pageCount={pages.length} />
            ))}
          </div>
        </SortableContext>
        {createPortal(
          <DragOverlay dropAnimation={DROP_ANIMATION}>
            {(draggingPage || draggingBlock) && (
              <div style={getThemeCssVars(theme)}>
                {draggingPage ? (
                  <div style={{ transform: `scale(${zoom})`, transformOrigin: 'top left', width: 'fit-content' }}>
                    <CanvasPage
                      page={draggingPage}
                      pageIndex={pages.findIndex((p) => p.id === draggingPage.id)}
                      pageCount={pages.length}
                      static
                    />
                  </div>
                ) : draggingBlock ? (
                  <div style={{ transform: `scale(${zoom})`, transformOrigin: 'top left', width: PAGE_WIDTH - 48 }}>
                    <CanvasBlock block={draggingBlock} index={0} static dragging />
                  </div>
                ) : null}
              </div>
            )}
          </DragOverlay>,
          document.body,
        )}
      </DndContext>
    </div>
  )
}

const canvasNodeTypes = {
  canvasNode: CanvasNodeComponent,
}

function CanvasInner({ nodes }: { nodes: CanvasNode[] }) {
  const context = React.use(CanvasContext)
  if (!context) throw new Error('CanvasInner must be used within Canvas')

  const { onPaneClick, onThemeButtonClick } = context
  const { zoomIn, zoomOut, fitView } = useReactFlow()

  return (
    <ReactFlow
      nodes={nodes}
      nodeTypes={canvasNodeTypes}
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
      onPaneClick={onPaneClick}
      proOptions={{
        hideAttribution: true,
      }}
    >
      <Background />
      <ReactFlowPanel position="top-left">
        <ButtonGroup.Root orientation="horizontal">
          <Button variant="outline" size="icon" onClick={() => zoomIn()}>
            <ZoomInIcon />
          </Button>
          <Button variant="outline" size="icon" onClick={() => zoomOut()}>
            <ZoomOutIcon />
          </Button>
          <Button variant="outline" size="icon" onClick={() => fitView()}>
            <MaximizeIcon />
          </Button>
        </ButtonGroup.Root>
      </ReactFlowPanel>
      <ReactFlowPanel position="top-right">
        <Button variant="outline" onClick={onThemeButtonClick}>
          <PaletteIcon />
          Design
        </Button>
      </ReactFlowPanel>
    </ReactFlow>
  )
}

export interface CanvasProps {
  pages: PageType[]
  theme: Theme
  selectedPageId: string | null
  selectedBlockId: string | null
  onPageSelect: (pageId: string | null) => void
  onBlockSelect: (blockId: string | null) => void
  onThemeButtonClick: () => void
  onPagesReorder: (pages: PageType[]) => void
  onPageAdd: (page: PageType, index: number) => void
  onPageDelete: (pageId: string) => void
  onBlocksReorder: (pageId: string, blocks: BlockType[]) => void
  onBlockAdd: (block: BlockType, pageId?: string, index?: number) => void
  onBlockDelete: (blockId: string) => void
}

export function Canvas({
  pages,
  theme,
  selectedPageId,
  selectedBlockId,
  onPageSelect,
  onBlockSelect,
  onThemeButtonClick,
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

  const nodes = React.useMemo<CanvasNode[]>(
    () => [
      {
        id: 'canvasNode',
        type: 'canvasNode',
        position: { x: 0, y: 0 },
        data: { pages },
      },
    ],
    [pages],
  )

  const contextValue = React.useMemo<CanvasContextValue>(
    () => ({
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
      onPaneClick: handlePaneClick,
      onThemeButtonClick,
    }),
    [
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
      handlePaneClick,
      onThemeButtonClick,
    ],
  )

  return (
    <div className="size-full overscroll-x-none bg-background" data-slot="canvas">
      <CanvasContext.Provider value={contextValue}>
        <ReactFlowProvider>
          <CanvasInner nodes={nodes} />
        </ReactFlowProvider>
      </CanvasContext.Provider>
    </div>
  )
}
