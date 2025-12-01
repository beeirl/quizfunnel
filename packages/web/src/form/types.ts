import type { Form } from '@shopfunnel/core/form/index'

export type FormInfo = Form.Info

export { FormBlock, FormPage, FormRules, FormVariables } from '@shopfunnel/core/form/types'

export type FormValues = Record<string, string | string[] | number>
