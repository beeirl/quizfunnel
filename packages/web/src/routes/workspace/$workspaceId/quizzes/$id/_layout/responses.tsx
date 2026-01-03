import { Button } from '@/components/ui/button'
import { withActor } from '@/context/auth.withActor'
import { cn } from '@/lib/utils'
import { Identifier } from '@shopfunnel/core/identifier'
import { Submission } from '@shopfunnel/core/submission/index'
import { IconArrowLeft as ArrowLeftIcon, IconArrowRight as ArrowRightIcon } from '@tabler/icons-react'
import { keepPreviousData, queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import * as React from 'react'
import { z } from 'zod'

const listSubmissions = createServerFn()
  .inputValidator(
    z.object({
      workspaceId: Identifier.schema('workspace'),
      quizId: Identifier.schema('quiz'),
      page: z.number().int().positive().default(1),
    }),
  )
  .handler(({ data }) => {
    return withActor(() => Submission.list({ quizId: data.quizId, page: data.page, limit: 50 }), data.workspaceId)
  })

const listSubmissionsQueryOptions = (workspaceId: string, quizId: string, page: number = 1) =>
  queryOptions({
    queryKey: ['submissions', workspaceId, quizId, page],
    queryFn: () => listSubmissions({ data: { workspaceId, quizId, page } }),
    placeholderData: keepPreviousData,
  })

export const Route = createFileRoute('/workspace/$workspaceId/quizzes/$id/_layout/responses')({
  validateSearch: (search) =>
    z
      .object({
        page: z.coerce.number().int().positive().optional(),
      })
      .parse(search),
  loaderDeps: ({ search }) => ({ page: search.page }),
  component: RouteComponent,
  ssr: false,
  loader: async ({ context, params, deps }) => {
    await context.queryClient.ensureQueryData(
      listSubmissionsQueryOptions(params.workspaceId, params.id, deps.page ?? 1),
    )
  },
})

type RowData = {
  submittedAt: string
  [questionId: string]: string
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

const columnHelper = createColumnHelper<RowData>()

function RouteComponent() {
  const params = Route.useParams()
  const search = Route.useSearch()
  const navigate = Route.useNavigate()

  const currentPage = search.page ?? 1

  const { data, isFetching } = useSuspenseQuery(listSubmissionsQueryOptions(params.workspaceId, params.id, currentPage))

  const goToPage = (newPage: number) => {
    navigate({ search: { page: newPage } })
  }

  const columns = React.useMemo(() => {
    const questionColumns = data.questions
      .sort((a, b) => a.index - b.index)
      .map((q) =>
        columnHelper.accessor(q.id, {
          header: q.title,
        }),
      )

    return [
      columnHelper.accessor('submittedAt', {
        header: 'Submitted at',
      }),
      ...questionColumns,
    ]
  }, [data.questions])

  const tableData: RowData[] = React.useMemo(() => {
    return data.submissions.map((submission) => {
      const row: RowData = {
        submittedAt: formatDate(new Date(submission.completedAt ?? submission.createdAt)),
      }
      for (const question of data.questions) {
        const answers = submission.answers[question.id]
        row[question.id] = answers?.join(', ') ?? ''
      }
      return row
    })
  }, [data.submissions, data.questions])

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  const pages = () => {
    const { totalPages } = data
    const start = Math.max(1, currentPage - 5)
    const end = Math.min(totalPages, currentPage + 5)
    const pages: number[] = []
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
    return pages
  }

  const hasMore = data.totalPages > 1

  return (
    <div className={cn('flex flex-1 flex-col overflow-hidden px-6 pt-6', hasMore ? 'pb-1.5' : 'pb-6')}>
      <div className="mb-6 text-2xl font-bold">Responses</div>
      <div className="max-h-full overflow-auto rounded-lg border">
        <table className="w-full min-w-max caption-bottom text-sm">
          <thead className="sticky top-0 z-10 [&_tr]:border-b">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="bg-muted transition-colors">
                {headerGroup.headers.map((header, index) => {
                  const isFirstColumn = index === 0
                  const isLastColumn = index === headerGroup.headers.length - 1
                  return (
                    <th
                      key={header.id}
                      className={cn(
                        'h-10 p-0 text-left align-middle font-medium whitespace-nowrap text-foreground',
                        isFirstColumn ? 'sticky left-0 z-20 w-56 bg-muted' : 'min-w-56',
                      )}
                    >
                      <div
                        className={cn('flex h-full items-center px-2 py-2', !isLastColumn && 'border-r border-border')}
                        style={isFirstColumn ? { boxShadow: 'rgba(89, 86, 93, 0.04) 2px 0px 0px' } : undefined}
                      >
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </div>
                    </th>
                  )
                })}
              </tr>
            ))}
          </thead>
          <tbody className="[&_tr:last-child]:border-0">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-b">
                {row.getVisibleCells().map((cell, index) => {
                  const isFirstColumn = index === 0
                  const isLastColumn = index === row.getVisibleCells().length - 1
                  return (
                    <td
                      key={cell.id}
                      className={cn(
                        'p-0 align-middle whitespace-nowrap',
                        isFirstColumn ? 'sticky left-0 w-56 bg-background' : 'min-w-56',
                      )}
                    >
                      <div
                        className={cn('flex items-center p-2', !isLastColumn && 'border-r border-border')}
                        style={isFirstColumn ? { boxShadow: 'rgba(89, 86, 93, 0.04) 2px 0px 0px' } : undefined}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </div>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {hasMore && (
        <div className="sticky bottom-0 flex gap-2 pt-1.5">
          <Button
            disabled={currentPage === 1 || isFetching}
            size="icon-sm"
            variant="ghost"
            onClick={() => goToPage(currentPage - 1)}
          >
            <ArrowLeftIcon />
          </Button>
          {pages().map((page) => (
            <Button
              key={page}
              className="tabular-nums"
              disabled={isFetching}
              size="sm"
              variant={currentPage === page ? 'secondary' : 'ghost'}
              onClick={() => goToPage(page)}
            >
              {page}
            </Button>
          ))}
          <Button
            disabled={currentPage >= data.totalPages || isFetching}
            size="icon-sm"
            variant="ghost"
            onClick={() => goToPage(currentPage + 1)}
          >
            <ArrowRightIcon />
          </Button>
        </div>
      )}
    </div>
  )
}
