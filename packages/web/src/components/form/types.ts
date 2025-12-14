import type { Block, Page, Rule, Variables, Condition, ComparisonCondition } from '@shopfunnel/core/funnel/schema'

export interface FormInfo {
  id: string
  schema: {
    pages: Page[]
    rules: Rule[]
    variables: Variables
  }
}

export type FormBlock = Block

export type FormVariables = Variables

export type FormValues = Record<string, unknown>

export type FormErrors = Record<string, string>

// Re-export schema types for convenience
export type { Block, Page, Rule, Variables, Condition, ComparisonCondition }
