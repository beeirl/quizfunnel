import { Field as BaseField } from '@base-ui-components/react/field'
import { cn } from '@beeirl/ui/styles'

interface FieldProps {
  children: React.ReactNode
  className?: string
  mode?: 'preview' | 'live'
  label?: string
  description?: string
}

export function Field({ mode = 'live', label, description, children, className }: FieldProps) {
  return (
    <BaseField.Root className={cn('flex flex-col', className)}>
      {label && <BaseField.Label className="text-lg font-bold text-gray-900">{label}</BaseField.Label>}
      {description && (
        <BaseField.Description className="mt-1 text-sm text-gray-500">{description}</BaseField.Description>
      )}
      <div className="mt-3">{children}</div>
      {mode === 'live' && <BaseField.Error className="mt-2 text-sm text-red-600" />}
    </BaseField.Root>
  )
}
