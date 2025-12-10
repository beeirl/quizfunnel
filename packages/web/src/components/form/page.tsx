import { Form } from '@base-ui-components/react'
import { Button } from './blocks/button'
import type { FormBlock, FormErrors, FormValues } from './types'

export interface FormPageProps {
  blocks: FormBlock[]
  values?: FormValues
  errors?: FormErrors
  showNextButton?: boolean
  setValue?: (blockID: string, value: FormValues[string]) => void
  onNext?: () => void
  onPrev?: () => void
}

export function FormPage({ blocks, values, errors, showNextButton, setValue, onNext }: FormPageProps) {
  // const renderBlock = (block: FormBlock) => {
  //   switch (block.type) {
  //     case 'heading':
  //       return <HeadingBlock key={block.id} block={block} />

  //     case 'paragraph':
  //       return <ParagraphBlock key={block.id} block={block} />

  //     case 'text_input':
  //       return (
  //         <TextInputBlock
  //           key={block.id}
  //           block={block}
  //           defaultValue={values?.[block.id] as string | undefined}
  //           onValueChange={(value) => setValue?.(block.id, value)}
  //         />
  //       )

  //     case 'multiple_choice':
  //       return (
  //         <MultipleChoiceBlock
  //           key={block.id}
  //           block={block}
  //           value={values?.[block.id] as string | string[] | undefined}
  //           onValueChange={(value) => setValue?.(block.id, value)}
  //         />
  //       )

  //     case 'dropdown':
  //       return (
  //         <DropdownBlock
  //           key={block.id}
  //           block={block}
  //           value={values?.[block.id] as string | undefined}
  //           onValueChange={(value) => setValue?.(block.id, value)}
  //         />
  //       )

  //     case 'slider':
  //       return (
  //         <SliderBlock
  //           key={block.id}
  //           block={block}
  //           value={values?.[block.id] as number | undefined}
  //           onValueChange={(value) => setValue?.(block.id, value)}
  //         />
  //       )

  //     case 'gauge':
  //       return <GaugeBlock key={block.id} block={block} />

  //     case 'stat_cards':
  //       return <StatCardsBlock key={block.id} block={block} />

  //     default:
  //       return null
  //   }
  // }

  return (
    <div className="flex w-full flex-col gap-y-6">
      <Form className="flex flex-col" errors={errors}>
        {/* {blocks.map(renderBlock)} */}
      </Form>
      {showNextButton && <Button onClick={onNext}>Next</Button>}
    </div>
  )
}
