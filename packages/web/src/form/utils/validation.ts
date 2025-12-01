import { FormBlock, FormPage, FormValues } from '../types'
import { isInputBlock } from './block'

function validateTextInputBlock(
  block: Extract<FormBlock, { type: 'text_input' }>,
  fieldValue: FormValues[string] | undefined,
): string | null {
  const value = (fieldValue as string) ?? ''

  if (block.validations?.required && !value.trim()) {
    return 'This field is required'
  }

  if (block.validations?.email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (value && !emailRegex.test(value)) {
      return 'Please enter a valid email'
    }
  }

  if (block.validations?.maxLength && value.length > block.validations.maxLength) {
    return `Maximum ${block.validations.maxLength} characters`
  }

  return null
}

function validateDropdownBlock(
  block: Extract<FormBlock, { type: 'dropdown' }>,
  value: FormValues[string] | undefined,
): string | null {
  if (block.validations?.required) {
    if (value === undefined || value === '') {
      return 'Please select an option'
    }
  }
  return null
}

function validateMultipleChoiceBlock(
  block: Extract<FormBlock, { type: 'multiple_choice' }>,
  value: FormValues[string] | undefined,
): string | null {
  const selectedCount = Array.isArray(value) ? value.length : value ? 1 : 0

  if (block.validations?.required && selectedCount === 0) {
    return 'Please select at least one option'
  }

  if (block.validations?.minChoices && selectedCount < block.validations.minChoices) {
    return `Please select at least ${block.validations.minChoices} option(s)`
  }

  if (block.validations?.maxChoices && selectedCount > block.validations.maxChoices) {
    return `Please select at most ${block.validations.maxChoices} option(s)`
  }

  return null
}

function validateBlock(
  block: Extract<FormBlock, { type: 'text_input' | 'multiple_choice' | 'dropdown' | 'slider' }>,
  value: FormValues[string] | undefined,
): string | null {
  switch (block.type) {
    case 'text_input':
      return validateTextInputBlock(block, value)
    case 'dropdown':
      return validateDropdownBlock(block, value)
    case 'multiple_choice':
      return validateMultipleChoiceBlock(block, value)
    case 'slider':
      return null
    default:
      return null
  }
}

export function validatePage(page: FormPage, values: FormValues) {
  const errors: Record<string, string> = {}

  for (const block of page.blocks) {
    if (isInputBlock(block)) {
      const error = validateBlock(block, values[block.id])
      if (error) errors[block.id] = error
    }
  }

  return errors
}
