import { blockRegistry } from '@/block/registry'
import type { Block, MultipleChoiceBlock, ShortTextBlock } from '@shopfunnel/core/funnel/schema'
import { MultipleChoiceConfig } from './multiple-choice-config'
import { ShortTextConfig } from './short-text-config'

interface ConfiguratorProps {
  block: Block | null
  onBlockUpdate: (blockId: string, updates: Partial<Block>) => void
}

export function Configurator({ block, onBlockUpdate }: ConfiguratorProps) {
  if (!block) return null

  const item = blockRegistry[block.type]

  const handleUpdate = (updates: Partial<Block>) => {
    onBlockUpdate(block.id, updates)
  }

  const renderSettings = () => {
    switch (block.type) {
      case 'short_text':
        return <ShortTextConfig block={block} onUpdate={handleUpdate as (updates: Partial<ShortTextBlock>) => void} />
      case 'multiple_choice':
        return (
          <MultipleChoiceConfig
            block={block}
            onUpdate={handleUpdate as (updates: Partial<MultipleChoiceBlock>) => void}
          />
        )
      default:
        return (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <span className="text-sm text-gray-400">Settings editor not yet implemented</span>
            <span className="mt-1 text-xs text-gray-300">for {item.name}</span>
          </div>
        )
    }
  }

  return (
    <div className="flex w-[300px] flex-col border-l border-gray-200 bg-white">
      <div className="flex h-11 items-center border-b border-gray-200 px-4">
        <span className="text-sm font-semibold">{item.name}</span>
      </div>
      <div className="flex-1 overflow-y-auto">{renderSettings()}</div>
    </div>
  )
}
