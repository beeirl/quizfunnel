import { NextButton } from '@/components/next-button'
import { shouldAutoAdvance } from '@/components/quiz'
import { Button } from '@/components/ui/button'
import { Empty } from '@/components/ui/empty'
import { cn } from '@/lib/utils'
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Page as PageType } from '@shopfunnel/core/quiz/types'
import { IconPlus as PlusIcon } from '@tabler/icons-react'
import { useViewport } from '@xyflow/react'
import * as React from 'react'
import { AddBlockMenu } from './add-block-menu'
import { AddPageMenu } from './add-page-menu'
import { CanvasBlock } from './canvas-block'
import { useCanvas } from './canvas-context'
import { CanvasPageContext, type CanvasPageContextValue } from './canvas-page-context'

const PAGE_WIDTH = 393
const PAGE_HEIGHT = 852

export function CanvasPage({
  page,
  pageIndex,
  pageCount,
  static: isStatic,
}: {
  page: PageType
  pageIndex: number
  pageCount: number
  static?: boolean
}) {
  const { draggingPage, dropping, selectedPageId, onSelectPage, onSelectBlock, onBlockAdd, onPageAdd } = useCanvas()
  const { zoom } = useViewport()
  const [addMenuOpen, setAddMenuOpen] = React.useState(false)

  const pageContextValue = React.useMemo<CanvasPageContextValue>(
    () => ({ page, pageIndex, pageCount }),
    [page, pageIndex, pageCount],
  )

  const selected = selectedPageId === page.id

  const handleAddMenuOpenChange = React.useCallback(
    (open: boolean) => {
      setAddMenuOpen(open)
      if (open) {
        onSelectPage(null)
        onSelectBlock(null)
      }
    },
    [onSelectPage, onSelectBlock],
  )

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: page.id,
    data: { type: 'page' },
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

  const handleClick = React.useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      onSelectPage(page.id)
    },
    [onSelectPage, page.id],
  )

  const handleAddPageLeft = React.useCallback(
    (newPage: PageType) => {
      onPageAdd(newPage, pageIndex)
    },
    [onPageAdd, pageIndex],
  )

  const handleAddPageRight = React.useCallback(
    (newPage: PageType) => {
      onPageAdd(newPage, pageIndex + 1)
    },
    [onPageAdd, pageIndex],
  )

  const blocksStatic = isStatic || draggingPage !== null

  const pageContent = (
    <div className="flex flex-col gap-2">
      <div
        className={cn(
          'text-sm font-medium',
          isStatic
            ? 'text-muted-foreground'
            : selected || addMenuOpen
              ? 'text-primary'
              : 'text-muted-foreground group-[:hover:not(:has([data-slot=canvas-block]:hover))]/canvas-page:text-primary',
        )}
      >
        {page.name || `Page ${pageIndex + 1}`}
      </div>
      <div
        className={cn(
          'relative border border-border ring-primary',
          !isStatic &&
            'group-[:hover:not(:has([data-slot=canvas-block]:hover))]/canvas-page:border-primary group-[:hover:not(:has([data-slot=canvas-block]:hover))]/canvas-page:ring',
          !isStatic && (selected || addMenuOpen) && 'border-primary ring',
        )}
      >
        <div
          className="no-scrollbar flex flex-col overflow-y-auto bg-white"
          style={{ width: PAGE_WIDTH, height: PAGE_HEIGHT }}
        >
          <div className="mx-auto flex w-full max-w-sm flex-1 flex-col px-6 pt-8">
            {page.blocks.length === 0 ? (
              <Empty.Root>
                <Empty.Header>
                  <Empty.Title>No blocks yet</Empty.Title>
                  <Empty.Description>Add a block to get started</Empty.Description>
                </Empty.Header>
                <Empty.Content>
                  <AddBlockMenu.Root onBlockAdd={(block) => onBlockAdd(block, page.id)}>
                    <AddBlockMenu.Trigger
                      render={
                        <Button>
                          <PlusIcon />
                          Add Block
                        </Button>
                      }
                    />
                    <AddBlockMenu.Content />
                  </AddBlockMenu.Root>
                </Empty.Content>
              </Empty.Root>
            ) : (
              <>
                {blocksStatic ? (
                  <div className="flex flex-col">
                    {page.blocks.map((block, index) => (
                      <CanvasBlock key={block.id} block={block} index={index} static />
                    ))}
                  </div>
                ) : (
                  <SortableContext items={page.blocks} strategy={verticalListSortingStrategy}>
                    <div className="flex flex-col">
                      {page.blocks.map((block, index) => (
                        <CanvasBlock key={block.id} block={block} index={index} />
                      ))}
                    </div>
                  </SortableContext>
                )}
                {!shouldAutoAdvance(page.blocks) && (
                  <div className="mt-auto w-full pt-4 pb-5">
                    <NextButton static>{page.properties?.buttonText || 'Next'}</NextButton>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )

  if (isStatic) {
    return <CanvasPageContext.Provider value={pageContextValue}>{pageContent}</CanvasPageContext.Provider>
  }

  return (
    <CanvasPageContext.Provider value={pageContextValue}>
      <div
        ref={setNodeRef}
        style={style}
        className="group/canvas-page nopan nodrag relative"
        data-slot="canvas-page"
        {...attributes}
        {...listeners}
        onClick={handleClick}
      >
        {pageContent}
        <div
          className="pointer-events-none absolute top-1/2 left-0 z-10 -translate-x-1/2 -translate-y-1/2 scale-0 opacity-0 transition-[opacity,transform] group-[:hover:not(:has([data-slot=canvas-block]:hover))]/canvas-page:pointer-events-auto group-[:hover:not(:has([data-slot=canvas-block]:hover))]/canvas-page:scale-100 group-[:hover:not(:has([data-slot=canvas-block]:hover))]/canvas-page:opacity-100 has-data-popup-open:pointer-events-auto has-data-popup-open:scale-100 has-data-popup-open:opacity-100"
          onClick={(e) => e.stopPropagation()}
        >
          <AddPageMenu.Root onPageAdd={handleAddPageLeft} side="left" onOpenChange={handleAddMenuOpenChange}>
            <AddPageMenu.Trigger
              render={
                <Button className="cursor-crosshair" size="icon">
                  <PlusIcon />
                </Button>
              }
            />
            <AddPageMenu.Content />
          </AddPageMenu.Root>
        </div>
        <div
          className="pointer-events-none absolute top-1/2 right-0 z-10 translate-x-1/2 -translate-y-1/2 scale-0 opacity-0 transition-[opacity,transform] group-[:hover:not(:has([data-slot=canvas-block]:hover))]/canvas-page:pointer-events-auto group-[:hover:not(:has([data-slot=canvas-block]:hover))]/canvas-page:scale-100 group-[:hover:not(:has([data-slot=canvas-block]:hover))]/canvas-page:opacity-100 has-data-popup-open:pointer-events-auto has-data-popup-open:scale-100 has-data-popup-open:opacity-100"
          onClick={(e) => e.stopPropagation()}
        >
          <AddPageMenu.Root onPageAdd={handleAddPageRight} side="right" onOpenChange={handleAddMenuOpenChange}>
            <AddPageMenu.Trigger
              render={
                <Button className="cursor-crosshair" size="icon">
                  <PlusIcon />
                </Button>
              }
            />
            <AddPageMenu.Content />
          </AddPageMenu.Root>
        </div>
      </div>
    </CanvasPageContext.Provider>
  )
}

export { PAGE_HEIGHT, PAGE_WIDTH }
