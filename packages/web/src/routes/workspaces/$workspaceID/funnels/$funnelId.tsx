import type { Funnel } from '@shopfunnel/core/funnel/index'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { BlocksPanel } from './-components/blocks-panel'
import { PagesSidebar } from './-components/pages-panel'
import { PagePreview } from './-components/preview-panel'
import { SettingsPanel } from './-components/settings-panel'

export const Route = createFileRoute('/workspaces/$workspaceID/funnels/$funnelId')({
  component: RouteComponent,
})

const defaultFunnel: Funnel.Info = {
  id: 'funnel',
  shortID: 'fun',
  title: 'Funnel',
  pages: [
    {
      id: 'basic-info',
      blocks: [
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
      blocks: [
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
  const [funnel, setFunnel] = useState<Funnel.Info>(defaultFunnel)
  const [selectedPageId, setSelectedPageId] = useState<string | null>(defaultFunnel.pages[0]?.id ?? null)
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(defaultFunnel.pages[0]?.blocks[0]?.id ?? null)

  const selectedPage = funnel.pages.find((page) => page.id === selectedPageId)
  const selectedBlock = selectedPage?.blocks.find((b) => b.id === selectedBlockId)

  const handleSelectPage = (pageId: string) => {
    setSelectedPageId(pageId)
    const page = funnel.pages.find((p) => p.id === pageId)
    setSelectedBlockId(page?.blocks[0]?.id ?? null)
  }

  const handleReorderPages = (pages: Funnel.Page[]) => {
    setFunnel((prev) => ({ ...prev, pages }))
  }

  const handleReorderBlocks = (blocks: Funnel.Page.Block[]) => {
    if (!selectedPageId) return
    setFunnel((prev) => ({
      ...prev,
      pages: prev.pages.map((page) => (page.id === selectedPageId ? { ...page, blocks } : page)),
    }))
  }

  const handleUpdateBlock = (blockId: string, updates: Partial<Funnel.Page.Block>) => {
    setFunnel((prev) => ({
      ...prev,
      pages: prev.pages.map((page) => ({
        ...page,
        blocks: page.blocks.map((b) => (b.id === blockId ? ({ ...b, ...updates } as Funnel.Page.Block) : b)),
      })),
    }))
  }

  const handleAddBlock = (afterBlockId: string | null, block: Funnel.Page.Block) => {
    if (!selectedPageId) return

    setFunnel((prev) => ({
      ...prev,
      pages: prev.pages.map((page) => {
        if (page.id !== selectedPageId) return page

        const blocks = [...page.blocks]
        if (afterBlockId) {
          const afterIndex = blocks.findIndex((b) => b.id === afterBlockId)
          if (afterIndex !== -1) {
            blocks.splice(afterIndex + 1, 0, block)
          } else {
            blocks.push(block)
          }
        } else {
          blocks.push(block)
        }

        return { ...page, blocks }
      }),
    }))

    // Select the newly added block
    setSelectedBlockId(block.id)
  }

  return (
    <div className="flex h-screen w-full">
      <PagesSidebar
        pages={funnel.pages}
        selectedPageId={selectedPageId}
        onSelectPage={handleSelectPage}
        onReorderPages={handleReorderPages}
      />
      <BlocksPanel
        blocks={selectedPage?.blocks ?? []}
        selectedBlockId={selectedBlockId}
        onSelectBlock={setSelectedBlockId}
        onReorderBlocks={handleReorderBlocks}
        onAddBlock={handleAddBlock}
      />
      <PagePreview
        blocks={selectedPage?.blocks ?? []}
        selectedBlockId={selectedBlockId}
        onSelectBlock={setSelectedBlockId}
      />
      {selectedBlock && <SettingsPanel block={selectedBlock} onUpdateBlock={handleUpdateBlock} />}
    </div>
  )
}
