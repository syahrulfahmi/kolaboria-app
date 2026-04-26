import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import MoleculeDatePicker from '../../app/components/ui/molecules/DatePicker.vue'

const meta: Meta<typeof MoleculeDatePicker> = {
  title: 'Molecules/DatePicker',
  component: MoleculeDatePicker,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Input tanggal kustom tanpa library eksternal. Menampilkan kalender premium dengan navigasi bulan, highlight hari ini, dan dua mode: single date dan date range. Sepenuhnya sesuai design system Kolaboria.'
      }
    }
  },
  argTypes: {
    mode: {
      control: 'radio',
      options: ['single', 'range'],
      description:
        'Mode pemilihan: `single` (satu tanggal) atau `range` (rentang tanggal)',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'single' }
      }
    },
    label: {
      control: 'text',
      description: 'Label premium di atas input',
      table: { type: { summary: 'string' } }
    },
    placeholder: {
      control: 'text',
      description: 'Teks saat belum ada pilihan',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'Pilih tanggal' }
      }
    },
    required: {
      control: 'boolean',
      description: 'Tambahkan asterisk primer pada label',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' }
      }
    },
    disabled: {
      control: 'boolean',
      description: 'Nonaktifkan input',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' }
      }
    },
    error: {
      control: 'text',
      description: 'Pesan error merah di bawah input',
      table: { type: { summary: 'string' } }
    }
  }
}

export default meta
type Story = StoryObj<typeof MoleculeDatePicker>

export const SingleDate: Story = {
  args: {
    label: 'Tanggal Lahir',
    placeholder: 'Pilih tanggal',
    mode: 'single',
    required: true
  },
  render: (args) => ({
    components: { MoleculeDatePicker },
    setup() {
      const date = ref(null)
      return { args, date }
    },
    template: `<div class="max-w-xs"><MoleculeDatePicker v-bind="args" v-model="date" /></div>`
  })
}

export const DateRange: Story = {
  args: {
    label: 'Periode Proyek',
    placeholder: 'Pilih rentang tanggal',
    mode: 'range',
    required: true
  },
  parameters: {
    docs: {
      description: {
        story:
          'Mode `range` — klik pertama untuk tanggal mulai, klik kedua untuk tanggal selesai. Area di antara dua tanggal akan ter-highlight secara otomatis.'
      }
    }
  },
  render: (args) => ({
    components: { MoleculeDatePicker },
    setup() {
      const range = ref({ start: null, end: null })
      return { args, range }
    },
    template: `<div class="max-w-xs"><MoleculeDatePicker v-bind="args" v-model="range" /></div>`
  })
}

export const WithError: Story = {
  args: {
    label: 'Tanggal Mulai',
    mode: 'single',
    error: 'Tanggal wajib diisi'
  },
  render: (args) => ({
    components: { MoleculeDatePicker },
    setup() {
      const date = ref(null)
      return { args, date }
    },
    template: `<div class="max-w-xs"><MoleculeDatePicker v-bind="args" v-model="date" /></div>`
  })
}

export const Disabled: Story = {
  args: {
    label: 'Tanggal (Non-aktif)',
    mode: 'single',
    disabled: true
  },
  render: (args) => ({
    components: { MoleculeDatePicker },
    setup() {
      const date = ref(new Date())
      return { args, date }
    },
    template: `<div class="max-w-xs"><MoleculeDatePicker v-bind="args" v-model="date" /></div>`
  })
}
