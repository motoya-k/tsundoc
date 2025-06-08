import type { Meta, StoryObj } from '@storybook/react'
import { BookCard } from './book-card'

const meta = {
  title: 'Components/BookCard',
  component: BookCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onTagClick: { action: 'tag clicked' },
    onClick: { action: 'card clicked' },
  },
} satisfies Meta<typeof BookCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    title: 'Understanding React Hooks',
    content: 'React Hooks are functions that let you use state and other React features without writing a class. They were introduced in React 16.8 and have since become the standard way to write React components. Hooks allow you to use state and lifecycle features previously only available in class components.',
    tags: ['react', 'javascript', 'frontend'],
    createdAt: new Date().toISOString(),
  },
}

export const LongContent: Story = {
  args: {
    title: 'Deep Dive into GraphQL Performance Optimization',
    content: 'GraphQL is a query language for APIs and a runtime for executing those queries. It provides a complete and understandable description of the data in your API, gives clients the power to ask for exactly what they need. This comprehensive guide covers advanced optimization techniques including query complexity analysis, dataloader patterns, caching strategies, and performance monitoring. We will explore how to implement efficient resolvers, handle N+1 problems, and scale GraphQL APIs for production environments.',
    tags: ['graphql', 'api', 'backend', 'performance', 'optimization'],
    createdAt: '2024-01-15T10:30:00Z',
  },
}

export const NoTags: Story = {
  args: {
    title: 'Simple Note',
    content: 'This is a simple note without any tags.',
    tags: [],
    createdAt: '2024-01-10T15:45:00Z',
  },
}

export const ShortContent: Story = {
  args: {
    title: 'Quick Tip',
    content: 'Use TypeScript for better development experience.',
    tags: ['typescript', 'tips'],
    createdAt: '2024-01-20T09:15:00Z',
  },
}

export const Grid: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl">
      <BookCard
        title="React Best Practices"
        content="Learn the best practices for building React applications including component structure, state management, and performance optimization."
        tags={['react', 'best-practices']}
        createdAt="2024-01-15T10:30:00Z"
      />
      <BookCard
        title="TypeScript Advanced Features"
        content="Explore advanced TypeScript features like conditional types, mapped types, and template literal types to write more robust code."
        tags={['typescript', 'advanced']}
        createdAt="2024-01-12T14:20:00Z"
      />
      <BookCard
        title="CSS Grid Layout"
        content="Master CSS Grid Layout to create complex, responsive web layouts with ease. Learn about grid containers, grid items, and positioning."
        tags={['css', 'layout', 'grid']}
        createdAt="2024-01-08T11:45:00Z"
      />
    </div>
  ),
}