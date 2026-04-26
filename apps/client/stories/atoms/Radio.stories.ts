import type { Meta, StoryObj } from '@storybook/vue3-vite'
import AtomicRadio from '../../app/components/ui/atoms/Radio.vue'

const meta: Meta<typeof AtomicRadio> = {
  title: 'Atoms/Radio',
  component: AtomicRadio,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Form input untuk memilih tepat satu opsi dari sebuah kelompok pilihan. Komponen ini dirancang untuk bekerja dengan "v-model" yang dibagikan (shared) ke beberapa Radio secara bersamaan.'
      }
    }
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'Teks label pendamping radio',
      table: { type: { summary: 'string' } }
    },
    modelValue: {
      control: 'text',
      description: 'Nilai aktif (v-model) saat ini dari grup radio',
      table: { type: { summary: 'string | number | boolean' } }
    },
    value: {
      control: 'text',
      description: 'Nilai identitas unik untuk opsi ini (wajib ada)',
      table: {
        type: { summary: 'string | number | boolean' },
        defaultValue: { summary: "''" }
      }
    },
    disabled: {
      control: 'boolean',
      description: 'Mematikan interaksi pengguna',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' }
      }
    }
  }
}

export default meta
type Story = StoryObj<typeof AtomicRadio>

export const Default: Story = {
  args: {
    label: 'Opsi Tunggal',
    value: 'opt1',
    modelValue: 'opt1'
  },
  render: (args) => ({
    components: { AtomicRadio },
    setup() {
      return { args }
    },
    template: '<AtomicRadio v-bind="args" />'
  })
}

export const RadioGroup: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Contoh nyata bagaimana Radio digunakan berpasangan dalam satu `v-model`.'
      }
    }
  },
  render: () => ({
    components: { AtomicRadio },
    data() {
      return {
        selected: 'frontend'
      }
    },
    template: `
      <div class="flex flex-col gap-3 p-4 border border-neutral-200 rounded-lg">
        <p class="font-medium text-sm text-neutral-600 mb-2">Pilih Role Anda:</p>
        <AtomicRadio label="Frontend Developer" value="frontend" v-model="selected" />
        <AtomicRadio label="Backend Developer" value="backend" v-model="selected" />
        <AtomicRadio label="UI/UX Designer" value="designer" v-model="selected" />
        <AtomicRadio label="Opsi Dinonaktifkan" value="disabled-opt" disabled v-model="selected" />
        
        <p class="mt-4 text-xs text-neutral-500">Nilai saat ini: <span class="font-bold text-primary-600">{{ selected }}</span></p>
      </div>
    `
  })
}
