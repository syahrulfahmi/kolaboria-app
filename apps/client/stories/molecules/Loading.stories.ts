import type { Meta, StoryObj } from '@storybook/vue3-vite'
import MoleculeLoading from '../../app/components/ui/molecules/Loading.vue'

const meta: Meta<typeof MoleculeLoading> = {
  title: 'Molecules/Loading',
  component: MoleculeLoading,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Animasi pemuatan konten (loading) berbasis titik (dots) dengan efek kedalaman warna. Menggantikan pola spinner biasa untuk nuansa yang lebih modern. Mendukung layout untuk dalam seksi atau memblokir layar penuh (fullscreen).'
      }
    }
  },
  argTypes: {
    type: {
      control: 'radio',
      options: ['section', 'fullscreen'],
      description:
        'Tipe layout loading (dalam kontainer vs layar penuh dengan efek blur)',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'section' }
      }
    },
    label: {
      control: 'text',
      description: 'Teks berkedip opsional di bawah titik-titik animasi',
      table: { type: { summary: 'string' } }
    }
  }
}

export default meta
type Story = StoryObj<typeof MoleculeLoading>

export const Section: Story = {
  args: {
    type: 'section',
    label: 'Memuat data bagian ini...'
  },
  render: (args) => ({
    components: { MoleculeLoading },
    setup() {
      return { args }
    },
    template: `
      <div class="border border-dashed border-neutral-300 rounded-xl bg-neutral-50 h-64 flex items-center justify-center relative">
        <MoleculeLoading v-bind="args" />
      </div>
    `
  })
}

export const Fullscreen: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Varian `fullscreen` menggunakan position `fixed` dan meletakkan overlay blur di seluruh layar.'
      }
    }
  },
  args: {
    type: 'fullscreen',
    label: 'Menyimpan perubahan...'
  },
  render: (args) => ({
    components: { MoleculeLoading },
    setup() {
      return { args }
    },
    template: `
      <div class="relative h-[400px] border border-neutral-300 rounded-xl overflow-hidden bg-white p-8">
        <h3 class="text-xl font-bold text-neutral-900 mb-4">Pengaturan Akun</h3>
        <p class="text-neutral-500 mb-4">Ini adalah konten di belakang layer loading fullscreen.</p>
        <button class="px-4 py-2 bg-primary-500 text-white rounded-lg">Simpan</button>
        
        <!-- Simulate fixed inside container just for storybook via absolute -->
        <div class="absolute inset-0">
          <MoleculeLoading v-bind="args" />
        </div>
      </div>
    `
  })
}
