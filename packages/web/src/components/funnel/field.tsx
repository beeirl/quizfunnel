import { Field as BaseUIField } from '@base-ui-components/react/field'
import { cn } from '@beeirl/ui/styles'

interface FieldProps {
  mode?: 'preview' | 'live'
  label?: string
  description?: string
  error?: string
  children: React.ReactNode
  className?: string
}

export function Field({ mode = 'live', label, description, error, children, className }: FieldProps) {
  return (
    <BaseUIField.Root className={cn('flex flex-col', className)}>
      {label && <BaseUIField.Label className="text-lg font-bold text-gray-900">{label}</BaseUIField.Label>}
      {description && (
        <BaseUIField.Description className="mt-1 text-sm text-gray-500">{description}</BaseUIField.Description>
      )}
      <div className="mt-3">{children}</div>
      {mode === 'live' && error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </BaseUIField.Root>
  )
}
