import { Page as PageSchema } from '@shopfunnel/core/form/schema'
import { FormTheme } from '@shopfunnel/core/form/theme'
import { Block } from '../block'
import { Button } from '../components/button'

type PageProps =
  | {
      mode: 'preview'
      schema: PageSchema
      selectedBlockId: string | null
      theme: FormTheme
      onBlockSelect: (id: string | null) => void
    }
  | {
      mode: 'live'
      schema: PageSchema
      values: Record<string, unknown>
      theme: FormTheme
      onButtonClick: () => void
      onBlockValueChange: (id: string, value: unknown) => void
    }

export function Page(props: PageProps) {
  return (
    <div
      className="flex w-full flex-col gap-y-6"
      style={
        {
          '--color-primary': props.theme.colors.primary,
          '--color-primary-foreground': props.theme.colors.primaryForeground,
          '--color-background': props.theme.colors.background,
          '--color-foreground': props.theme.colors.foreground,
          '--radius': props.theme.radius.value,
        } as React.CSSProperties
      }
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
  )
}
