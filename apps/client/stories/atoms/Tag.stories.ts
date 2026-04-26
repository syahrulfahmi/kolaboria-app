import type { Meta, StoryObj } from '@storybook/vue3-vite'
import AtomicTag from '../../app/components/ui/atoms/Tag.vue'

const meta: Meta<typeof AtomicTag> = {
  title: 'Atoms/Tag',
  component: AtomicTag,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Komponen penanda (badge/tag) kecil untuk menampilkan status, kategori, atau metadata singkat lainnya. Dilengkapi tombol close opsional.'
      }
    }
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'Teks isi tag',
      table: { type: { summary: 'string' } }
    },
    variant: {
      control: 'select',
      options: ['default', 'primary', 'success', 'warning', 'danger'],
      description: 'Kategori warna tag',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'default' }
      }
    },
    closable: {
      control: 'boolean',
      description:
        'Menampilkan ikon silang yang jika diklik akan mengemisi event "close"',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' }
      }
    },
    onClose: {
      action: 'closed',
      description: 'Event yang tertrigger saat tombol silang diklik',
      table: { type: { summary: 'function' } }
    }
  }
}

export default meta
type Story = StoryObj<typeof AtomicTag>

export const Default: Story = {
  args: {
    label: 'Draft',
    variant: 'default',
    closable: false
  }
}

export const AllVariants: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Tag tersedia dalam 5 warna utama sesuai dengan peruntukkannya (netral, info, sukses, peringatan, dan bahaya).'
      }
    }
  },
  render: () => ({
    components: { AtomicTag },
    template: `
      <div class="flex gap-2">
        <AtomicTag variant="default">Draft</AtomicTag>
        <AtomicTag variant="primary">New Feature</AtomicTag>
        <AtomicTag variant="success">Completed</AtomicTag>
        <AtomicTag variant="warning">Pending</AtomicTag>
        <AtomicTag variant="danger">Rejected</AtomicTag>
      </div>
    `
  })
}

export const Closable: Story = {
  args: {
    label: 'Vue.js',
    variant: 'primary',
    closable: true
  },
  render: (args) => ({
    components: { AtomicTag },
    setup() {
      return { args }
    },
    template: '<AtomicTag v-bind="args" @close="args.onClose" />'
  })
}
