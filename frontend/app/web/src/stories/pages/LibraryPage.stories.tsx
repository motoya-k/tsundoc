import type { Meta, StoryObj } from '@storybook/react'
import LibraryPage from '../../app/library/page'

const meta: Meta<typeof LibraryPage> = {
  title: 'Pages/LibraryPage',
  component: LibraryPage,
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithSearch: Story = {
  play: async ({ canvasElement }) => {
    // You can add interaction tests here if needed
  },
}