import type { Meta, StoryObj } from '@storybook/react'
import SavePage from '../../app/save/page'

const meta: Meta<typeof SavePage> = {
  title: 'Pages/SavePage',
  component: SavePage,
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
      navigation: {
        push: () => Promise.resolve(),
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}