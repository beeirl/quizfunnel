import type { Theme } from '@shopfunnel/core/form/types'
import * as React from 'react'

interface FormThemeProps {
  theme: Theme
  children: React.ReactNode
}

export function FormTheme({ theme, children }: FormThemeProps) {
  return (
    <React.Fragment>
      <style>{`
        :root {
          --sf-color-primary: ${theme.colors.primary};
          --sf-color-primary-foreground: ${theme.colors.primaryForeground};
          --sf-color-background: ${theme.colors.background};
          --sf-color-foreground: ${theme.colors.foreground};
          --sf-radius: ${theme.radius.value};
        }
      `}</style>
      {children}
    </React.Fragment>
  )
}
