import type { Meta, StoryObj } from '@storybook/vue3-vite'
import OrganismCard from '../../app/components/ui/organisms/Card.vue'

const meta: Meta<typeof OrganismCard> = {
  title: 'Organisms/Card',
  component: OrganismCard,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Wadah (container) serbaguna untuk mengelompokkan informasi. Mendukung slot yang terstruktur (header, body, footer, media) dan berbagai tingkat elevasi bayangan (shadow).'
      }
    }
  },
  argTypes: {
    title: {
      control: 'text',
      description: 'Judul kartu (opsional, akan dirender dalam tag h3 premium)',
      table: { type: { summary: 'string' } }
    },
    description: {
      control: 'text',
      description: 'Deskripsi di bawah judul',
      table: { type: { summary: 'string' } }
    },
    variant: {
      control: 'select',
      options: ['default', 'outlined', 'elevated'],
      description: 'Tingkat elevasi dan ketebalan garis',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'default' }
      }
    },
    padding: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg'],
      description: 'Ruang kosong di dalam kartu (padding)',
      table: { type: { summary: 'string' }, defaultValue: { summary: 'md' } }
    },
    hoverable: {
      control: 'boolean',
      description:
        'Menambahkan efek terangkat interaktif dan kursor saat disorot',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' }
      }
    }
  }
}

export default meta
type Story = StoryObj<typeof OrganismCard>

export const Default: Story = {
  args: {
    title: 'Desain Sistem',
    description: 'Dokumentasi lengkap komponen UI Kolaboria.',
    variant: 'default',
    padding: 'md',
    hoverable: false
  },
  render: (args) => ({
    components: { OrganismCard },
    setup() {
      return { args }
    },
    template: `
      <div class="max-w-sm">
        <OrganismCard v-bind="args">
          Komponen ini mendukung slot default untuk konten utama. Anda bisa memasukkan tag HTML apapun di sini.
        </OrganismCard>
      </div>
    `
  })
}

export const ElevatedHoverable: Story = {
  args: {
    ...Default.args,
    title: 'Kartu Interaktif',
    variant: 'elevated',
    hoverable: true
  },
  render: Default.render
}

export const CompleteLayout: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Contoh penggunaan semua slot (`media`, `header`, `default`, `footer`) dalam satu kartu yang kompleks.'
      }
    }
  },
  args: {
    title: 'Lowongan: UI/UX Designer',
    description: 'PT Maju Terus Pantang Mundur',
    variant: 'outlined',
    padding: 'md',
    hoverable: true
  },
  render: (args) => ({
    components: { OrganismCard },
    setup() {
      return { args }
    },
    template: `
      <div class="max-w-sm">
        <OrganismCard v-bind="args">
          <template #media>
            <div class="h-32 w-full bg-gradient-to-r from-primary-400 to-primary-600 flex items-center justify-center">
              <span class="text-white font-bold opacity-50 uppercase tracking-widest text-sm">Banner Image</span>
            </div>
          </template>
          
          <div class="flex flex-col gap-2">
            <span class="inline-flex w-fit px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-success-50 text-success-700 border border-success-200">Remote</span>
            <p class="text-sm text-neutral-600">Kami mencari UI/UX Designer berpengalaman untuk merancang aplikasi SaaS yang revolusioner.</p>
          </div>
          
          <template #footer>
            <div class="flex justify-between items-center">
              <span class="text-xs text-neutral-400">Dibuat 2 jam lalu</span>
              <button class="px-4 py-2 text-sm font-semibold text-white bg-primary-500 hover:bg-primary-600 rounded-lg transition-colors">Lamar Sekarang</button>
            </div>
          </template>
        </OrganismCard>
      </div>
    `
  })
}
