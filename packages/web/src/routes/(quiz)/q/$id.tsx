import { Quiz, QuizProps } from '@/components/quiz'
import { Analytics } from '@shopfunnel/core/analytics/index'
import { Answer } from '@shopfunnel/core/answer/index'
import { Identifier } from '@shopfunnel/core/identifier'
import { Question } from '@shopfunnel/core/question/index'
import { Quiz as QuizCore } from '@shopfunnel/core/quiz/index'
import { Submission } from '@shopfunnel/core/submission/index'
import { Resource } from '@shopfunnel/resource'
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, notFound } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { getRequestHeader } from '@tanstack/react-start/server'
import { useEffect, useRef, useState } from 'react'
import { UAParser } from 'ua-parser-js'
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

const getQuestions = createServerFn()
  .inputValidator(z.object({ quizId: Identifier.schema('quiz') }))
  .handler(async ({ data }) => {
    return Question.list(data.quizId)
  })

const getQuestionsQueryOptions = (quizId: string) =>
  queryOptions({
    queryKey: ['questions', quizId],
    queryFn: () => getQuestions({ data: { quizId } }),
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

const enqueueEvents = createServerFn()
  .inputValidator(z.array(Analytics.Event))
  .handler(async ({ data }) => {
    const userAgent = getRequestHeader('user-agent') || ''
    const country = getRequestHeader('cf-ipcountry') || undefined
    const region = getRequestHeader('cf-region') || undefined
    const city = getRequestHeader('cf-ipcity') || undefined

    const parser = new UAParser(userAgent)
    const os = parser.getOS().name || undefined
    const browser = parser.getBrowser().name || undefined
    const deviceType = parser.getDevice().type
    const device: 'mobile' | 'desktop' = deviceType === 'mobile' || deviceType === 'tablet' ? 'mobile' : 'desktop'

    await Resource.AnalyticsQueue.sendBatch(
      data.map((event) => ({
        body: { ...event, country, region, city, os, browser, device },
      })),
    )
  })

export const Route = createFileRoute('/(quiz)/q/$id')({
  component: RouteComponent,
  loader: async ({ context, params }) => {
    const quiz = await context.queryClient.ensureQueryData(getQuizQueryOptions(params.id))
    if (!quiz) throw notFound()
    await context.queryClient.ensureQueryData(getQuestionsQueryOptions(quiz.id))
  },
})

function RouteComponent() {
  const params = Route.useParams()

  const SESSION_STORAGE_KEY = `sf_quiz_${params.id}_session_id`
  const VISITOR_STORAGE_KEY = 'sf_visitor_id'

  const quizQuery = useSuspenseQuery(getQuizQueryOptions(params.id))
  const quiz = quizQuery.data

  const questionsQuery = useSuspenseQuery(getQuestionsQueryOptions(quiz.id))
  const questions = questionsQuery.data

  const [sessionId, setSessionId] = useState<string | null>(null)
  const [visitorId, setVisitorId] = useState<string | null>(null)

  useEffect(() => {
    let id = localStorage.getItem(SESSION_STORAGE_KEY)
    if (!id) {
      id = ulid()
      localStorage.setItem(SESSION_STORAGE_KEY, id)
    }
    setSessionId(id)
  }, [SESSION_STORAGE_KEY])

  useEffect(() => {
    let id = localStorage.getItem(VISITOR_STORAGE_KEY)
    if (!id) {
      id = ulid()
      localStorage.setItem(VISITOR_STORAGE_KEY, id)
    }
    setVisitorId(id)
  }, [])

  const quizViewedRef = useRef(false)
  const quizStartedRef = useRef(false)
  const pageViewedAtRef = useRef<number>(Date.now())

  useEffect(() => {
    if (!sessionId || !visitorId) return
    if (quizViewedRef.current) return
    quizViewedRef.current = true
    trackEvents([{ type: 'quiz_view' }])
  }, [sessionId, visitorId])

  const promisesRef = useRef<Set<Promise<unknown>>>(new Set())
  const addPromise = <T,>(promise: Promise<T>): Promise<T> => {
    promisesRef.current.add(promise)
    promise.finally(() => promisesRef.current.delete(promise))
    return promise
  }

  const trackEvents = (events: Partial<Analytics.Event>[]) => {
    if (!sessionId || !visitorId) return
    const params = new URLSearchParams(window.location.search)
    addPromise(
      enqueueEvents({
        data: events.map(
          (event) =>
            ({
              ...event,
              quiz_id: quiz.id,
              quiz_version: quiz.version,
              workspace_id: quiz.workspaceId,
              session_id: sessionId,
              visitor_id: visitorId,
              timestamp: new Date().toISOString(),
              referrer: document.referrer || undefined,
              utm_source: params.get('utm_source') || undefined,
              utm_medium: params.get('utm_medium') || undefined,
              utm_campaign: params.get('utm_campaign') || undefined,
              utm_term: params.get('utm_term') || undefined,
              utm_content: params.get('utm_content') || undefined,
            }) as Analytics.Event,
        ),
      }),
    )
  }

  const handlePageChange: QuizProps['onPageChange'] = (page) => {
    pageViewedAtRef.current = Date.now()

    trackEvents([
      {
        type: 'page_view',
        from_page_id: page.fromId,
        from_page_index: page.fromIndex,
        from_page_name: page.fromName,
        page_id: page.id,
        page_index: page.index,
        page_name: page.name,
      },
    ])
  }

  const handlePageComplete: QuizProps['onPageComplete'] = (page) => {
    if (!sessionId) return

    const events: Partial<Analytics.Event>[] = []

    if (!quizStartedRef.current) {
      quizStartedRef.current = true
      events.push({ type: 'quiz_start' })
    }

    const timeOnPageMs = Date.now() - pageViewedAtRef.current
    const questionsByBlockId = new Map(questions.map((q) => [q.blockId, q]))

    for (const [blockId, answerValue] of Object.entries(page.values)) {
      const question = questionsByBlockId.get(blockId)
      if (question) {
        events.push({
          type: 'question_answer',
          from_page_id: page.fromId,
          from_page_index: page.fromIndex,
          from_page_name: page.fromName,
          page_id: page.id,
          page_name: page.name,
          question_id: question.id,
          question_type: question.type,
          question_title: question.title,
          answer_value_text: typeof answerValue === 'string' ? answerValue : undefined,
          answer_value_number: typeof answerValue === 'number' ? answerValue : undefined,
          answer_value_option_ids: Array.isArray(answerValue) ? answerValue : undefined,
        })
      }
    }

    events.push({
      type: 'page_complete',
      from_page_id: page.fromId,
      from_page_index: page.fromIndex,
      from_page_name: page.fromName,
      page_id: page.id,
      page_index: page.index,
      page_name: page.name,
      time_on_page_ms: timeOnPageMs,
    })

    if (Object.entries(page.values).length) {
      addPromise(
        submitAnswers({
          data: {
            quizId: quiz.id,
            sessionId,
            answers: Object.entries(page.values).map(([blockId, value]) => ({
              blockId,
              value,
            })),
          },
        }),
      )
    }

    if (events.length > 0) {
      trackEvents(events)
    }
  }

  const handleQuizComplete: QuizProps['onComplete'] = async () => {
    if (!sessionId) return

    trackEvents([{ type: 'quiz_complete' }])
    addPromise(completeSubmission({ data: { sessionId } }))

    await Promise.all(promisesRef.current)

    localStorage.removeItem(SESSION_STORAGE_KEY)
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <Quiz
        quiz={quiz}
        mode="live"
        onPageChange={handlePageChange}
        onPageComplete={handlePageComplete}
        onComplete={handleQuizComplete}
      />
    </div>
  )
}
