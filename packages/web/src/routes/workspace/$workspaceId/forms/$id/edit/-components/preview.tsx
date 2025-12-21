import { Button } from '@/components/ui/button'
import { DisplayMode, Page } from '@/form/page'
import type { Page as PageSchema } from '@shopfunnel/core/form/schema'
import type { FormTheme } from '@shopfunnel/core/form/theme'
import { IconDeviceDesktop as DesktopIcon, IconDeviceMobile as MobileIcon } from '@tabler/icons-react'
import * as React from 'react'

export function Preview({
  pageSchema,
  theme,
  selectedBlockId,
  onBlockSelect,
}: {
  pageSchema: PageSchema | null
  theme: FormTheme
  selectedBlockId: string | null
  onBlockSelect: (blockId: string | null) => void
}) {
  const [pageDisplayMode, setPageDisplayMode] = React.useState<DisplayMode>('mobile')
  return (
    <div className="relative flex-1" onClick={() => onBlockSelect(null)}>
      {!pageSchema ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <span className="text-lg text-muted-foreground">No blocks on this page</span>
          <span className="mt-1 text-sm text-muted-foreground">Add blocks from the sidebar</span>
        </div>
      ) : (
        <Page
          mode="preview"
          schema={pageSchema}
          theme={theme}
          selectedBlockId={selectedBlockId}
          displayMode={pageDisplayMode}
          className="pt-11"
          onBlockSelect={onBlockSelect}
        />
      )}
      <Button
        variant="outline"
        className="absolute right-4 bottom-4"
        onClick={() => setPageDisplayMode(pageDisplayMode === 'desktop' ? 'mobile' : 'desktop')}
      >
        {pageDisplayMode === 'desktop' ? <DesktopIcon /> : <MobileIcon />}
        {pageDisplayMode === 'desktop' ? 'Desktop' : 'Mobile'}
      </Button>
    </div>
  )
}
