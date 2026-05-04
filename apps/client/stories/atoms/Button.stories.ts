import type { Meta, StoryObj } from '@storybook/vue3-vite'
import AtomicButton from '../../app/components/ui/atoms/Button.vue'

const meta: Meta<typeof AtomicButton> = {
  title: 'Atoms/Button',
  component: AtomicButton,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Komponen interaktif dasar untuk aksi utama, navigasi, dan pengiriman form. Mendukung berbagai varian, ukuran, status (loading/disabled), dan dapat bertindak sebagai `button`, `a`, atau `NuxtLink` secara otomatis berdasarkan props yang diberikan.'
      }
    }
  },
  argTypes: {
    label: {
      control: 'text',
      description:
        'Teks utama di dalam tombol. Bisa juga dipassing melalui default slot.',
      table: { type: { summary: 'string' } }
    },
    variant: {
      control: 'select',
      options: [
        'primary',
        'secondary',
        'outline',
        'outline-danger',
        'danger',
        'ghost-primary',
        'ghost-secondary',
        'ghost-danger'
      ],
      description: 'Gaya visual tombol sesuai hirarki design system',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'primary' }
      }
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Ukuran tombol',
      table: { type: { summary: 'string' }, defaultValue: { summary: 'md' } }
    },
    block: {
      control: 'boolean',
      description: 'Jika true, tombol akan mengambil lebar 100% dari kontainer',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' }
      }
    },
    disabled: {
      control: 'boolean',
      description: 'Menonaktifkan tombol (tidak bisa diklik dan berganti gaya)',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' }
      }
    },
    loading: {
      control: 'boolean',
      description:
        'Menampilkan spinner loading dan menonaktifkan klik sementara',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' }
      }
    },
    to: {
      control: 'text',
      description: 'Route tujuan jika ingin menggunakan NuxtLink',
      table: { type: { summary: 'string | object' } }
    },
    href: {
      control: 'text',
      description: 'URL tujuan jika ingin menggunakan anchor tag (<a>)',
      table: { type: { summary: 'string' } }
    },
    type: {
      control: 'text',
      description:
        'Atribut type bawaan HTML untuk button (submit, button, reset)',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'button' }
      }
    }
  }
}

export default meta
type Story = StoryObj<typeof AtomicButton>

export const Primary: Story = {
  args: {
    label: 'Primary Button',
    variant: 'primary',
    size: 'md'
  }
}

export const Secondary: Story = {
  args: {
    ...Primary.args,
    label: 'Secondary Button',
    variant: 'secondary'
  }
}

export const Outline: Story = {
  args: {
    ...Primary.args,
    label: 'Outline Button',
    variant: 'outline'
  }
}

export const OutlineDanger: Story = {
  args: {
    ...Primary.args,
    label: 'Outline Danger Button',
    variant: 'outline-danger'
  }
}

export const Danger: Story = {
  args: {
    ...Primary.args,
    label: 'Danger Button',
    variant: 'danger'
  }
}

export const GhostVariants: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Varian Ghost berguna untuk aksi sekunder yang tidak membutuhkan penekanan visual yang kuat (tanpa background border default).'
      }
    }
  },
  render: () => ({
    components: { AtomicButton },
    template: `
      <div class="flex gap-4">
        <AtomicButton variant="ghost-primary">Ghost Primary</AtomicButton>
        <AtomicButton variant="ghost-secondary">Ghost Secondary</AtomicButton>
        <AtomicButton variant="ghost-danger">Ghost Danger</AtomicButton>
      </div>
    `
  })
}

export const Sizes: Story = {
  render: () => ({
    components: { AtomicButton },
    template: `
      <div class="flex items-center gap-4">
        <AtomicButton size="sm">Small (sm)</AtomicButton>
        <AtomicButton size="md">Medium (md)</AtomicButton>
        <AtomicButton size="lg">Large (lg)</AtomicButton>
      </div>
    `
  })
}

export const States: Story = {
  render: () => ({
    components: { AtomicButton },
    template: `
      <div class="flex flex-col gap-4">
        <div class="flex gap-4">
          <AtomicButton disabled>Disabled Normal</AtomicButton>
          <AtomicButton loading>Loading Normal</AtomicButton>
        </div>
        <div class="flex gap-4">
          <AtomicButton variant="outline" disabled>Disabled Outline</AtomicButton>
          <AtomicButton variant="outline" loading>Loading Outline</AtomicButton>
        </div>
        <div class="flex gap-4">
          <AtomicButton variant="ghost-primary" disabled>Disabled Ghost</AtomicButton>
          <AtomicButton variant="ghost-primary" loading>Loading Ghost</AtomicButton>
        </div>
      </div>
    `
  })
}

export const BlockWithIcons: Story = {
  args: {
    label: 'Simpan Perubahan',
    variant: 'primary',
    block: true
  },
  render: (args) => ({
    components: { AtomicButton },
    setup() {
      return { args }
    },
    template: `
      <div class="w-72">
        <AtomicButton v-bind="args">
          <template #icon-left>
            <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
          </template>
        </AtomicButton>
      </div>
    `
  })
}
