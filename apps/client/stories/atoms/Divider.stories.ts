import type { Meta, StoryObj } from '@storybook/vue3-vite'
import AtomicDivider from '../../app/components/ui/atoms/Divider.vue'

const meta: Meta<typeof AtomicDivider> = {
  title: 'Atoms/Divider',
  component: AtomicDivider,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Garis pemisah struktural untuk membagi area atau konten. Mendukung label teks di tengah (hanya untuk orientasi horizontal).'
      }
    }
  },
  argTypes: {
    label: {
      control: 'text',
      description:
        'Teks opsional yang muncul di tengah garis (menggunakan gaya uppercase tracking luas)',
      table: { type: { summary: 'string' } }
    },
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      description: 'Arah garis pemisah',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'horizontal' }
      }
    },
    variant: {
      control: 'select',
      options: ['solid', 'dashed'],
      description: 'Gaya visual garis',
      table: { type: { summary: 'string' }, defaultValue: { summary: 'solid' } }
    }
  }
}

export default meta
type Story = StoryObj<typeof AtomicDivider>

export const Default: Story = {
  args: {
    orientation: 'horizontal',
    variant: 'solid'
  }
}

export const WithLabel: Story = {
  args: {
    label: 'ATAU',
    orientation: 'horizontal',
    variant: 'solid'
  }
}

export const Dashed: Story = {
  args: {
    label: 'Pilihan Lanjutan',
    orientation: 'horizontal',
    variant: 'dashed'
  }
}

export const Vertical: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Untuk `vertical`, komponen harus berada di dalam kontainer yang memiliki tinggi (height).'
      }
    }
  },
  args: {
    orientation: 'vertical',
    variant: 'solid'
  },
  render: (args) => ({
    components: { AtomicDivider },
    setup() {
      return { args }
    },
    template: `
      <div class="flex items-center h-12 gap-4 text-neutral-600">
        <span>Kiri</span>
        <AtomicDivider v-bind="args" />
        <span>Kanan</span>
      </div>
    `
  })
}
