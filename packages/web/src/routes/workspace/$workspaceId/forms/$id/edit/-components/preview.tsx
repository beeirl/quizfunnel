import { Block } from '@/components/block'
import { getThemeCssVars, shouldAutoAdvance } from '@/components/form'
import { NextButton } from '@/components/next-button'
import type { Page, Theme } from '@shopfunnel/core/form/types'

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
  return (
    <div
      className="relative flex flex-1 flex-col overflow-auto bg-background pt-11"
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
  )
}
