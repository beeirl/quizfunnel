import { Block } from '@/block'
import { Button } from '@/components/ui/button'
import { Form } from '@base-ui-components/react'
import type { FormBlock, FormErrors, FormValues } from './types'

export interface FormPageProps {
  blocks: FormBlock[]
  values?: FormValues
  errors?: FormErrors
  showNextButton?: boolean
  setValue?: (blockId: string, value: FormValues[string]) => void
  onNext?: () => void
  onPrev?: () => void
}

export function FormPage({ blocks, values, errors, showNextButton, setValue, onNext }: FormPageProps) {
  return (
    <div className="flex w-full flex-col gap-y-6">
      <Form className="flex flex-col gap-y-4" errors={errors}>
        {blocks.map((block) => (
          <Block
            key={block.id}
            mode="live"
            block={block}
            value={values?.[block.id]}
            onChange={(value) => setValue?.(block.id, value)}
          />
        ))}
      </Form>
      {showNextButton && <Button onClick={onNext}>Next</Button>}
    </div>
  )
}
