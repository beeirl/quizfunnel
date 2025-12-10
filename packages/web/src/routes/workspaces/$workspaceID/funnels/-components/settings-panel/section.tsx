import { cn } from '@beeirl/ui/styles'
import * as React from 'react'

interface SectionRootProps extends React.ComponentProps<'div'> {}

function SectionRoot({ children, className, ...props }: SectionRootProps) {
  return (
    <div className={cn('not-first:border-t not-first:border-gray-200', className)} {...props}>
      {children}
    </div>
  )
}

interface SectionHeaderProps extends React.ComponentProps<'div'> {}

function SectionHeader({ children, className, ...props }: SectionHeaderProps) {
  return (
    <div className={cn('flex items-center justify-between px-4 py-3', className)} {...props}>
      {children}
    </div>
  )
}

interface SectionTitleProps extends React.ComponentProps<'span'> {}

function SectionTitle({ children, className, ...props }: SectionTitleProps) {
  return (
    <span className={cn('text-xs font-semibold text-gray-500', className)} {...props}>
      {children}
    </span>
  )
}

interface SectionContentProps extends React.ComponentProps<'div'> {}

function SectionContent({ children, className, ...props }: SectionContentProps) {
  return (
    <div className={cn('flex flex-col gap-2 px-4 pb-4', className)} {...props}>
      {children}
    </div>
  )
}

export const Section = {
  Root: SectionRoot,
  Header: SectionHeader,
  Title: SectionTitle,
  Content: SectionContent,
}
