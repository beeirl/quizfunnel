import * as React from 'react'

export function Field({ label, description, error, children }: Field.Props) {
  return (
    <div className="w-full">
      <label className="mb-2 block text-lg font-medium text-neutral-900 dark:text-white">{label}</label>
      {description && <p className="mb-6 text-neutral-600 dark:text-neutral-400">{description}</p>}
      {children}
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  )
}

export namespace Field {
  export interface Props {
    label: string
    description?: string
    error?: string
    children: React.ReactNode
  }
}
