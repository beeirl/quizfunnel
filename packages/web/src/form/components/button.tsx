import { cn } from '@/lib/utils'
import { Button as BaseButton } from '@base-ui/react/button'

export type ButtonProps = BaseButton.Props & {
  mode?: 'preview' | 'live'
}

export function Button({ className, mode = 'live', ...props }: ButtonProps) {
  return (
    <BaseButton
      className={cn(
        'h-11 rounded-(--radius) bg-primary text-base font-semibold text-primary-foreground hover:bg-(--primary)/80',
        mode === 'preview' && 'pointer-events-none',
        className,
      )}
      {...props}
    />
  )
}
