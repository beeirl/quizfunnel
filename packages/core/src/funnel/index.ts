import z from 'zod'
import { FunnelPage } from './page'
import { FunnelRule } from './rule'
import { FunnelVariables } from './variable'

export namespace Funnel {
  export const Info = z.object({
    id: z.string(),
    shortID: z.string(),
    title: z.string(),
    schema: z.record(z.string(), z.any()),
  })
  export type Info = {
    id: string
    shortID: string
    title: string
    pages: Funnel.Page[]
    rules: Funnel.Rule[]
    variables: Funnel.Variables
  }

  export import Page = FunnelPage
  export import Rule = FunnelRule
  export type Variables = FunnelVariables
}
