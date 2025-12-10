import { IconProps } from '@/components/icon'
import type { Funnel } from '@shopfunnel/core/funnel/index'

const BLOCK_ICONS: Record<Funnel.Page.Block['type'], IconProps['name']> = {
  short_text: 'short_text',
  multiple_choice: 'multiple_choice',
  dropdown: 'dropdown',
  heading: 'heading',
  gauge: 'gauge',
  list: 'list',
  progress: 'progress',
  slider: 'slider',
  paragraph: 'paragraph',
}

export function getBlockIconName(blockType: Funnel.Page.Block['type']) {
  return BLOCK_ICONS[blockType]
}

const BLOCK_NAMES: Record<Funnel.Page.Block['type'], string> = {
  short_text: 'Short Text',
  multiple_choice: 'Multiple Choice',
  dropdown: 'Dropdown',
  heading: 'Heading',
  gauge: 'Gauge',
  list: 'List',
  progress: 'Progress',
  slider: 'Slider',
  paragraph: 'Paragraph',
}

export function getBlockName(blockType: Funnel.Page.Block['type']) {
  return BLOCK_NAMES[blockType]
}

const BLOCK_DESCRIPTIONS: Record<Funnel.Page.Block['type'], string> = {
  short_text:
    'Use this to insert a question combined with a short text answer. Add an answer label or placeholder text for guidance.',
  multiple_choice:
    'Use this to insert a question combined with multiple choice answers. Add an answer label or placeholder text for guidance.',
  dropdown: 'A compact way to present many options. Users can select one option from a dropdown menu.',
  heading: 'Add a title or section header to organize your form and guide users through different sections.',
  gauge: 'Display a visual gauge to show progress or a value within a range.',
  list: 'Display a list of items with icons and text. Great for showing features or benefits.',
  progress: 'Show users how far along they are in completing the form.',
  slider: 'Allow users to select a value within a range using a slider.',
  paragraph: 'Add descriptive text to provide context or instructions.',
}

export function getBlockDescription(blockType: Funnel.Page.Block['type']) {
  return BLOCK_DESCRIPTIONS[blockType]
}
