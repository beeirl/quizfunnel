import { Quiz, QuizProps } from '@/components/quiz'
import { Analytics } from '@shopfunnel/core/analytics/index'
import { Answer } from '@shopfunnel/core/answer/index'
import { Domain } from '@shopfunnel/core/domain/index'
import { Identifier } from '@shopfunnel/core/identifier'
import { Question } from '@shopfunnel/core/question/index'
import { Quiz as QuizCore } from '@shopfunnel/core/quiz/index'
import { Submission } from '@shopfunnel/core/submission/index'
import { Resource } from '@shopfunnel/resource'
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

    const stage = process.env.SST_STAGE
    const domain = process.env.DOMAIN
    const host = getRequestHeader('host')
    if (stage === 'production' && domain && host && !host.endsWith(domain)) {
      const customDomain = await Domain.fromHostname(host)
      if (!customDomain || customDomain.workspaceId !== quiz.workspaceId) {
        throw notFound()
      }
    }

    return quiz
  })

const getQuestions = createServerFn()
  .inputValidator(z.object({ quizId: Identifier.schema('quiz') }))
  .handler(async ({ data }) => {
    return Question.list(data.quizId)
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

const trackEvents = createServerFn()
  .inputValidator(z.array(Analytics.Event))
  .handler(async ({ data }) => {
    await Resource.AnalyticsQueue.sendBatch(
      data.map((event) => {
        if (event.type === 'quiz_view') {
          const userAgent = getRequestHeader('user-agent') || ''
          const country = getRequestHeader('cf-ipcountry') || undefined
          const region = getRequestHeader('cf-region') || undefined
          const city = getRequestHeader('cf-ipcity') || undefined
          const referrer = getRequestHeader('referer') || undefined

          const parser = new UAParser(userAgent)
          const os = parser.getOS().name || undefined
          const browser = parser.getBrowser().name || undefined
          const deviceType = parser.getDevice().type
          const device: 'mobile' | 'desktop' = deviceType === 'mobile' || deviceType === 'tablet' ? 'mobile' : 'desktop'

          return {
            body: {
              ...event,
              payload: {
                ...event.payload,
                country,
                region,
                city,
                os,
                browser,
                device,
                referrer,
              },
            },
          }
        }
        return { body: event }
      }),
    )
  })

export const Route = createFileRoute('/(quiz)/q/$id')({
  component: RouteComponent,
  loader: async ({ params }) => {
    const quiz = await getQuiz({ data: { shortId: params.id } })
    if (!quiz) throw notFound()
    const questions = await getQuestions({ data: { quizId: quiz.id } })
    return { quiz, questions }
  },
})

function RouteComponent() {
  const { quiz, questions } = Route.useLoaderData()

  const quizViewedRef = useRef(false)
  const quizStartedRef = useRef(false)

  const prevPageRef = useRef<{ id: string; index: number; name: string } | undefined>(undefined)

  const currentPageViewedAtRef = useRef<number | undefined>(undefined)
  const [currentPage, setCurrentPage] = useState<{ id: string; index: number; name: string } | undefined>(undefined)

  const [session] = useState(() => {
    const key = `sf_quiz_${quiz.shortId}_session_id`
    return {
      id: () => {
        let id = localStorage.getItem(key)
        if (!id) {
          id = ulid()
          localStorage.setItem(key, id)
        }
        return id
      },
      clear: () => localStorage.removeItem(key),
    }
  })

  const [visitor] = useState(() => {
    const key = 'sf_visitor_id'
    return {
      id: () => {
        let id = localStorage.getItem(key)
        if (!id) {
          id = ulid()
          localStorage.setItem(key, id)
        }
        return id
      },
    }
  })

  const [queue] = useState(() => {
    const items: Promise<unknown>[] = []
    return {
      push: (item: Promise<unknown>) => {
        items.push(item)
      },
      flush: () => Promise.all(items),
    }
  })

  const [event] = useState(() => {
    type Event = Pick<Analytics.Event, 'type' | 'payload'>
    const events: Event[] = []
    return {
      track: (type: Event['type'], payload: Event['payload'] = {}) => {
        const shouldBatch = events.length === 0
        events.push({ type, payload })
        if (shouldBatch) {
          queueMicrotask(() => {
            queue.push(
              trackEvents({
                data: events.splice(0).map((e) => ({
                  type: e.type,
                  visitor_id: visitor.id(),
                  session_id: session.id(),
                  workspace_id: quiz.workspaceId,
                  quiz_id: quiz.id,
                  quiz_version: quiz.version,
                  version: '1',
                  payload: e.payload,
                  timestamp: new Date().toISOString(),
                })) as Analytics.Event[],
              }),
            )
          })
        }
      },
    }
  })

  useEffect(() => {
    if (quizViewedRef.current) return
    quizViewedRef.current = true
    event.track('quiz_view')
  }, [])

  useEffect(() => {
    if (!currentPage) return
    event.track('page_view', {
      prev_page_id: prevPageRef.current?.id,
      prev_page_index: prevPageRef.current?.index,
      prev_page_name: prevPageRef.current?.name,
      page_id: currentPage.id,
      page_index: currentPage.index,
      page_name: currentPage.name,
    })
  }, [currentPage])

  const handlePageChange: QuizProps['onPageChange'] = (page) => {
    currentPageViewedAtRef.current = Date.now()
    prevPageRef.current = currentPage
    setCurrentPage(page)
  }

  const handlePageComplete: QuizProps['onPageComplete'] = (page) => {
    if (!quizStartedRef.current) {
      quizStartedRef.current = true
      event.track('quiz_start')
    }

    const questionsByBlockId = new Map(questions.map((q) => [q.blockId, q]))
    for (const [blockId, value] of Object.entries(page.values)) {
      const question = questionsByBlockId.get(blockId)
      if (!question) continue
      event.track('question_answer', {
        page_id: page.id,
        question_id: question.id,
        question_type: question.type,
        question_title: question.title,
        ...(typeof value === 'string' && { answer_value_text: value }),
        ...(typeof value === 'number' && { answer_value_number: value }),
        ...(Array.isArray(value) && { answer_value_option_ids: value }),
      })
    }

    event.track('page_complete', {
      page_id: page.id,
      page_index: page.index,
      page_name: page.name,
      page_duration: currentPageViewedAtRef.current ? Date.now() - currentPageViewedAtRef.current : 0,
    })

    if (Object.keys(page.values).length > 0) {
      queue.push(
        submitAnswers({
          data: {
            quizId: quiz.id,
            sessionId: session.id(),
            answers: Object.entries(page.values).map(([blockId, value]) => ({ blockId, value })),
          },
        }),
      )
    }
  }

  const handleQuizComplete: QuizProps['onComplete'] = async () => {
    event.track('quiz_complete')
    queue.push(completeSubmission({ data: { sessionId: session.id() } }))
    await queue.flush()
    session.clear()
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
