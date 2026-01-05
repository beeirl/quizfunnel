import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core'
import type { Block as BlockType, Page as PageType, Theme } from '@shopfunnel/core/quiz/types'
import * as React from 'react'

export interface CanvasContextValue {
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
  onBlockAdd: (block: BlockType, pageId?: string, index?: number) => void
  onPaneClick: () => void
  onThemeButtonClick: () => void
}

export const CanvasContext = React.createContext<CanvasContextValue | null>(null)

export function useCanvas() {
  const context = React.use(CanvasContext)
  if (!context) {
    throw new Error('useCanvas must be used within Canvas')
  }
  return context
}
