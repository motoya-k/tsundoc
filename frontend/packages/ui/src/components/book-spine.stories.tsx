import type { Meta, StoryObj } from '@storybook/react'
import { BookSpine } from './book-spine'

const meta = {
  title: 'Components/BookSpine',
  component: BookSpine,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    height: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg', 'xl'],
    },
    color: {
      control: { type: 'select' },
      options: ['blue', 'red', 'green', 'purple', 'orange', 'teal', 'pink', 'indigo'],
    },
    onTagClick: { action: 'tag clicked' },
    onClick: { action: 'spine clicked' },
  },
} satisfies Meta<typeof BookSpine>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    title: 'Understanding React Hooks',
    tags: ['react', 'javascript', 'frontend'],
  },
}

export const SmallSpine: Story = {
  args: {
    title: 'Quick Tips',
    tags: ['tips'],
    height: 'sm',
  },
}

export const LargeSpine: Story = {
  args: {
    title: 'Comprehensive Guide to TypeScript',
    tags: ['typescript', 'javascript', 'types', 'programming'],
    height: 'lg',
  },
}

export const ExtraLargeSpine: Story = {
  args: {
    title: 'The Complete Developer Handbook',
    tags: ['development', 'programming', 'best-practices', 'career', 'skills'],
    height: 'xl',
  },
}

export const RedBook: Story = {
  args: {
    title: 'Error Handling Patterns',
    tags: ['errors', 'debugging', 'patterns'],
    color: 'red',
  },
}

export const GreenBook: Story = {
  args: {
    title: 'Sustainable Development',
    tags: ['sustainability', 'environment', 'green-tech'],
    color: 'green',
  },
}

export const PurpleBook: Story = {
  args: {
    title: 'Machine Learning Magic',
    tags: ['ml', 'ai', 'algorithms'],
    color: 'purple',
  },
}

export const NoTags: Story = {
  args: {
    title: 'Simple Note',
    tags: [],
  },
}

export const LongTitle: Story = {
  args: {
    title: 'This is a Very Long Book Title That Should Be Truncated Properly in the Spine View',
    tags: ['long-title', 'truncation', 'test'],
  },
}

export const BookshelfExample: Story = {
  render: () => (
    <div className="flex items-end gap-1">
      <BookSpine
        title="React Fundamentals"
        tags={['react', 'frontend']}
        height="md"
        color="blue"
      />
      <BookSpine
        title="TypeScript Guide"
        tags={['typescript', 'types']}
        height="lg"
        color="purple"
      />
      <BookSpine
        title="CSS Tricks"
        tags={['css', 'styling']}
        height="sm"
        color="green"
      />
      <BookSpine
        title="Node.js Performance"
        tags={['nodejs', 'backend', 'performance']}
        height="xl"
        color="orange"
      />
      <BookSpine
        title="Quick Notes"
        tags={['notes']}
        height="sm"
        color="teal"
      />
    </div>
  ),
}