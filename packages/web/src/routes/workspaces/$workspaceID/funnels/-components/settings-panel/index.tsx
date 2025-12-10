import type { Funnel } from '@shopfunnel/core/funnel/index'
import { MultipleChoiceSettings } from './multiple-choice-settings'
import { ShortTextSettings } from './short-text-settings'

const BLOCK_TYPE_LABELS: Record<Funnel.Page.Block['type'], string> = {
  short_text: 'Short Text',
  multiple_choice: 'Multiple Choice',
  dropdown: 'Dropdown',
  slider: 'Slider',
  heading: 'Heading',
  paragraph: 'Paragraph',
  gauge: 'Gauge',
  list: 'List',
  progress: 'Progress',
}

interface SettingsPanelProps {
  block: Funnel.Page.Block
  onUpdateBlock: (blockId: string, updates: Partial<Funnel.Page.Block>) => void
}

export function SettingsPanel({ block, onUpdateBlock }: SettingsPanelProps) {
  const typeLabel = BLOCK_TYPE_LABELS[block.type]

  const handleUpdate = (updates: Partial<Funnel.Page.Block>) => {
    onUpdateBlock(block.id, updates)
  }

  const renderSettings = () => {
    switch (block.type) {
      case 'short_text':
        return (
          <ShortTextSettings
            block={block}
            onUpdate={handleUpdate as (updates: Partial<Funnel.Page.ShortTextBlock>) => void}
          />
        )
      case 'multiple_choice':
        return (
          <MultipleChoiceSettings
            block={block}
            onUpdate={handleUpdate as (updates: Partial<Funnel.Page.MultipleChoiceBlock>) => void}
          />
        )
      default:
        return (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <span className="text-sm text-gray-400">Settings editor not yet implemented</span>
            <span className="mt-1 text-xs text-gray-300">for {typeLabel}</span>
          </div>
        )
    }
  }

  return (
    <div className="flex w-[300px] flex-col border-l border-gray-200 bg-white">
      <div className="flex h-11 items-center border-b border-gray-200 px-4">
        <span className="text-xs-plus font-medium">{typeLabel}</span>
      </div>
      <div className="flex-1 overflow-y-auto">{renderSettings()}</div>
    </div>
  )
}
