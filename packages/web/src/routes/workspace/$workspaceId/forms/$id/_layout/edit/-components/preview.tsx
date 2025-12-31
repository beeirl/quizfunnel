import { Block } from '@/components/block'
import { getThemeCssVars, shouldAutoAdvance } from '@/components/form'
import { NextButton } from '@/components/next-button'
import { Button } from '@/components/ui/button'
import { ThemePopover } from '@/routes/workspace/$workspaceId/forms/$id/_layout/edit/-components/theme-popover'
import type { Page, Theme } from '@shopfunnel/core/form/types'
import { IconPalette as PaletteIcon } from '@tabler/icons-react'

export function Preview({
  page,
  theme,
  selectedBlockId,
  onBlockSelect,
  onThemeUpdate,
  onImageUpload,
}: {
  page: Page | null
  theme: Theme
  selectedBlockId: string | null
  onBlockSelect: (blockId: string | null) => void
  onThemeUpdate: (theme: Partial<Theme>) => void
  onImageUpload: (file: File) => Promise<string>
}) {
  return (
    <div className="relative flex-1 overflow-hidden">
      <div className="absolute right-3 bottom-3 z-10">
        <ThemePopover.Root>
          <ThemePopover.Trigger
            render={
              <Button variant="outline" aria-label="Design">
                <PaletteIcon />
                Design
              </Button>
            }
          />
          <ThemePopover.Content
            align="end"
            side="top"
            sideOffset={8}
            theme={theme}
            onThemeUpdate={onThemeUpdate}
            onImageUpload={onImageUpload}
          />
        </ThemePopover.Root>
      </div>
      <div
        className="flex h-full w-full flex-col overflow-auto bg-background pt-11"
        style={getThemeCssVars(theme)}
        onClick={() => onBlockSelect(null)}
      >
        {!page ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <span className="text-lg text-muted-foreground">No blocks on this page</span>
            <span className="mt-1 text-sm text-muted-foreground">Add blocks from the sidebar</span>
          </div>
        ) : (
          <div className="mx-auto flex w-full max-w-sm flex-1 flex-col">
            {page.blocks.map((block, index) => (
              <div
                key={block.id}
                className="relative cursor-default after:absolute after:-inset-2 after:mt-6 hover:after:bg-primary/20"
                onClick={(e) => {
                  e.stopPropagation()
                  onBlockSelect(block.id)
                }}
              >
                <Block block={block} index={index} static />
              </div>
            ))}
            {!shouldAutoAdvance(page.blocks) && (
              <div className="sticky bottom-0 mt-auto w-full pt-4 pb-5">
                <NextButton disabled>{page.properties.buttonText}</NextButton>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
