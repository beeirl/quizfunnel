import { cn } from '@/lib/utils'
import { Page as PageSchema } from '@shopfunnel/core/form/schema'
import { FormTheme } from '@shopfunnel/core/form/theme'
import { Block } from '../block'
import { Button } from '../components/button'

export type DisplayMode = 'desktop' | 'mobile'

export type PageProps =
  | {
      mode: 'preview'
      schema: PageSchema
      theme: FormTheme
      selectedBlockId: string | null
      displayMode?: DisplayMode
      className?: string
      onBlockSelect: (id: string | null) => void
    }
  | {
      mode: 'live'
      schema: PageSchema
      values: Record<string, unknown>
      theme: FormTheme
      className?: string
      onButtonClick: () => void
      onBlockValueChange: (id: string, value: unknown) => void
    }

export function Page(props: PageProps) {
  return (
    <div
      className={cn('h-full w-full bg-(--sf-color-background) px-12 pt-24 pb-12', props.className)}
      style={
        {
          '--sf-color-primary': props.theme.colors.primary,
          '--sf-color-primary-foreground': props.theme.colors.primaryForeground,
          '--sf-color-background': props.theme.colors.background,
          '--sf-color-foreground': props.theme.colors.foreground,
          '--sf-radius': props.theme.radius.value,
        } as React.CSSProperties
      }
    >
      <div
        className={cn(
          '@container flex flex-col gap-y-6',
          props.mode === 'preview' &&
            cn(
              'mx-auto transition-all duration-200',
              props.displayMode === 'desktop' && 'max-w-xl',
              props.displayMode === 'mobile' && 'max-w-sm',
            ),
        )}
      >
        {props.schema.blocks.map((block) => (
          <Block
            key={block.id}
            mode={props.mode}
            schema={block}
            selected={props.mode === 'preview' && props.selectedBlockId === block.id}
            value={props.mode === 'live' ? props.values[block.id] : undefined}
            onChange={props.mode === 'live' ? (value) => props.onBlockValueChange(block.id, value) : undefined}
            onSelect={props.mode === 'preview' ? () => props.onBlockSelect(block.id) : undefined}
          />
        ))}
        {props.schema.properties.showButton && (
          <Button mode={props.mode} onClick={props.mode === 'live' ? props.onButtonClick : undefined}>
            {props.schema.properties.buttonText}
          </Button>
        )}
      </div>
    </div>
  )
}
