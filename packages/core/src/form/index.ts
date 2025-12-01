import z from 'zod'
import { FormPage, FormRules, FormVariables } from './types'

export namespace Form {
  export const Info = z.object({
    id: z.string(),
    shortID: z.string(),
    title: z.string(),
    pages: z.array(z.record(z.string(), z.any())).optional(),
    rules: z.array(z.record(z.string(), z.any())).optional(),
    variables: z.record(z.string(), z.any()).optional(),
  })
  export type Info = z.infer<typeof Info> & {
    pages: FormPage[]
    rules: FormRules[]
    variables: FormVariables
  }
}
