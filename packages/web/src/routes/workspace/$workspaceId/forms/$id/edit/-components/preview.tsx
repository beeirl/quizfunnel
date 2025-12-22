import { Button } from '@/components/ui/button'
import { FormBlock } from '@/form/block'
import { Button as FormButton } from '@/form/components/button'
import { FormTheme } from '@/form/theme'
import { cn } from '@/lib/utils'
import type { Page, Theme } from '@shopfunnel/core/form/types'
import { IconDeviceDesktop as DesktopIcon, IconDeviceMobile as MobileIcon } from '@tabler/icons-react'
import * as React from 'react'

type DisplayMode = 'desktop' | 'mobile'

export function Preview({
  page,
  theme,
  selectedBlockId,
  onBlockSelect,
}: {
  page: Page | null
  theme: Theme
  selectedBlockId: string | null
  onBlockSelect: (blockId: string | null) => void
}) {
  const [displayMode, setDisplayMode] = React.useState<DisplayMode>('mobile')
  return (
    <FormTheme theme={theme}>
      <div className="relative flex-1 bg-(--sf-color-background)" onClick={() => onBlockSelect(null)}>
        {!page ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <span className="text-lg text-muted-foreground">No blocks on this page</span>
            <span className="mt-1 text-sm text-muted-foreground">Add blocks from the sidebar</span>
          </div>
        ) : (
          <div className="@container mx-auto flex h-full w-full max-w-md flex-col py-12">
            <div className="flex-1">
              {page.blocks.map((block) => (
                <div
                  key={block.id}
                  className={cn(
                    'relative cursor-pointer',
                    'before:absolute before:-inset-3 before:rounded-lg before:border before:border-transparent before:ring-3 before:ring-transparent before:transition-all hover:before:border-(--sf-color-primary)/50 hover:before:ring-(--sf-color-primary)/20 hover:before:transition-all',
                    selectedBlockId === block.id &&
                      'before:border-(--sf-color-primary)/40 before:ring-(--sf-color-primary)/25',
                  )}
                  onClick={(e) => {
                    e.stopPropagation()
                    onBlockSelect(block.id)
                  }}
                >
                  <FormBlock static block={block} />
                </div>
              ))}
            </div>
            {page.properties.showButton && <FormButton static>{page.properties.buttonText}</FormButton>}
          </div>
        )}
        <Button
          variant="outline"
          className="absolute right-4 bottom-4"
          onClick={() => setDisplayMode(displayMode === 'desktop' ? 'mobile' : 'desktop')}
        >
          {displayMode === 'desktop' ? <DesktopIcon /> : <MobileIcon />}
          {displayMode === 'desktop' ? 'Desktop' : 'Mobile'}
        </Button>
      </div>
    </FormTheme>
  )
}
