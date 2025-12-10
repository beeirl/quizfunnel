import { Input as BaseUIInput } from '@base-ui-components/react/input'
import { cn } from '@beeirl/ui/styles'

export interface InputProps {
  mode?: 'preview' | 'live'
  placeholder?: string
  value?: string
  type?: 'text' | 'email'
}

export function Input({ mode = 'live', placeholder, type = 'text', value }: InputProps) {
  return (
    <BaseUIInput
      className={cn(
        'w-full rounded-lg border-2 border-gray-200 bg-white px-4 py-2.5 text-base transition-colors placeholder:text-gray-400',
        'focus:border-blue-500 focus:outline-none',
        'data-invalid:border-red-500',
        mode === 'preview' && 'pointer-events-none',
      )}
      disabled={mode === 'preview'}
      placeholder={placeholder}
      type={type}
      value={value}
    />
  )
}
