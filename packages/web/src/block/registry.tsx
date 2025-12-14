import type { BlockType } from '@shopfunnel/core/funnel/schema'
import {
  Activity as ActivityIcon,
  AlignLeft as AlignLeftIcon,
  ChevronDown as ChevronDownIcon,
  CircleDot as CircleDotIcon,
  Gauge as GaugeIcon,
  Heading as HeadingIcon,
  List as ListIcon,
  SlidersHorizontal as SlidersHorizontalIcon,
  Type as TypeIcon,
} from 'lucide-react'

import { Dropdown } from './components/dropdown'
import { Gauge } from './components/gauge'
import { Heading } from './components/heading'
import { List } from './components/list'
import { MultipleChoice } from './components/multiple-choice'
import { Paragraph } from './components/paragraph'
import { Progress } from './components/progress'
import { ShortText } from './components/short-text'
import { Slider } from './components/slider'

export interface BlockRegistryItem {
  type: BlockType
  name: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: React.ComponentType<any>
}

export const blockRegistry: Record<BlockType, BlockRegistryItem> = {
  short_text: {
    type: 'short_text',
    name: 'Short Text',
    description:
      'Use this to insert a question combined with a short text answer. Add an answer label or placeholder text for guidance.',
    icon: TypeIcon,
    component: ShortText,
  },
  multiple_choice: {
    type: 'multiple_choice',
    name: 'Multiple Choice',
    description:
      'Use this to insert a question combined with multiple choice answers. Add an answer label or placeholder text for guidance.',
    icon: CircleDotIcon,
    component: MultipleChoice,
  },
  dropdown: {
    type: 'dropdown',
    name: 'Dropdown',
    description: 'A compact way to present many options. Users can select one option from a dropdown menu.',
    icon: ChevronDownIcon,
    component: Dropdown,
  },
  slider: {
    type: 'slider',
    name: 'Slider',
    description: 'Allow users to select a value within a range using a slider.',
    icon: SlidersHorizontalIcon,
    component: Slider,
  },
  heading: {
    type: 'heading',
    name: 'Heading',
    description: 'Add a title or section header to organize your form and guide users through different sections.',
    icon: HeadingIcon,
    component: Heading,
  },
  paragraph: {
    type: 'paragraph',
    name: 'Paragraph',
    description: 'Add descriptive text to provide context or instructions.',
    icon: AlignLeftIcon,
    component: Paragraph,
  },
  gauge: {
    type: 'gauge',
    name: 'Gauge',
    description: 'Display a visual gauge to show progress or a value within a range.',
    icon: GaugeIcon,
    component: Gauge,
  },
  list: {
    type: 'list',
    name: 'List',
    description: 'Display a list of items with icons and text. Great for showing features or benefits.',
    icon: ListIcon,
    component: List,
  },
  progress: {
    type: 'progress',
    name: 'Progress',
    description: 'Show users how far along they are in completing the form.',
    icon: ActivityIcon,
    component: Progress,
  },
}

export const blockTypes = Object.keys(blockRegistry) as BlockType[]
