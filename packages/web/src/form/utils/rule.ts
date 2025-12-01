import { FormRules, FormValues, FormVariables } from '../types'

function resolveVar(input: {
  variable: FormRules['actions'][0]['condition']['vars'][0]
  values: FormValues
  variables: FormVariables
}) {
  switch (input.variable.type) {
    case 'constant':
      return input.variable.value
    case 'variable':
      return input.variables[input.variable.value as string] ?? 0
    case 'field':
      return input.values[input.variable.value as string] ?? ''
    default:
      return input.variable.value
  }
}

function dispatchAction(input: { action: FormRules['actions'][0]; variables: FormVariables }) {
  const { action: type, details } = input.action

  switch (type) {
    case 'jump':
      return {
        jumpTo: details.to?.value,
      }

    case 'hide':
      if (details.target?.type === 'block') {
        return {
          hiddenBlockId: details.target.value,
        }
      }
      break

    case 'add':
      if (details.target?.type === 'variable' && details.value) {
        return {
          variables: {
            ...input.variables,
            [details.target.value]:
              (Number(input.variables[details.target.value]) || 0) + resolveValue(details.value!, input.variables),
          },
        }
      }
      break

    case 'subtract':
      if (details.target?.type === 'variable' && details.value) {
        return {
          variables: {
            ...input.variables,
            [details.target.value]:
              (Number(input.variables[details.target.value]) || 0) - resolveValue(details.value!, input.variables),
          },
        }
      }
      break

    case 'multiply':
      if (details.target?.type === 'variable' && details.value) {
        return {
          variables: {
            ...input.variables,
            [details.target.value]:
              (Number(input.variables[details.target.value]) || 0) * resolveValue(details.value!, input.variables),
          },
        }
      }
      break

    case 'divide':
      if (details.target?.type === 'variable' && details.value) {
        return {
          variables: {
            ...input.variables,
            [details.target.value]:
              (Number(input.variables[details.target.value]) || 0) / resolveValue(details.value!, input.variables),
          },
        }
      }
      break

    case 'set':
      if (details.target?.type === 'variable' && details.value) {
        return {
          variables: {
            ...input.variables,
            [details.target.value]: resolveValue(details.value!, input.variables),
          },
        }
      }
      break
  }
}

function resolveValue(value: { type: 'constant' | 'variable'; value: number }, variables: FormVariables): number {
  if (value.type === 'variable') {
    return Number(variables[value.value]) || 0
  }
  return value.value
}

function evaluateCondition(input: {
  condition: FormRules['actions'][0]['condition']
  values: FormValues
  variables: FormVariables
}) {
  if (input.condition.op === 'always') return true
  if (input.condition.vars.length < 2) return false

  const leftVar = resolveVar({
    variable: input.condition.vars[0]!,
    values: input.values,
    variables: input.variables,
  })
  const rightVar = resolveVar({
    variable: input.condition.vars[1]!,
    values: input.values,
    variables: input.variables,
  })

  switch (input.condition.op) {
    case 'eq':
      if (Array.isArray(leftVar)) {
        return leftVar.includes(rightVar as string)
      }
      if (Array.isArray(rightVar)) {
        return rightVar.includes(leftVar as string)
      }
      return leftVar === rightVar
    case 'neq':
      if (Array.isArray(leftVar)) {
        return !leftVar.includes(rightVar as string)
      }
      if (Array.isArray(rightVar)) {
        return !rightVar.includes(leftVar as string)
      }
      return leftVar !== rightVar
    case 'lt':
      return Number(leftVar) < Number(rightVar)
    case 'lte':
      return Number(leftVar) <= Number(rightVar)
    case 'gt':
      return Number(leftVar) > Number(rightVar)
    case 'gte':
      return Number(leftVar) >= Number(rightVar)
    default:
      return false
  }
}

export function evaluatePageRules(input: {
  pageId: string
  rules: FormRules[]
  values: FormValues
  variables: FormVariables
}) {
  let jumpTo: string | undefined
  let variables = { ...input.variables }
  const hiddenBlockIds = new Set<string>()

  const rules = input.rules.find((rule) => rule.pageID === input.pageId)
  if (rules) {
    for (const action of rules.actions) {
      const match = evaluateCondition({
        condition: action.condition,
        values: input.values,
        variables: input.variables,
      })
      if (match) {
        const result = dispatchAction({ action, variables })
        if (result) {
          if (result.jumpTo) jumpTo = result.jumpTo
          if (result.variables) variables = { ...variables, ...result.variables }
          if (result.hiddenBlockId) hiddenBlockIds.add(result.hiddenBlockId)
        }
      }
    }
  }

  return {
    jumpTo,
    variables,
    hiddenBlockIds: Array.from(hiddenBlockIds),
  }
}
