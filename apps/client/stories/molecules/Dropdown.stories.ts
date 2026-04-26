import type { Meta, StoryObj } from '@storybook/vue3-vite'
import MoleculeDropdown from '../../app/components/ui/molecules/Dropdown.vue'

const meta: Meta<typeof MoleculeDropdown> = {
  title: 'Molecules/Dropdown',
  component: MoleculeDropdown,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Custom Select Dropdown tanpa plugin pihak ketiga. Memiliki animasi buka-tutup yang halus, highlight aksen saat hover, dan dukungan pesan error.'
      }
    }
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'Label di atas dropdown',
      table: { type: { summary: 'string' } }
    },
    modelValue: {
      control: 'text',
      description: 'Nilai dari opsi yang terpilih (v-model)',
      table: { type: { summary: 'string | number | null' } }
    },
    options: {
      control: 'object',
      description: 'Daftar opsi berupa Array of Object `{ label, value }`',
      table: { type: { summary: 'Array<{label: string, value: any}>' } }
    },
    placeholder: {
      control: 'text',
      description: 'Teks bawaan saat tidak ada yang terpilih',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'Pilih opsi...' }
      }
    },
    error: {
      control: 'text',
      description: 'Menampilkan pesan error merah di bawah dropdown',
      table: { type: { summary: 'string' } }
    },
    disabled: {
      control: 'boolean',
      description: 'Mematikan dropdown',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' }
      }
    },
    required: {
      control: 'boolean',
      description: 'Menambahkan asterisk primer pada label',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' }
      }
    }
  }
}

export default meta
type Story = StoryObj<typeof MoleculeDropdown>

const sampleOptions = [
  { label: 'Frontend Developer', value: 'frontend' },
  { label: 'Backend Developer', value: 'backend' },
  { label: 'UI/UX Designer', value: 'designer' },
  { label: 'Project Manager', value: 'pm' }
]

export const Default: Story = {
  args: {
    label: 'Pilih Role Anda',
    placeholder: 'Pilih spesialisasi...',
    options: sampleOptions,
    required: true
  }
}

export const WithSelectedValue: Story = {
  args: {
    label: 'Role',
    options: sampleOptions,
    modelValue: 'designer'
  }
}

export const ErrorState: Story = {
  args: {
    label: 'Role',
    options: sampleOptions,
    error: 'Role tidak boleh kosong'
  }
}

export const Disabled: Story = {
  args: {
    label: 'Role',
    options: sampleOptions,
    disabled: true
  }
}
