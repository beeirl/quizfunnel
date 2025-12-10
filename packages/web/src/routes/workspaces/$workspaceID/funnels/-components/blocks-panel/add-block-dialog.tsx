import { DropdownBlock } from '@/components/blocks/dropdown-block'
import { GaugeBlock } from '@/components/blocks/gauge-block'
import { HeadingBlock } from '@/components/blocks/heading-block'
import { ListBlock } from '@/components/blocks/list-block'
import { MultipleChoiceBlock } from '@/components/blocks/multiple-choice-block'
import { ProgressBlock } from '@/components/blocks/progress-block'
import { ShortTextBlock } from '@/components/blocks/short-text-block'
import { Icon } from '@/components/icon'
import { Combobox } from '@base-ui-components/react/combobox'
import { Badge } from '@beeirl/ui/badge'
import { Button } from '@beeirl/ui/button'
import { Dialog } from '@beeirl/ui/dialog'
import { EmptyState } from '@beeirl/ui/empty-state'
import { cn } from '@beeirl/ui/styles'
import type { Funnel } from '@shopfunnel/core/funnel/index'
import * as React from 'react'
import { ulid } from 'ulid'
import { getBlockDescription, getBlockIconName, getBlockName } from '../utils/block'

const BLOCK_TYPES: Funnel.Page.Block['type'][] = [
  'short_text',
  'multiple_choice',
  'dropdown',
  'heading',
  'gauge',
  'list',
  'progress',
]

const AddBlockDialogContext = React.createContext<{
  onBlockAdd: (block: Funnel.Page.Block) => void
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
} | null>(null)

function useAddBlockDialogContext() {
  const context = React.useContext(AddBlockDialogContext)
  if (!context) {
    throw new Error('AddBlockDialog components must be used within AddBlockDialog.Root')
  }
  return context
}

function AddBlockDialogRoot({
  children,
  onBlockAdd,
}: {
  children: React.ReactNode
  onBlockAdd: (block: Funnel.Page.Block) => void
}) {
  const [open, setOpen] = React.useState(false)

  return (
    <AddBlockDialogContext.Provider value={{ onBlockAdd, setOpen }}>
      <Dialog.Root open={open} onOpenChange={setOpen}>
        {children}
      </Dialog.Root>
    </AddBlockDialogContext.Provider>
  )
}

function BlockPreview({ blockType }: { blockType: Funnel.Page.Block['type'] }) {
  switch (blockType) {
    case 'short_text':
      return (
        <ShortTextBlock
          mode="preview"
          block={{
            id: 'preview-short-text',
            type: 'short_text',
            properties: {
              label: 'What is your name?',
              placeholder: 'Enter your name...',
            },
            validations: {},
          }}
        />
      )
    case 'multiple_choice':
      return (
        <MultipleChoiceBlock
          mode="preview"
          block={{
            id: 'preview-multiple-choice',
            type: 'multiple_choice',
            properties: {
              label: 'What is your name?',
              choices: [
                { id: '1', label: 'United States' },
                { id: '2', label: 'Canada' },
                { id: '3', label: 'United Kingdom' },
              ],
            },
            validations: {},
          }}
        />
      )
    case 'dropdown':
      return (
        <DropdownBlock
          mode="preview"
          block={{
            id: 'preview-dropdown',
            type: 'dropdown',
            properties: {
              label: 'Select your country',
              options: [
                { id: '1', label: 'United States' },
                { id: '2', label: 'Canada' },
                { id: '3', label: 'United Kingdom' },
              ],
            },
            validations: {},
          }}
        />
      )
    case 'heading':
      return (
        <HeadingBlock
          block={{
            id: 'preview-heading',
            type: 'heading',
            properties: {
              text: 'Welcome to our form',
            },
          }}
        />
      )
    case 'gauge':
      return (
        <GaugeBlock
          block={{
            id: 'preview-gauge',
            type: 'gauge',
            properties: {
              value: '50',
              minValue: 0,
              maxValue: 100,
            },
          }}
        />
      )
    case 'list':
      return (
        <ListBlock
          block={{
            id: 'preview-list',
            type: 'list',
            properties: {
              orientation: 'vertical',
              textPlacement: 'right',
              size: 'sm',
              items: [
                { id: '1', icon: 'check', title: 'First item' },
                { id: '2', icon: 'check', title: 'Second item' },
                { id: '3', icon: 'check', title: 'Third item' },
              ],
            },
          }}
        />
      )
    case 'progress':
      return (
        <ProgressBlock
          block={{
            id: 'preview-progress',
            type: 'progress',
          }}
        />
      )
    default:
      return null
  }
}

function AddBlockDialogPopup() {
  const { onBlockAdd, setOpen } = useAddBlockDialogContext()

  const [highlightedBlockType, setHighlightedBlockType] = React.useState<Funnel.Page.Block['type'] | undefined>(
    BLOCK_TYPES[0],
  )

  const handleBlockAdd = (blockType: Funnel.Page.Block['type']) => {
    switch (blockType) {
      case 'short_text':
        onBlockAdd({
          id: ulid(),
          type: 'short_text',
          properties: {
            label: 'Your question here',
            placeholder: '',
          },
          validations: {
            required: false,
          },
        })
        break
      case 'multiple_choice':
        onBlockAdd({
          id: ulid(),
          type: 'multiple_choice',
          properties: {
            label: 'Your question here',
            choices: [{ id: ulid(), label: 'Choice 1' }],
          },
          validations: {
            required: false,
          },
        })
        break
      case 'dropdown':
        onBlockAdd({
          id: ulid(),
          type: 'dropdown',
          properties: {
            label: 'Your question here',
            options: [{ id: ulid(), label: 'Option 1' }],
          },
          validations: {
            required: false,
          },
        })
        break
      case 'heading':
        onBlockAdd({
          id: ulid(),
          type: 'heading',
          properties: {
            text: 'Your heading here',
          },
        })
        break
      case 'gauge':
        onBlockAdd({
          id: ulid(),
          type: 'gauge',
          properties: {
            value: '50',
            minValue: 0,
            maxValue: 100,
          },
        })
        break
      case 'list':
        onBlockAdd({
          id: ulid(),
          type: 'list',
          properties: {
            orientation: 'vertical',
            textPlacement: 'right',
            size: 'sm',
            items: [{ id: ulid(), icon: 'check', title: 'Item' }],
          },
        })
        break
      case 'progress':
        onBlockAdd({
          id: ulid(),
          type: 'progress',
        })
        break
      default:
        return
    }
    setOpen(false)
  }

  return (
    <Dialog.Popup className="max-w-2xl gap-0 p-0">
      <Combobox.Root<Funnel.Page.Block['type']>
        inline
        autoHighlight
        highlightItemOnHover={false}
        items={BLOCK_TYPES}
        onItemHighlighted={setHighlightedBlockType}
      >
        <div className="flex flex-col">
          <div className="relative flex h-12 shrink-0 items-center border-b border-gray-200">
            <Icon name="search" className="pointer-events-none absolute left-4.5 size-4 text-gray-400" />
            <Combobox.Input
              className="h-full flex-1 bg-transparent pl-10.5 text-sm outline-none placeholder:text-gray-400"
              placeholder="Find questions, input fields and layout options..."
              onKeyDown={(e) => {
                if (e.key === 'Enter' && highlightedBlockType) {
                  handleBlockAdd(highlightedBlockType)
                }
              }}
            />
          </div>
          <div className="flex h-[650px] max-h-[calc(90vh-48px)]">
            <Combobox.List className="flex w-full flex-col gap-0.5 overflow-y-auto p-2 data-empty:hidden md:max-w-[250px] md:border-r md:border-gray-200">
              {(blockType: Funnel.Page.Block['type']) => (
                <Combobox.Item
                  key={blockType}
                  value={blockType}
                  onClick={() => {
                    setHighlightedBlockType(blockType)
                  }}
                  onDoubleClick={() => handleBlockAdd(blockType)}
                  className={cn(
                    'flex h-8 shrink-0 cursor-pointer items-center gap-2.5 rounded-md px-2.5 transition-colors outline-none',
                    'hover:bg-gray-100',
                    highlightedBlockType === blockType && 'bg-gray-100',
                  )}
                >
                  <Icon name={getBlockIconName(blockType)} className="size-4 text-gray-400" />
                  <span className="flex-1 truncate text-sm font-medium">{getBlockName(blockType)}</span>
                </Combobox.Item>
              )}
            </Combobox.List>
            {highlightedBlockType && (
              <div className="hidden flex-1 flex-col md:flex">
                <div className="flex flex-1 flex-col overflow-y-auto">
                  <div className="border-b border-gray-200 px-6 pt-5 pb-6">
                    <h2 className="mb-2 text-xl font-bold text-gray-900">
                      {highlightedBlockType.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                    </h2>
                    <p className="text-sm text-gray-500">{getBlockDescription(highlightedBlockType)}</p>
                  </div>

                  <div className="flex-1 px-6 pt-5 pb-6">
                    <Badge color="gray" variant="soft" size="md" className="mb-4">
                      Preview
                    </Badge>
                    <BlockPreview blockType={highlightedBlockType} />
                  </div>
                </div>

                <div className="flex shrink-0 justify-end border-t border-gray-200 p-4">
                  <Button color="blue" onClick={() => handleBlockAdd(highlightedBlockType)}>
                    Add block
                  </Button>
                </div>
              </div>
            )}
            <Combobox.Empty className="flex size-full overflow-y-auto empty:size-0">
              <EmptyState.Root className="m-auto shrink-0">
                <EmptyState.Icon className="shrink-0">
                  <Icon name="search_cross" />
                </EmptyState.Icon>
                <EmptyState.Title>No results</EmptyState.Title>
                <EmptyState.Description>
                  No content blocks match your search. Retry with a different keyword.
                </EmptyState.Description>
              </EmptyState.Root>
            </Combobox.Empty>
          </div>
        </div>
      </Combobox.Root>
    </Dialog.Popup>
  )
}

export const AddBlockDialog = {
  Root: AddBlockDialogRoot,
  Trigger: Dialog.Trigger,
  Popup: AddBlockDialogPopup,
}
