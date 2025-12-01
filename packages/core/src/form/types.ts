interface TextInputFormBlock {
  id: string
  type: 'text_input'
  properties: {
    label: string
    description?: string
  }
  validations: {
    email?: boolean
    maxLength?: number
    required?: boolean
  }
}

interface MultipleChoiceFormBlock {
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
            type: 'image' | 'video'
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

interface DropdownFormBlock {
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

interface SliderFormBlock {
  id: string
  type: 'slider'
  properties: {
    step?: number
    defaultValue?: number
    minValue?: number
    maxValue?: number
  }
}

interface ProgressFormBlock {
  id: string
  type: 'progress'
}

interface HeadingFormBlock {
  id: string
  type: 'heading'
  properties: {
    text: string
  }
}

interface ParagraphFormBlock {
  id: string
  type: 'paragraph'
  properties: {
    text: string
  }
}

export type FormBlock =
  | TextInputFormBlock
  | MultipleChoiceFormBlock
  | DropdownFormBlock
  | SliderFormBlock
  | ProgressFormBlock
  | HeadingFormBlock
  | ParagraphFormBlock

export type FormPage = {
  id: string
  type: 'cover' | 'content' | 'ending'
  blocks: FormBlock[]
}

export type FormRules = {
  pageID: string
  actions: {
    action: 'jump' | 'hide' | 'add' | 'subtract' | 'multiply' | 'divide' | 'set'
    condition: {
      op: 'lt' | 'lte' | 'gt' | 'gte' | 'eq' | 'neq' | 'always'
      vars: {
        type: 'field' | 'variable' | 'constant'
        value: string | number | boolean
      }[]
    }
    details: {
      to?: {
        type: 'page'
        value: string
      }
      target?: {
        type: 'block' | 'variable'
        value: string
      }
      value?: {
        type: 'constant' | 'variable'
        value: number
      }
    }
  }[]
}

export type FormVariables = Record<string, string | number>
