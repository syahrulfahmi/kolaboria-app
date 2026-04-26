import type { Meta, StoryObj } from '@storybook/vue3-vite'
import MoleculeSearchField from '../../app/components/ui/molecules/SearchField.vue'

const meta: Meta<typeof MoleculeSearchField> = {
  title: 'Molecules/SearchField',
  component: MoleculeSearchField,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Input khusus pencarian berbentuk pill (rounded-full). Secara otomatis memiliki bayangan dan efek glow biru saat difokuskan. Dilengkapi dengan icon loop, tombol hapus otomatis, dan status loading.'
      }
    }
  },
  argTypes: {
    modelValue: {
      control: 'text',
      description: 'Kata kunci pencarian (v-model)',
      table: { type: { summary: 'string' } }
    },
    placeholder: {
      control: 'text',
      description: 'Teks panduan',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'Cari...' }
      }
    },
    loading: {
      control: 'boolean',
      description: 'Mengganti ikon kaca pembesar menjadi spinner loading',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' }
      }
    }
  }
}

export default meta
type Story = StoryObj<typeof MoleculeSearchField>

export const Default: Story = {
  args: {
    placeholder: 'Cari proyek, keahlian, atau pengguna...'
  }
}

export const WithValueAndClearable: Story = {
  args: {
    modelValue: 'UI/UX Design',
    placeholder: 'Cari...'
  },
  parameters: {
    docs: {
      description: {
        story:
          'Tombol silang (clear) akan otomatis muncul saat ada teks di dalam form.'
      }
    }
  }
}

export const LoadingState: Story = {
  args: {
    modelValue: 'Mencari desainer...',
    loading: true
  }
}
