import type { Preview } from '@storybook/vue3-vite'
import '../app/assets/css/main.css'

const preview: Preview = {
  parameters: {
    docs: {
      toc: true
    }
  },
  tags: ['autodocs']
}

export default preview
