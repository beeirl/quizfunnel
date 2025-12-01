import * as React from 'react'
import type { FormBlock, FormPage, FormValues } from '../types'
import { isInputBlock } from '../utils/block'
import { DropdownBlock } from './blocks/dropdown'
import { HeadingBlock } from './blocks/heading'
import { MultipleChoiceBlock } from './blocks/multiple-choice'
import { ParagraphBlock } from './blocks/paragraph'
import { SliderBlock } from './blocks/slider'
import { TextInputBlock } from './blocks/text-input'

export function Page({ type, blocks, values, errors, setValue, onNext }: Page.Props) {
  const autoNext = React.useMemo(() => {
    const inputBlocks = blocks.filter(isInputBlock)
    if (inputBlocks.length > 1) return false
    return inputBlocks.some((block) => {
      if (block.type === 'dropdown') return true
      if (block.type === 'multiple_choice' && !block.properties.multiple) return true
      return false
    })
  }, [blocks])

  const renderBlock = (block: FormBlock) => {
    switch (block.type) {
      case 'heading':
        return <HeadingBlock key={block.id} block={block} />

      case 'paragraph':
        return <ParagraphBlock key={block.id} block={block} />

      case 'text_input':
        return (
          <TextInputBlock
            key={block.id}
            block={block}
            value={values[block.id] as string | undefined}
            error={errors[block.id]}
            onValueChange={(value) => {
              setValue(block.id, value)
              if (autoNext) onNext()
            }}
          />
        )

      case 'multiple_choice':
        return (
          <MultipleChoiceBlock
            key={block.id}
            block={block}
            value={values[block.id] as string | string[] | undefined}
            onValueChange={(value) => {
              setValue(block.id, value)
            }}
            onValueChangeComplete={() => {
              if (autoNext) onNext()
            }}
          />
        )

      case 'dropdown':
        return (
          <DropdownBlock
            key={block.id}
            block={block}
            value={values[block.id] as string | undefined}
            onValueChange={(value) => {
              setValue(block.id, value)
              if (autoNext) onNext()
            }}
          />
        )

      case 'slider':
        return (
          <SliderBlock
            key={block.id}
            block={block}
            value={values[block.id] as number | undefined}
            onValueChange={(value) => {
              setValue(block.id, value)
              if (autoNext) onNext()
            }}
          />
        )

      default:
        return null
    }
  }

  return (
    <div className="mx-auto w-full max-w-xl px-4">
      <div className="space-y-6">{blocks.map(renderBlock)}</div>

      {!autoNext && (
        <button
          className="mt-8 w-full rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none dark:focus:ring-offset-neutral-900"
          onClick={onNext}
        >
          {type === 'ending' ? 'Done' : 'Continue'}
        </button>
      )}
    </div>
  )
}

export namespace Page {
  export interface Props {
    type: FormPage['type']
    blocks: FormBlock[]
    values: FormValues
    errors: Record<string, string>
    setValue: (blockID: string, value: FormValues[string]) => void
    onNext: () => void
  }
}
