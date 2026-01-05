import type { Page as PageType } from '@shopfunnel/core/quiz/types'
import * as React from 'react'

export interface CanvasPageContextValue {
  page: PageType
  pageIndex: number
  pageCount: number
}

export const CanvasPageContext = React.createContext<CanvasPageContextValue | null>(null)

export function useCanvasPage() {
  const context = React.use(CanvasPageContext)
  if (!context) {
    throw new Error('useCanvasPage must be used within CanvasPage')
  }
  return context
}
