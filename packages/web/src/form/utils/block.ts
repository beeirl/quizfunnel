import type { FormBlock, FormValues, FormVariables } from '../types'

export function isInputBlock(
  block: FormBlock,
): block is Extract<FormBlock, { type: 'text_input' | 'multiple_choice' | 'dropdown' | 'slider' }> {
  return ['text_input', 'multiple_choice', 'dropdown', 'slider'].includes(block.type)
}

export function interpolateBlocks(blocks: FormBlock[], variables: FormVariables, values: FormValues): FormBlock[] {
  const VAR_PATTERN = /\{\{var:([^}]+)\}\}/g
  const BLOCK_PATTERN = /\{\{block:([^}]+)\}\}/g

  function interpolate(text: string) {
    text = text.replace(VAR_PATTERN, (_, variableName: string) => {
      const value = variables[variableName.trim()]
      return value !== undefined ? String(value) : ''
    })
    text = text.replace(BLOCK_PATTERN, (_, blockId: string) => {
      const value = values[blockId.trim()]
      if (value === undefined) return ''
      if (Array.isArray(value)) return value.join(', ')
      return String(value)
    })
    return text
  }

  return blocks.map((block): FormBlock => {
    switch (block.type) {
      case 'heading':
        block.properties.text = interpolate(block.properties.text)
        return block

      case 'paragraph':
        block.properties.text = interpolate(block.properties.text)
        return block

      case 'text_input':
        block.properties.label = interpolate(block.properties.label)
        block.properties.description = block.properties.description
          ? interpolate(block.properties.description)
          : undefined
        return block

      case 'multiple_choice':
        block.properties.label = interpolate(block.properties.label)
        block.properties.description = block.properties.description
          ? interpolate(block.properties.description)
          : undefined
        return block

      case 'dropdown':
        block.properties.label = interpolate(block.properties.label)
        block.properties.description = block.properties.description
          ? interpolate(block.properties.description)
          : undefined
        return block

      default:
        return block
    }
  })
}
