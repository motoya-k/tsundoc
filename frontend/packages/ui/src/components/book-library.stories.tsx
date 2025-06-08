import type { Meta, StoryObj } from '@storybook/react'
import { BookLibrary } from './book-library'
import { BookCover } from './book-cover'

const meta = {
  title: 'Components/BookLibrary',
  component: BookLibrary,
  parameters: {
    layout: 'fullscreen',
    docs: {
      story: {
        height: '600px',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    columns: {
      control: { type: 'number', min: 1, max: 6 },
    },
    showShelf: {
      control: { type: 'boolean' },
    },
    shelfColor: {
      control: { type: 'select' },
      options: ['wood', 'white', 'dark'],
    },
  },
} satisfies Meta<typeof BookLibrary>

export default meta
type Story = StoryObj<typeof meta>

const sampleBooks = [
  { title: 'React Hooks Guide', tags: ['react', 'hooks'], content: 'Master React Hooks with practical examples and patterns.', color: 'blue' as const },
  { title: 'TypeScript Deep Dive', tags: ['typescript', 'types'], content: 'Advanced TypeScript techniques for scalable applications.', color: 'purple' as const },
  { title: 'CSS Grid Layout', tags: ['css', 'layout'], content: 'Create complex layouts with CSS Grid.', color: 'green' as const },
  { title: 'Node.js Performance', tags: ['nodejs', 'backend'], content: 'Optimize Node.js applications for production.', color: 'orange' as const },
  { title: 'API Design', tags: ['api', 'design'], content: 'Best practices for designing robust APIs.', color: 'red' as const },
  { title: 'Docker for Developers', tags: ['docker', 'devops'], content: 'Containerize your applications with Docker.', color: 'indigo' as const },
  { title: 'Machine Learning Basics', tags: ['ml', 'ai'], content: 'Introduction to machine learning concepts.', color: 'pink' as const },
  { title: 'Database Design', tags: ['database', 'sql'], content: 'Design efficient and scalable databases.', color: 'teal' as const },
]

export const Default: Story = {
  args: {
    children: sampleBooks.slice(0, 4).map((book, index) => (
      <BookCover
        key={index}
        title={book.title}
        tags={book.tags}
        content={book.content}
        color={book.color}
      />
    )),
  },
}

export const TwoColumns: Story = {
  args: {
    columns: 2,
    children: sampleBooks.slice(0, 6).map((book, index) => (
      <BookCover
        key={index}
        title={book.title}
        tags={book.tags}
        content={book.content}
        color={book.color}
      />
    )),
  },
}

export const ThreeColumns: Story = {
  args: {
    columns: 3,
    children: sampleBooks.slice(0, 6).map((book, index) => (
      <BookCover
        key={index}
        title={book.title}
        tags={book.tags}
        content={book.content}
        color={book.color}
      />
    )),
  },
}

export const FiveColumns: Story = {
  args: {
    columns: 5,
    children: sampleBooks.map((book, index) => (
      <BookCover
        key={index}
        title={book.title}
        tags={book.tags}
        content={book.content}
        color={book.color}
        size="sm"
      />
    )),
  },
}

export const WithoutShelf: Story = {
  args: {
    showShelf: false,
    columns: 3,
    children: sampleBooks.slice(0, 6).map((book, index) => (
      <BookCover
        key={index}
        title={book.title}
        tags={book.tags}
        content={book.content}
        color={book.color}
      />
    )),
  },
}

export const WhiteShelf: Story = {
  args: {
    shelfColor: 'white',
    children: sampleBooks.slice(0, 4).map((book, index) => (
      <BookCover
        key={index}
        title={book.title}
        tags={book.tags}
        content={book.content}
        color={book.color}
      />
    )),
  },
}

export const DarkShelf: Story = {
  args: {
    shelfColor: 'dark',
    children: sampleBooks.slice(0, 4).map((book, index) => (
      <BookCover
        key={index}
        title={book.title}
        tags={book.tags}
        content={book.content}
        color={book.color}
      />
    )),
  },
}

export const FewBooks: Story = {
  args: {
    children: sampleBooks.slice(0, 2).map((book, index) => (
      <BookCover
        key={index}
        title={book.title}
        tags={book.tags}
        content={book.content}
        color={book.color}
      />
    )),
  },
}

export const FullLibrary: Story = {
  render: () => {
    const allBooks = [
      ...sampleBooks,
      { title: 'Security Patterns', tags: ['security', 'patterns'], content: 'Secure your applications with proven patterns.', color: 'red' as const },
      { title: 'Testing Guide', tags: ['testing', 'qa'], content: 'Comprehensive testing strategies for modern applications.', color: 'green' as const },
      { title: 'DevOps Handbook', tags: ['devops', 'automation'], content: 'Automate your deployment pipeline.', color: 'orange' as const },
      { title: 'UI/UX Design', tags: ['design', 'ux'], content: 'Create beautiful and usable interfaces.', color: 'pink' as const },
    ]
    
    return (
      <div className="p-8 bg-gray-50 min-h-screen">
        <BookLibrary columns={4}>
          {allBooks.map((book, index) => (
            <BookCover
              key={index}
              title={book.title}
              tags={book.tags}
              content={book.content}
              color={book.color}
            />
          ))}
        </BookLibrary>
      </div>
    )
  },
}