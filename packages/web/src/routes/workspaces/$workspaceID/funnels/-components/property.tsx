import { cn } from '@beeirl/ui/styles'
import * as React from 'react'

interface PropertyRootProps extends React.ComponentProps<'div'> {}

function PropertyRoot({ children, className, ...props }: PropertyRootProps) {
  return (
    <div className={cn('not-first:border-t not-first:border-gray-200', className)} {...props}>
      {children}
    </div>
  )
}

interface PropertyHeaderProps extends React.ComponentProps<'div'> {}

function PropertyHeader({ children, className, ...props }: PropertyHeaderProps) {
  return (
    <div className={cn('flex items-center justify-between px-4 py-3', className)} {...props}>
      {children}
    </div>
  )
}

interface PropertyTitleProps extends React.ComponentProps<'span'> {}

function PropertyTitle({ children, className, ...props }: PropertyTitleProps) {
  return (
    <span className={cn('text-xs font-semibold text-gray-500', className)} {...props}>
      {children}
    </span>
  )
}

interface PropertyContentProps extends React.ComponentProps<'div'> {}

function PropertyContent({ children, className, ...props }: PropertyContentProps) {
  return (
    <div className={cn('flex flex-col gap-2 px-4 pb-4', className)} {...props}>
      {children}
    </div>
  )
}

export const Property = {
  Root: PropertyRoot,
  Header: PropertyHeader,
  Title: PropertyTitle,
  Content: PropertyContent,
}
