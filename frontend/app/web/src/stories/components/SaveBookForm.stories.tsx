import type { Meta, StoryObj } from '@storybook/react'
import { SaveBookForm } from '../../components/book/save-book-form'

const meta: Meta<typeof SaveBookForm> = {
  title: 'Components/SaveBookForm',
  component: SaveBookForm,
  parameters: {
    layout: 'centered',
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    onSave: async (content: string) => {
      console.log('Saving book content:', content)
      await new Promise(resolve => setTimeout(resolve, 1000))
    },
  },
}

export const Loading: Story = {
  args: {
    onSave: async (content: string) => {
      console.log('Saving book content:', content)
      await new Promise(resolve => setTimeout(resolve, 3000))
    },
  },
}