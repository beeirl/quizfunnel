import { withActor } from '@/context/auth.withActor'
import { Form } from '@shopfunnel/core/form/index'
import { Identifier } from '@shopfunnel/core/identifier'
import { queryOptions } from '@tanstack/react-query'
import { notFound } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'

export const getForm = createServerFn()
  .inputValidator(
    z.object({
      workspaceId: Identifier.schema('workspace'),
      formId: Identifier.schema('form'),
    }),
  )
  .handler(({ data }) => {
    return withActor(async () => {
      const form = await Form.getCurrentVersion(data.formId)
      if (!form) throw notFound()
      return form
    }, data.workspaceId)
  })

export const getFormQueryOptions = (workspaceId: string, formId: string) =>
  queryOptions({
    queryKey: ['form', workspaceId, formId],
    queryFn: () => getForm({ data: { workspaceId, formId } }),
  })
