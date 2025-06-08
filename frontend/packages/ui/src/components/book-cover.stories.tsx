import type { Meta, StoryObj } from '@storybook/react'
import { BookCover } from './book-cover'

const meta = {
  title: 'Components/BookCover',
  component: BookCover,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
    color: {
      control: { type: 'select' },
      options: ['blue', 'red', 'green', 'purple', 'orange', 'teal', 'pink', 'indigo', 'brown', 'gray'],
    },
    onTagClick: { action: 'tag clicked' },
    onClick: { action: 'book clicked' },
  },
} satisfies Meta<typeof BookCover>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    title: 'Understanding React Hooks',
    tags: ['react', 'javascript', 'frontend'],
    content: 'React Hooks are functions that let you use state and other React features without writing a class. They were introduced in React 16.8 and have since become the standard way to write React components.',
  },
}

export const SmallBook: Story = {
  args: {
    title: 'Quick Tips',
    tags: ['tips'],
    content: 'A collection of quick tips and tricks for developers.',
    size: 'sm',
  },
}

export const LargeBook: Story = {
  args: {
    title: 'Comprehensive Guide to TypeScript',
    tags: ['typescript', 'javascript', 'types', 'programming'],
    content: 'TypeScript adds static types to JavaScript. This comprehensive guide covers advanced TypeScript patterns, generics, conditional types, and best practices for large-scale applications.',
    size: 'lg',
  },
}

export const RedBook: Story = {
  args: {
    title: 'Error Handling Patterns',
    tags: ['errors', 'debugging', 'patterns'],
    content: 'Learn how to handle errors gracefully in your applications with proven patterns and best practices.',
    color: 'red',
  },
}

export const GreenBook: Story = {
  args: {
    title: 'Sustainable Development',
    tags: ['sustainability', 'environment', 'green-tech'],
    content: 'Building environmentally conscious software and sustainable development practices.',
    color: 'green',
  },
}

export const PurpleBook: Story = {
  args: {
    title: 'Machine Learning Magic',
    tags: ['ml', 'ai', 'algorithms'],
    content: 'Dive into the world of machine learning with practical examples and cutting-edge techniques.',
    color: 'purple',
  },
}

export const BrownBook: Story = {
  args: {
    title: 'Classic Programming Principles',
    tags: ['programming', 'principles', 'classic'],
    content: 'Timeless programming principles that every developer should know, from design patterns to clean code.',
    color: 'brown',
  },
}

export const NoContent: Story = {
  args: {
    title: 'Simple Reference',
    tags: ['reference', 'quick'],
  },
}

export const NoTags: Story = {
  args: {
    title: 'Untitled Book',
    content: 'A book without any tags, showing the clean design when no categorization is present.',
    tags: [],
  },
}

export const ManyTags: Story = {
  args: {
    title: 'Full Stack Development',
    tags: ['frontend', 'backend', 'database', 'devops', 'testing', 'security'],
    content: 'Complete guide to full stack development covering all aspects from frontend to deployment.',
  },
}

export const LongTitle: Story = {
  args: {
    title: 'This is a Very Long Book Title That Should Wrap Properly and Still Look Good on the Cover',
    tags: ['long-title', 'layout', 'design'],
    content: 'A book with an exceptionally long title to test the layout and typography handling.',
  },
}

export const BookCollection: Story = {
  render: () => (
    <div className="flex gap-4 flex-wrap justify-center">
      <BookCover
        title="React Fundamentals"
        tags={['react', 'frontend']}
        content="Learn the core concepts of React including components, state, and props."
        size="sm"
        color="blue"
      />
      <BookCover
        title="TypeScript Guide"
        tags={['typescript', 'types']}
        content="Master TypeScript with practical examples and advanced patterns."
        size="md"
        color="purple"
      />
      <BookCover
        title="CSS Design Systems"
        tags={['css', 'design']}
        content="Create scalable and maintainable CSS architectures for modern web applications."
        size="md"
        color="green"
      />
      <BookCover
        title="Node.js Performance"
        tags={['nodejs', 'backend', 'performance']}
        content="Optimize your Node.js applications for maximum performance and scalability."
        size="lg"
        color="orange"
      />
    </div>
  ),
}