import { Input } from '@/components/ui/input'
import { SegmentedControl } from '@/components/ui/segmented-control'
import type { Page } from '@shopfunnel/core/form/types'
import { Field } from './field'
import { Pane } from './pane'

export function PagePane({
  page,
  index,
  onPageUpdate,
}: {
  page: Page
  index: number
  onPageUpdate: (page: Partial<Page>) => void
}) {
  return (
    <Pane.Root>
      <Pane.Header>
        <Pane.Title>Page {index + 1}</Pane.Title>
      </Pane.Header>
      <Pane.Content>
        <Pane.Group>
          <Pane.GroupHeader>
            <Pane.GroupLabel>Button</Pane.GroupLabel>
          </Pane.GroupHeader>
          <Field.Root>
            <Field.Label>Show</Field.Label>
            <Field.Control>
              <SegmentedControl.Root
                value={page.properties.showButton}
                onValueChange={(value: boolean) =>
                  onPageUpdate({ properties: { ...page.properties, showButton: value } })
                }
              >
                <SegmentedControl.Segment value={false}>No</SegmentedControl.Segment>
                <SegmentedControl.Segment value={true}>Yes</SegmentedControl.Segment>
              </SegmentedControl.Root>
            </Field.Control>
          </Field.Root>
          {page.properties.showButton && (
            <>
              <Field.Root>
                <Field.Label>Text</Field.Label>
                <Field.Control>
                  <Input
                    value={page.properties.buttonText}
                    onValueChange={(value) => onPageUpdate({ properties: { ...page.properties, buttonText: value } })}
                  />
                </Field.Control>
              </Field.Root>
              <Field.Root>
                <Field.Label>Action</Field.Label>
                <Field.Control>
                  <SegmentedControl.Root
                    value={page.properties.buttonAction}
                    onValueChange={(value: 'next' | 'redirect') =>
                      onPageUpdate({ properties: { ...page.properties, buttonAction: value } })
                    }
                  >
                    <SegmentedControl.Segment value="next">Next</SegmentedControl.Segment>
                    <SegmentedControl.Segment value="redirect">Redirect</SegmentedControl.Segment>
                  </SegmentedControl.Root>
                </Field.Control>
              </Field.Root>
              {page.properties.buttonAction === 'redirect' && (
                <Field.Root>
                  <Field.Label>URL</Field.Label>
                  <Field.Control>
                    <Input
                      placeholder="https://..."
                      value={page.properties.redirectUrl ?? ''}
                      onValueChange={(value) =>
                        onPageUpdate({
                          properties: { ...page.properties, redirectUrl: value || undefined },
                        })
                      }
                    />
                  </Field.Control>
                </Field.Root>
              )}
            </>
          )}
        </Pane.Group>
      </Pane.Content>
    </Pane.Root>
  )
}
