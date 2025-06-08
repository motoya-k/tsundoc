import type { Meta, StoryObj } from '@storybook/react'
import { Bookshelf } from './bookshelf'
import { BookSpine } from './book-spine'

const meta = {
  title: 'Components/Bookshelf',
  component: Bookshelf,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    rows: {
      control: { type: 'number', min: 1, max: 5 },
    },
    shelfColor: {
      control: { type: 'select' },
      options: ['wood', 'white', 'dark'],
    },
  },
} satisfies Meta<typeof Bookshelf>

export default meta
type Story = StoryObj<typeof meta>

const sampleBooks = [
  { title: 'React Hooks Guide', tags: ['react', 'hooks'], height: 'md' as const, color: 'blue' as const },
  { title: 'TypeScript Deep Dive', tags: ['typescript', 'types'], height: 'lg' as const, color: 'purple' as const },
  { title: 'CSS Grid Layout', tags: ['css', 'layout'], height: 'sm' as const, color: 'green' as const },
  { title: 'Node.js Performance', tags: ['nodejs', 'backend'], height: 'xl' as const, color: 'orange' as const },
  { title: 'Quick Tips', tags: ['tips'], height: 'sm' as const, color: 'teal' as const },
  { title: 'GraphQL Best Practices', tags: ['graphql', 'api'], height: 'md' as const, color: 'red' as const },
  { title: 'Docker for Developers', tags: ['docker', 'devops'], height: 'lg' as const, color: 'indigo' as const },
  { title: 'API Design', tags: ['api', 'design'], height: 'md' as const, color: 'pink' as const },
]

export const Default: Story = {
  args: {
    children: sampleBooks.slice(0, 5).map((book, index) => (
      <BookSpine
        key={index}
        title={book.title}
        tags={book.tags}
        height={book.height}
        color={book.color}
      />
    )),
  },
}

export const SingleRow: Story = {
  args: {
    rows: 1,
    children: sampleBooks.map((book, index) => (
      <BookSpine
        key={index}
        title={book.title}
        tags={book.tags}
        height={book.height}
        color={book.color}
      />
    )),
  },
}

export const TwoRows: Story = {
  args: {
    rows: 2,
    children: sampleBooks.map((book, index) => (
      <BookSpine
        key={index}
        title={book.title}
        tags={book.tags}
        height={book.height}
        color={book.color}
      />
    )),
  },
}

export const ThreeRows: Story = {
  args: {
    rows: 3,
    children: sampleBooks.map((book, index) => (
      <BookSpine
        key={index}
        title={book.title}
        tags={book.tags}
        height={book.height}
        color={book.color}
      />
    )),
  },
}

export const WhiteShelf: Story = {
  args: {
    shelfColor: 'white',
    children: sampleBooks.slice(0, 6).map((book, index) => (
      <BookSpine
        key={index}
        title={book.title}
        tags={book.tags}
        height={book.height}
        color={book.color}
      />
    )),
  },
}

export const DarkShelf: Story = {
  args: {
    shelfColor: 'dark',
    children: sampleBooks.slice(0, 6).map((book, index) => (
      <BookSpine
        key={index}
        title={book.title}
        tags={book.tags}
        height={book.height}
        color={book.color}
      />
    )),
  },
}

export const EmptyShelf: Story = {
  args: {
    children: [],
  },
}

export const FewBooks: Story = {
  args: {
    children: sampleBooks.slice(0, 3).map((book, index) => (
      <BookSpine
        key={index}
        title={book.title}
        tags={book.tags}
        height={book.height}
        color={book.color}
      />
    )),
  },
}

export const FullLibrary: Story = {
  render: () => {
    const allBooks = [
      ...sampleBooks,
      { title: 'Machine Learning Basics', tags: ['ml', 'ai'], height: 'lg' as const, color: 'purple' as const },
      { title: 'Database Design', tags: ['database', 'sql'], height: 'md' as const, color: 'blue' as const },
      { title: 'Security Patterns', tags: ['security', 'patterns'], height: 'xl' as const, color: 'red' as const },
      { title: 'Testing Guide', tags: ['testing', 'qa'], height: 'sm' as const, color: 'green' as const },
      { title: 'DevOps Handbook', tags: ['devops', 'automation'], height: 'lg' as const, color: 'orange' as const },
      { title: 'UI/UX Design', tags: ['design', 'ux'], height: 'md' as const, color: 'pink' as const },
      { title: 'Algorithms', tags: ['algorithms', 'cs'], height: 'xl' as const, color: 'indigo' as const },
      { title: 'Clean Code', tags: ['code', 'best-practices'], height: 'lg' as const, color: 'teal' as const },
    ]
    
    return (
      <div className="w-full max-w-4xl">
        <Bookshelf rows={3}>
          {allBooks.map((book, index) => (
            <BookSpine
              key={index}
              title={book.title}
              tags={book.tags}
              height={book.height}
              color={book.color}
            />
          ))}
        </Bookshelf>
      </div>
    )
  },
}