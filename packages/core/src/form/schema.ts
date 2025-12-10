export namespace FunnelSchema {
  export namespace Page {
    export interface ShortTextComponent {
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

    export interface MultipleChoiceComponent {
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

    export interface DropdownComponent {
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

    export interface SliderComponent {
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

    export interface ProgressComponent {
      id: string
      type: 'progress'
    }

    export interface HeadingComponent {
      id: string
      type: 'heading'
      properties: {
        text: string
      }
    }

    export interface ParagraphComponent {
      id: string
      type: 'paragraph'
      properties: {
        text: string
      }
    }

    export interface GaugeComponent {
      id: string
      type: 'gauge'
      properties: {
        minValue?: number
        maxValue?: number
        step?: number
        value: string
      }
    }

    export interface ListComponent {
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

    export type Component =
      | ShortTextComponent
      | MultipleChoiceComponent
      | DropdownComponent
      | SliderComponent
      | ProgressComponent
      | HeadingComponent
      | ParagraphComponent
      | GaugeComponent
      | ListComponent
  }

  export interface Page {
    id: string
    components: Page.Component[]
    properties?: {
      buttonText?: string
    }
  }

  export namespace Rule {
    export interface LogicalCondition {
      op: 'and' | 'or'
      vars: ComparisonCondition[]
    }

    export interface ComparisonCondition {
      op: 'lt' | 'lte' | 'gt' | 'gte' | 'eq' | 'neq' | 'always'
      vars: {
        type: 'component' | 'variable' | 'constant'
        value: string | number | boolean
      }[]
    }

    export type Condition = ComparisonCondition | LogicalCondition

    export interface Action {
      type: 'jump' | 'hide' | 'add' | 'subtract' | 'multiply' | 'divide' | 'set'
      condition: Condition
      details: {
        to?: {
          type: 'page'
          value: string
        }
        target?: {
          type: 'component' | 'variable'
          value: string
        }
        value?: {
          type: 'constant' | 'variable'
          value: number
        }
      }
    }
  }

  export interface Rule {
    pageId: string
    actions: Rule.Action[]
  }

  export type Variables = Record<string, string | number>
}

export interface FunnelSchema {
  pages: FunnelSchema.Page[]
  rules: FunnelSchema.Rule[]
  variables: FunnelSchema.Variables
}
