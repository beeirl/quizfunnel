import { PaneContent, PaneHeader, PaneRoot, PaneTitle } from './pane'

export function ThemePanel() {
  return (
    <div className="flex w-[250px] flex-col border-r border-border bg-background">
      <PaneRoot className="flex h-full flex-col">
        <PaneHeader>
          <PaneTitle>Theme</PaneTitle>
        </PaneHeader>
        <PaneContent className="flex flex-1 items-center justify-center">
          <span className="text-sm text-muted-foreground">Coming soon</span>
        </PaneContent>
      </PaneRoot>
    </div>
  )
}
