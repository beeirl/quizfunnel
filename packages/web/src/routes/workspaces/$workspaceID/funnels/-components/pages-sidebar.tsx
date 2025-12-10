import { IconButton } from '@beeirl/ui/icon-button'
import { PlusIcon } from '@beeirl/ui/line-icons'
import { cn } from '@beeirl/ui/styles'
import { move } from '@dnd-kit/helpers'
import { DragDropProvider } from '@dnd-kit/react'
import { useSortable } from '@dnd-kit/react/sortable'
import type { FunnelSchema } from '@shopfunnel/core/form/schema'

interface PagesSidebarProps {
  pages: FunnelSchema.Page[]
  selectedPageId: string | null
  onSelectPage: (pageId: string) => void
  onReorderPages: (pages: FunnelSchema.Page[]) => void
}

function PageItem({
  page,
  index,
  selected,
  onSelect,
}: {
  page: FunnelSchema.Page
  index: number
  selected: boolean
  onSelect: () => void
}) {
  const { ref } = useSortable({ id: page.id, index })

  return (
    <div
      ref={ref}
      onClick={onSelect}
      className={cn(
        'relative flex aspect-video cursor-grab items-center justify-center overflow-hidden rounded-xl bg-white shadow-xs ring ring-gray-200 transition-all hover:ring-gray-300',
        'active:scale-105 active:cursor-grabbing active:ring-accent-500',
        selected && 'ring-3 ring-accent-200 hover:ring-accent-200',
      )}
    >
      <div
        className={cn(
          'absolute top-1.5 left-1.5 flex size-5 items-center justify-center rounded-full bg-gray-100 text-gray-500',
          selected && 'bg-accent-100 text-accent-500',
        )}
      >
        <span className="text-xs font-semibold">{index + 1}</span>
      </div>
      <div className="pointer-events-none flex flex-col items-center gap-0.5 text-center">
        <span className="text-[10px] font-medium text-gray-400">
          {page.components.length} {page.components.length === 1 ? 'component' : 'components'}
        </span>
      </div>
    </div>
  )
}

export function PagesSidebar({ pages, selectedPageId, onSelectPage, onReorderPages }: PagesSidebarProps) {
  return (
    <div className="flex w-[220px] flex-col border-r border-gray-200 bg-white">
      <div className="flex h-11 items-center justify-between border-b border-gray-200 px-4">
        <span className="text-xs-plus font-medium">Pages</span>
        <IconButton color="gray" size="sm" variant="ghost">
          <PlusIcon />
        </IconButton>
      </div>
      <div className="flex-1 overflow-y-auto p-3">
        <DragDropProvider
          onDragEnd={(event) => {
            onReorderPages(move(pages, event))
          }}
        >
          <div className="flex flex-col gap-3">
            {pages.map((page, index) => (
              <PageItem
                key={page.id}
                page={page}
                index={index}
                selected={selectedPageId === page.id}
                onSelect={() => onSelectPage(page.id)}
              />
            ))}
          </div>
        </DragDropProvider>
      </div>
    </div>
  )
}
