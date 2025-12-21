import { Button } from '@/components/ui/button'
import { Page } from '@/form/page'
import { cn } from '@/lib/utils'
import type { Page as PageSchema } from '@shopfunnel/core/form/schema'
import type { FormTheme } from '@shopfunnel/core/form/theme'
import { IconDeviceDesktop as DesktopIcon, IconDeviceMobile as MobileIcon } from '@tabler/icons-react'
import * as React from 'react'

type DisplayMode = 'desktop' | 'mobile'

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
  const [displayMode, setDisplayMode] = React.useState<DisplayMode>('mobile')
  return (
    <div className="relative flex flex-1 flex-col bg-background">
      <div className="flex-1 overflow-y-auto p-6" onClick={() => onBlockSelect(null)}>
        <div
          className={cn(
            'mx-auto flex w-full flex-col gap-3 transition-all duration-300',
            displayMode === 'desktop' ? 'max-w-xl' : 'max-w-sm',
          )}
        >
          {!pageSchema ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <span className="text-lg text-muted-foreground">No blocks on this page</span>
              <span className="mt-1 text-sm text-muted-foreground">Add blocks from the sidebar</span>
            </div>
          ) : (
            <Page
              mode="preview"
              schema={pageSchema}
              selectedBlockId={selectedBlockId}
              theme={theme}
              onBlockSelect={onBlockSelect}
            />
          )}
        </div>
      </div>
      <Button
        variant="outline"
        className="absolute right-4 bottom-4"
        onClick={() => setDisplayMode(displayMode === 'desktop' ? 'mobile' : 'desktop')}
      >
        {displayMode === 'desktop' ? <DesktopIcon /> : <MobileIcon />}
        {displayMode === 'desktop' ? 'Desktop' : 'Mobile'}
      </Button>
    </div>
  )
}
