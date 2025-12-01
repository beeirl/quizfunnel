import { Form } from '@/form/components/form'
import { createFileRoute } from '@tanstack/react-router'
import type { FormInfo } from '../../../../form/types'

export const Route = createFileRoute('/workspaces/$workspaceID/forms/$formShortID')({
  component: RouteComponent,
})

const exampleForm: FormInfo = {
  id: 'example-quiz',
  shortID: 'exq',
  title: 'Discover Your Learning Style',
  pages: [
    {
      id: 'intro',
      type: 'cover',
      blocks: [
        {
          id: 'intro-heading',
          type: 'heading',
          properties: {
            text: 'Welcome to the Learning Style Quiz!',
          },
        },
        {
          id: 'intro-description',
          type: 'paragraph',
          properties: {
            text: 'Answer a few quick questions to discover how you learn best. This quiz takes about 2 minutes to complete.',
          },
        },
      ],
    },
    {
      id: 'name-page',
      type: 'content',
      blocks: [
        {
          id: 'name',
          type: 'text_input',
          properties: {
            label: "What's your name?",
            description: "We'd love to personalize your results!",
          },
          validations: {
            required: true,
            maxLength: 50,
          },
        },
      ],
    },
    {
      id: 'learning-preference-page',
      type: 'content',
      blocks: [
        {
          id: 'learning-preference',
          type: 'multiple_choice',
          properties: {
            label: 'How do you prefer to learn new concepts? {{block:name}}',
            description: 'Select the option that best describes you',
            multiple: false,
            choices: [
              {
                id: 'reading',
                label: 'Reading books and articles',
                attachment: { type: 'emoji', emoji: '📚' },
              },
              {
                id: 'watching',
                label: 'Watching videos and demonstrations',
                attachment: { type: 'emoji', emoji: '🎬' },
              },
              {
                id: 'hands-on',
                label: 'Hands-on practice and experimentation',
                attachment: { type: 'emoji', emoji: '🔧' },
              },
              {
                id: 'listening',
                label: 'Listening to podcasts and lectures',
                attachment: { type: 'emoji', emoji: '🎧' },
              },
            ],
          },
          validations: {
            required: true,
          },
        },
      ],
    },
    {
      id: 'focus-duration-page',
      type: 'content',
      blocks: [
        {
          id: 'focus-duration-heading',
          type: 'heading',
          properties: {
            text: 'How long can you typically focus on a single task?',
          },
        },
        {
          id: 'focus-duration-description',
          type: 'paragraph',
          properties: {
            text: 'Move the slider to indicate your focus duration in minutes',
          },
        },
        {
          id: 'focus-duration',
          type: 'slider',
          properties: {
            minValue: 10,
            maxValue: 120,
            step: 10,
            defaultValue: 30,
          },
        },
      ],
    },
    {
      id: 'study-environment-page',
      type: 'content',
      blocks: [
        {
          id: 'study-environment-heading',
          type: 'heading',
          properties: {
            text: 'Choose your ideal study environment',
          },
        },
        {
          id: 'study-environment',
          type: 'dropdown',
          properties: {
            label: 'What environment helps you study best?',
            description: 'Choose your ideal study setting',
            options: [
              { id: 'library', label: 'Quiet library or private room' },
              { id: 'coffee-shop', label: 'Coffee shop with background noise' },
              { id: 'outdoors', label: 'Outdoors in nature' },
              { id: 'home', label: 'At home with music playing' },
            ],
          },
          validations: {
            required: true,
          },
        },
      ],
    },
    {
      id: 'contact-page',
      type: 'content',
      blocks: [
        {
          id: 'contact-heading',
          type: 'heading',
          properties: {
            text: 'Contact Information',
          },
        },
        {
          id: 'contact-description',
          type: 'paragraph',
          properties: {
            text: 'Help us stay in touch and send you personalized updates',
          },
        },
        {
          id: 'phone-number',
          type: 'text_input',
          properties: {
            label: 'Phone Number',
            description: 'Optional: We may send you helpful learning tips via SMS',
          },
          validations: {
            maxLength: 20,
          },
        },
        {
          id: 'preferred-contact-method',
          type: 'multiple_choice',
          properties: {
            label: 'How would you like to receive updates?',
            description: 'Select your preferred communication method',
            multiple: false,
            choices: [
              { id: 'email-only', label: 'Email only', attachment: { type: 'emoji', emoji: '📧' } },
              { id: 'sms-only', label: 'SMS only', attachment: { type: 'emoji', emoji: '💬' } },
              { id: 'both', label: 'Both email and SMS', attachment: { type: 'emoji', emoji: '📱' } },
              { id: 'none', label: 'No updates please', attachment: { type: 'emoji', emoji: '🔕' } },
            ],
          },
          validations: {
            required: true,
          },
        },
      ],
    },
    {
      id: 'learning-goals-page',
      type: 'content',
      blocks: [
        {
          id: 'learning-goals',
          type: 'multiple_choice',
          properties: {
            label: 'What are your primary learning goals?',
            description: 'Select all that apply',
            multiple: true,
            choices: [
              { id: 'career', label: 'Career advancement', attachment: { type: 'emoji', emoji: '💼' } },
              { id: 'personal', label: 'Personal growth', attachment: { type: 'emoji', emoji: '🌱' } },
              { id: 'academic', label: 'Academic achievement', attachment: { type: 'emoji', emoji: '🎓' } },
              { id: 'hobby', label: 'Hobby development', attachment: { type: 'emoji', emoji: '🎨' } },
              { id: 'problem-solving', label: 'Problem solving skills', attachment: { type: 'emoji', emoji: '🧩' } },
            ],
          },
          validations: {
            required: true,
            minChoices: 1,
            maxChoices: 3,
          },
        },
      ],
    },
    {
      id: 'email-page',
      type: 'content',
      blocks: [
        {
          id: 'email',
          type: 'text_input',
          properties: {
            label: 'Where should we send your results?',
            description: 'Enter your email address to receive your personalized learning profile',
          },
          validations: {
            required: true,
            email: true,
          },
        },
      ],
    },
    {
      id: 'outro',
      type: 'ending',
      blocks: [
        {
          id: 'outro-heading',
          type: 'heading',
          properties: {
            text: 'Thank you for completing the quiz!',
          },
        },
        {
          id: 'outro-description',
          type: 'paragraph',
          properties: {
            text: "We've analyzed your responses and your personalized learning profile is on its way to your inbox. Check your email for detailed insights and recommendations.",
          },
        },
      ],
    },
  ],
  rules: [
    {
      pageID: 'study-environment-page',
      actions: [
        {
          action: 'hide',
          condition: {
            op: 'eq',
            vars: [
              { type: 'field', value: 'learning-preference' },
              { type: 'constant', value: 'listening' },
            ],
          },
          details: {
            target: {
              type: 'block',
              value: 'study-environment-heading',
            },
          },
        },
      ],
    },
    {
      pageID: 'learning-preference-page',
      actions: [
        {
          action: 'jump',
          condition: {
            op: 'eq',
            vars: [
              { type: 'field', value: 'learning-preference' },
              { type: 'constant', value: 'hands-on' },
            ],
          },
          details: {
            to: {
              type: 'page',
              value: 'learning-goals-page',
            },
          },
        },
        {
          action: 'add',
          condition: {
            op: 'eq',
            vars: [
              { type: 'field', value: 'learning-preference' },
              { type: 'constant', value: 'reading' },
            ],
          },
          details: {
            target: {
              type: 'variable',
              value: 'score',
            },
            value: {
              type: 'constant',
              value: 10,
            },
          },
        },
        {
          action: 'add',
          condition: {
            op: 'eq',
            vars: [
              { type: 'field', value: 'learning-preference' },
              { type: 'constant', value: 'watching' },
            ],
          },
          details: {
            target: {
              type: 'variable',
              value: 'score',
            },
            value: {
              type: 'constant',
              value: 15,
            },
          },
        },
        {
          action: 'add',
          condition: {
            op: 'eq',
            vars: [
              { type: 'field', value: 'learning-preference' },
              { type: 'constant', value: 'hands-on' },
            ],
          },
          details: {
            target: {
              type: 'variable',
              value: 'score',
            },
            value: {
              type: 'constant',
              value: 20,
            },
          },
        },
        {
          action: 'add',
          condition: {
            op: 'eq',
            vars: [
              { type: 'field', value: 'learning-preference' },
              { type: 'constant', value: 'listening' },
            ],
          },
          details: {
            target: {
              type: 'variable',
              value: 'score',
            },
            value: {
              type: 'constant',
              value: 12,
            },
          },
        },
      ],
    },
  ],
  variables: {
    score: 0,
  },
}

function RouteComponent() {
  return <Form form={exampleForm} />
}
