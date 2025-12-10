import type { FunnelSchema } from '@shopfunnel/core/form/schema'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { ComponentsSidebar } from './-components/components-sidebar'
import { PagePreview } from './-components/page-preview'
import { PagesSidebar } from './-components/pages-sidebar'
import { PropertiesSidebar } from './-components/properties-sidebar'

export const Route = createFileRoute('/workspaces/$workspaceID/funnels/$funnelId')({
  component: RouteComponent,
})

const exampleSchema: FunnelSchema = {
  pages: [
    {
      id: 'basic-info',
      components: [
        {
          id: 'name-input',
          type: 'short_text',
          properties: {
            label: 'What is your name?',
            description: 'Enter your full name',
          },
          validations: {
            required: true,
          },
        },
        {
          id: 'email-input',
          type: 'short_text',
          properties: {
            label: 'Email Address',
            description: "We'll use this to follow up if needed",
          },
          validations: {
            required: true,
            email: true,
          },
        },
      ],
    },
    {
      id: 'experience',
      components: [
        {
          id: 'satisfaction-choice',
          type: 'multiple_choice',
          properties: {
            label: 'How satisfied are you with our service?',
            description: 'Select one option',
            multiple: false,
            choices: [
              { id: 'very-satisfied', label: 'Very Satisfied' },
              { id: 'satisfied', label: 'Satisfied' },
              { id: 'neutral', label: 'Neutral' },
              { id: 'dissatisfied', label: 'Dissatisfied' },
              { id: 'very-dissatisfied', label: 'Very Dissatisfied' },
            ],
          },
          validations: {
            required: true,
          },
        },
        {
          id: 'feedback-text',
          type: 'short_text',
          properties: {
            label: 'What can we improve?',
            description: 'Share any suggestions or feedback',
          },
          validations: {},
        },
        {
          id: 'recommend-choice',
          type: 'multiple_choice',
          properties: {
            label: 'Would you recommend us to a friend?',
            multiple: false,
            choices: [
              { id: 'yes', label: 'Yes, definitely!' },
              { id: 'maybe', label: 'Maybe' },
              { id: 'no', label: 'No' },
            ],
          },
          validations: {
            required: true,
          },
        },
      ],
    },
  ],
  rules: [],
  variables: {},
}

function RouteComponent() {
  const [schema, setSchema] = useState<FunnelSchema>(exampleSchema)
  const [selectedPageId, setSelectedPageId] = useState<string | null>(schema.pages[0]?.id ?? null)
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(
    schema.pages[0]?.components[0]?.id ?? null,
  )

  // Derived state
  const selectedPage = schema.pages.find((page) => page.id === selectedPageId)
  const selectedComponent = selectedPage?.components.find((c) => c.id === selectedComponentId)

  // Handlers
  const handleSelectPage = (pageId: string) => {
    setSelectedPageId(pageId)
    const page = schema.pages.find((p) => p.id === pageId)
    setSelectedComponentId(page?.components[0]?.id ?? null)
  }

  const handleReorderPages = (pages: FunnelSchema.Page[]) => {
    setSchema((prev) => ({ ...prev, pages }))
  }

  const handleReorderComponents = (components: FunnelSchema.Page.Component[]) => {
    if (!selectedPageId) return
    setSchema((prev) => ({
      ...prev,
      pages: prev.pages.map((page) => (page.id === selectedPageId ? { ...page, components } : page)),
    }))
  }

  const handleUpdateComponent = (componentId: string, updates: Partial<FunnelSchema.Page.Component>) => {
    setSchema((prev) => ({
      ...prev,
      pages: prev.pages.map((page) => ({
        ...page,
        components: page.components.map((c) =>
          c.id === componentId ? ({ ...c, ...updates } as FunnelSchema.Page.Component) : c,
        ),
      })),
    }))
  }

  const handleAddComponent = (afterComponentId: string | null, component: FunnelSchema.Page.Component) => {
    if (!selectedPageId) return

    setSchema((prev) => ({
      ...prev,
      pages: prev.pages.map((page) => {
        if (page.id !== selectedPageId) return page

        const components = [...page.components]
        if (afterComponentId) {
          const afterIndex = components.findIndex((c) => c.id === afterComponentId)
          if (afterIndex !== -1) {
            components.splice(afterIndex + 1, 0, component)
          } else {
            components.push(component)
          }
        } else {
          components.push(component)
        }

        return { ...page, components }
      }),
    }))

    // Select the newly added component
    setSelectedComponentId(component.id)
  }

  return (
    <div className="flex h-screen w-full">
      <PagesSidebar
        pages={schema.pages}
        selectedPageId={selectedPageId}
        onSelectPage={handleSelectPage}
        onReorderPages={handleReorderPages}
      />
      <ComponentsSidebar
        components={selectedPage?.components ?? []}
        selectedComponentId={selectedComponentId}
        onSelectComponent={setSelectedComponentId}
        onReorderComponents={handleReorderComponents}
        onAddComponent={handleAddComponent}
      />
      <PagePreview
        components={selectedPage?.components ?? []}
        selectedComponentId={selectedComponentId}
        onSelectComponent={setSelectedComponentId}
      />
      {selectedComponent && (
        <PropertiesSidebar component={selectedComponent} onUpdateComponent={handleUpdateComponent} />
      )}
    </div>
  )
}
