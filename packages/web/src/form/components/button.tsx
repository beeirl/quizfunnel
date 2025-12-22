import { cn } from '@/lib/utils'
import { Button as BaseButton } from '@base-ui/react/button'

export type ButtonProps = BaseButton.Props & {
  static?: boolean
}

export function Button({ className, static: isStatic = false, ...props }: ButtonProps) {
  return (
    <BaseButton
      className={cn(
        'h-12 rounded-(--sf-radius) bg-(--sf-color-primary) text-base font-semibold text-(--sf-color-primary-foreground) not-first:mt-6 hover:bg-(--sf-color-primary)/80',
        isStatic && 'pointer-events-none',
        className,
      )}
      {...props}
    />
  )
}
