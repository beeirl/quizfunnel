import { DropdownBlock } from '@/components/blocks/dropdown-block'
import { GaugeBlock } from '@/components/blocks/gauge-block'
import { HeadingBlock } from '@/components/blocks/heading-block'
import { ListBlock } from '@/components/blocks/list-block'
import { MultipleChoiceBlock } from '@/components/blocks/multiple-choice-block'
import { ParagraphBlock } from '@/components/blocks/paragraph-block'
import { ProgressBlock } from '@/components/blocks/progress-block'
import { ShortTextBlock } from '@/components/blocks/short-text-block'
import { cn } from '@beeirl/ui/styles'
import type { Funnel } from '@shopfunnel/core/funnel/index'

interface PagePreviewProps {
  blocks: Funnel.Page.Block[]
  selectedBlockId: string | null
  onSelectBlock: (blockId: string | null) => void
}

function BlockPreview({ block }: { block: Funnel.Page.Block }) {
  switch (block.type) {
    case 'short_text':
      return <ShortTextBlock mode="preview" block={block} />
    case 'multiple_choice':
      return <MultipleChoiceBlock mode="preview" block={block} />
    case 'dropdown':
      return <DropdownBlock mode="preview" block={block} />
    case 'heading':
      return <HeadingBlock block={block} />
    case 'paragraph':
      return <ParagraphBlock block={block} />
    case 'gauge':
      return <GaugeBlock block={block} />
    case 'list':
      return <ListBlock block={block} />
    case 'progress':
      return <ProgressBlock block={block} />
    default:
      return null
  }
}

export function PagePreview({ blocks, selectedBlockId, onSelectBlock }: PagePreviewProps) {
  return (
    <div className="flex flex-1 flex-col bg-white">
      <div className="h-11 w-full" />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto flex w-full max-w-xl flex-col gap-2">
          {blocks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <span className="text-lg text-gray-400">No blocks on this page</span>
              <span className="mt-1 text-sm text-gray-300">Add blocks from the sidebar</span>
            </div>
          ) : (
            blocks.map((block) => (
              <div
                key={block.id}
                onClick={() => onSelectBlock(block.id)}
                className={cn(
                  'cursor-pointer rounded-xl p-4 ring ring-transparent transition-all',
                  'hover:ring-gray-200',
                  selectedBlockId === block.id && 'ring-3 ring-accent-200 hover:ring-accent-200',
                )}
              >
                <BlockPreview block={block} />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
