import type { Meta, StoryObj } from '@storybook/react'
import { BookCard } from '../../components/book/book-card'

const meta: Meta<typeof BookCard> = {
  title: 'Components/BookCard',
  component: BookCard,
  parameters: {
    layout: 'centered',
  },
}

export default meta
type Story = StoryObj<typeof meta>

const mockBook = {
  id: '1',
  title: 'The Great Gatsby',
  author: 'F. Scott Fitzgerald',
  content: 'In my younger and more vulnerable years my father gave me some advice that I\'ve been turning over in my mind ever since.',
  savedAt: new Date('2024-01-15'),
}

export const Default: Story = {
  args: {
    book: mockBook,
  },
}

export const LongTitle: Story = {
  args: {
    book: {
      ...mockBook,
      title: 'A Very Long Book Title That Should Be Truncated In The Card Display',
    },
  },
}

export const NoAuthor: Story = {
  args: {
    book: {
      ...mockBook,
      author: undefined,
    },
  },
}