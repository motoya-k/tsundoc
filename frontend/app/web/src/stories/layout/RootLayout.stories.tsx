import type { Meta, StoryObj } from '@storybook/react'
import RootLayout from '../../app/layout'

const meta: Meta<typeof RootLayout> = {
  title: 'Layout/RootLayout',
  component: RootLayout,
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: (
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-4">Page Content</h1>
        <p>This is the main page content wrapped by the root layout.</p>
      </div>
    ),
  },
}