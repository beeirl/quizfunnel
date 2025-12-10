import z from 'zod'
import { FunnelSchema } from './schema'

export namespace Funnel {
  export type Schema = FunnelSchema

  export const Info = z.object({
    id: z.string(),
    shortID: z.string(),
    title: z.string(),
    schema: z.record(z.string(), z.any()),
  })
  export type Info = z.infer<typeof Info> & { schema: Schema }
}
