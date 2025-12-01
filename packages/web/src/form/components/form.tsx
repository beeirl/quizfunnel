import { AnimatePresence, motion } from 'motion/react'
import * as React from 'react'
import type { FormInfo, FormValues, FormVariables } from '../types'
import { interpolateBlocks } from '../utils/block'
import { evaluatePageRules } from '../utils/rule'
import { validatePage } from '../utils/validation'
import { Page } from './page'

export function Form({ form: info }: Form.Props) {
  const VALUES_STORAGE_KEY = `form-values-${info.id}`
  const valuesRef = React.useRef<FormValues>(initialValues())
  const [values, setValues] = React.useState<FormValues>(initialValues())
  function initialValues() {
    if (typeof window === 'undefined') return {}
    const item = localStorage.getItem(VALUES_STORAGE_KEY)
    if (!item) return {}
    return JSON.parse(item)
  }
  function setValue(blockID: string, value: FormValues[string]) {
    valuesRef.current[blockID] = value
    setValues(valuesRef.current)
    localStorage.setItem(VALUES_STORAGE_KEY, JSON.stringify(valuesRef.current))
  }

  const [variables, setVariables] = React.useState<FormVariables>({ score: 0 })

  const [currentPageIndex, setCurrentPageIndex] = React.useState(0)
  const [currentPageErrors, setCurrentPageErrors] = React.useState<Record<string, string>>({})
  const [currentPageHiddenBlockIds, setCurrentPageHiddenBlockIds] = React.useState<string[]>([])
  const currentPageInfo = info.pages[currentPageIndex]!
  const currentPageBlocks = React.useMemo(() => {
    const visibleBlocks = currentPageInfo.blocks.filter((block) => !currentPageHiddenBlockIds.includes(block.id))
    return interpolateBlocks(visibleBlocks, variables, values)
  }, [currentPageInfo.blocks, currentPageHiddenBlockIds, variables, values])
  const currentPageValues = React.useMemo(() => {
    return Object.fromEntries(
      Object.entries(values).filter(([key]) => currentPageBlocks.map((block) => block.id).includes(key)),
    )
  }, [values, currentPageBlocks])

  function nextPage() {
    const errors = validatePage(currentPageInfo, valuesRef.current)
    setCurrentPageErrors(errors)
    if (Object.keys(errors).length > 0) return

    const result = evaluatePageRules({
      pageId: currentPageInfo.id,
      rules: info.rules,
      values: valuesRef.current,
      variables,
    })
    setVariables((variables) => ({ ...variables, ...result?.variables }))
    setCurrentPageIndex((currentPageIndex) => {
      if (result?.jumpTo) {
        const nextPageIndex = info.pages.findIndex((page) => page.id === result.jumpTo)
        if (nextPageIndex !== -1) return nextPageIndex
      }
      const nextPageIndex = currentPageIndex + 1
      if (nextPageIndex < info.pages.length) return nextPageIndex
      return currentPageIndex
    })
    setCurrentPageHiddenBlockIds(result?.hiddenBlockIds ?? [])
  }

  return (
    <div className="mx-auto min-h-screen w-full max-w-2xl bg-white dark:bg-neutral-950">
      <div className="py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPageInfo.id}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <Page
              blocks={currentPageBlocks}
              type={currentPageInfo.type}
              errors={currentPageErrors}
              values={currentPageValues}
              setValue={setValue}
              onNext={nextPage}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

export namespace Form {
  export interface Props {
    form: FormInfo
  }
}
