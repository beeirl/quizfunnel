export interface FunnelRule {
  pageId: string
  actions: FunnelRule.Action[]
}

export namespace FunnelRule {
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
