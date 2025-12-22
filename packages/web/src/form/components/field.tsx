import { cn } from '@/lib/utils'
import { Field as BaseField } from '@base-ui/react/field'
import * as React from 'react'

interface FieldProps {
  children: React.ReactNode
  className?: string
  static?: boolean
  name?: string
  label?: string
  description?: string
}

export function Field({ static: isStatic = false, name, label, description, children, className }: FieldProps) {
  return (
    <BaseField.Root className={cn('flex flex-col', className)} name={name}>
      {label && <BaseField.Label className="text-lg font-bold text-foreground">{label}</BaseField.Label>}
      {description && (
        <BaseField.Description className="mt-1 text-sm text-muted-foreground">{description}</BaseField.Description>
      )}
      <div className="mt-4">{children}</div>
      {!isStatic && <BaseField.Error className="mt-2 text-sm text-destructive" />}
    </BaseField.Root>
  )
}
