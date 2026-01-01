import { Quiz, type Values } from '@/components/quiz'
import { Answer } from '@shopfunnel/core/answer/index'
import { Identifier } from '@shopfunnel/core/identifier'
import { Quiz as QuizCore } from '@shopfunnel/core/quiz/index'
import { Submission } from '@shopfunnel/core/submission/index'
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, notFound } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import * as React from 'react'
import { ulid } from 'ulid'
import { z } from 'zod'

const getQuiz = createServerFn()
  .inputValidator(z.object({ shortId: z.string().length(8) }))
  .handler(async ({ data }) => {
    const quiz = await QuizCore.getPublishedVersion(data.shortId)
    if (!quiz) throw notFound()
    return quiz
  })

const getQuizQueryOptions = (shortId: string) =>
  queryOptions({
    queryKey: ['quiz', 'published', shortId],
    queryFn: () => getQuiz({ data: { shortId } }),
  })

const submitAnswers = createServerFn()
  .inputValidator(
    z.object({
      quizId: Identifier.schema('quiz'),
      sessionId: z.string(),
      answers: z.array(
        z.object({
          blockId: z.string(),
          value: z.unknown(),
        }),
      ),
    }),
  )
  .handler(async ({ data }) => {
    await Answer.submit(data)
  })

const completeSubmission = createServerFn()
  .inputValidator(z.object({ sessionId: z.string() }))
  .handler(async ({ data }) => {
    const submissionId = await Submission.fromSessionId(data.sessionId)
    if (submissionId) {
      await Submission.complete(submissionId)
    }
  })

export const Route = createFileRoute('/(quiz)/q/$id')({
  component: RouteComponent,
  loader: async ({ context, params }) => {
    await context.queryClient.ensureQueryData(getQuizQueryOptions(params.id))
  },
})

function RouteComponent() {
  const params = Route.useParams()
  const [sessionId, setSessionId] = React.useState<string | null>(null)

  const quizQuery = useSuspenseQuery(getQuizQueryOptions(params.id))
  const quiz = quizQuery.data

  const SESSION_KEY = `quiz-session-${params.id}`

  React.useEffect(() => {
    const stored = localStorage.getItem(SESSION_KEY)
    const id = stored ?? ulid()
    if (!stored) {
      localStorage.setItem(SESSION_KEY, id)
    }
    setSessionId(id)
  }, [SESSION_KEY])

  const handleNext = async (currentValues: Values) => {
    const answers = Object.entries(currentValues).map(([blockId, value]) => ({
      blockId,
      value,
    }))

    if (answers.length === 0 || !sessionId) return

    await submitAnswers({
      data: {
        quizId: quiz.id,
        sessionId,
        answers,
      },
    })
  }

  const handleComplete = async () => {
    if (sessionId) {
      await completeSubmission({
        data: { sessionId },
      })
      localStorage.removeItem(SESSION_KEY)
      setSessionId(null)
    }
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <Quiz quiz={quiz} mode="live" onNext={handleNext} onComplete={handleComplete} />
    </div>
  )
}
