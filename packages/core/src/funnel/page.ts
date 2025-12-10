export interface FunnelPage {
  id: string
  blocks: FunnelPage.Block[]
  properties?: {
    buttonText?: string
  }
}

export namespace FunnelPage {
  export interface ShortTextBlock {
    id: string
    type: 'short_text'
    properties: {
      label: string
      description?: string
      placeholder?: string
    }
    validations: {
      email?: boolean
      maxLength?: number
      required?: boolean
    }
  }

  export interface MultipleChoiceBlock {
    id: string
    type: 'multiple_choice'
    properties: {
      label: string
      description?: string
      multiple?: boolean
      choices: {
        id: string
        label: string
        attachment?:
          | {
              type: 'image'
              url: string
            }
          | {
              type: 'emoji'
              emoji: string
            }
      }[]
    }
    validations: {
      minChoices?: number
      maxChoices?: number
      required?: boolean
    }
  }

  export interface DropdownBlock {
    id: string
    type: 'dropdown'
    properties: {
      label: string
      description?: string
      options: {
        id: string
        label: string
      }[]
    }
    validations: {
      required?: boolean
    }
  }

  export interface SliderBlock {
    id: string
    type: 'slider'
    properties: {
      label: string
      description?: string
      step?: number
      defaultValue?: number
      minValue?: number
      maxValue?: number
    }
  }

  export interface ProgressBlock {
    id: string
    type: 'progress'
  }

  export interface HeadingBlock {
    id: string
    type: 'heading'
    properties: {
      text: string
    }
  }

  export interface ParagraphBlock {
    id: string
    type: 'paragraph'
    properties: {
      text: string
    }
  }

  export interface GaugeBlock {
    id: string
    type: 'gauge'
    properties: {
      minValue?: number
      maxValue?: number
      step?: number
      value: string
    }
  }

  export interface ListBlock {
    id: string
    type: 'list'
    properties: {
      orientation: 'horizontal' | 'vertical'
      textPlacement: 'bottom' | 'right'
      size: 'sm' | 'lg'
      items: {
        id: string
        // emoji / icon / image?
        icon: string
        title: string
        subtitle?: string
      }[]
    }
  }

  export type Block =
    | ShortTextBlock
    | MultipleChoiceBlock
    | DropdownBlock
    | SliderBlock
    | ProgressBlock
    | HeadingBlock
    | ParagraphBlock
    | GaugeBlock
    | ListBlock
}
