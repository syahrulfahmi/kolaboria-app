import type { Meta, StoryObj } from '@storybook/vue3-vite'
import OrganismEmptyState from '../../app/components/ui/organisms/EmptyState.vue'

const meta: Meta<typeof OrganismEmptyState> = {
  title: 'Organisms/EmptyState',
  component: OrganismEmptyState,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Wadah pemberitahuan layar kosong (tidak ada data, pencarian tidak ditemukan, dll). Dirancang dengan ikon gradient premium dan terintegrasi langsung dengan komponen Button.'
      }
    }
  },
  argTypes: {
    title: {
      control: 'text',
      description: 'Pesan utama halaman kosong',
      table: { type: { summary: 'string' } }
    },
    description: {
      control: 'text',
      description: 'Penjelasan tambahan atau instruksi selanjutnya',
      table: { type: { summary: 'string' } }
    },
    icon: {
      control: 'select',
      options: ['document', 'folder', 'search'],
      description: 'Pilihan ikon bawaan',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'document' }
      }
    },
    action: {
      control: 'text',
      description: 'Label tombol aksi (jika diisi, tombol utama akan muncul)',
      table: { type: { summary: 'string' } }
    },
    onAction: {
      action: 'actionClicked',
      description: 'Event saat tombol di-klik',
      table: { type: { summary: 'function' } }
    }
  }
}

export default meta
type Story = StoryObj<typeof OrganismEmptyState>

export const Default: Story = {
  args: {
    title: 'Belum ada dokumen',
    description: 'Anda belum membuat atau mengunggah dokumen apapun di sini.',
    icon: 'document'
  },
  render: (args) => ({
    components: { OrganismEmptyState },
    setup() {
      return { args }
    },
    template:
      '<div class="border rounded-2xl border-dashed border-neutral-300"><OrganismEmptyState v-bind="args" /></div>'
  })
}

export const WithAction: Story = {
  args: {
    title: 'Tidak ada proyek',
    description:
      'Mulai kolaborasi pertamamu dengan membuat proyek baru sekarang.',
    icon: 'folder',
    action: 'Buat Proyek Baru'
  },
  render: (args) => ({
    components: { OrganismEmptyState },
    setup() {
      return { args }
    },
    template:
      '<div class="border rounded-2xl border-dashed border-neutral-300"><OrganismEmptyState v-bind="args" @action="args.onAction" /></div>'
  })
}

export const SearchNoResults: Story = {
  args: {
    title: 'Hasil tidak ditemukan',
    description:
      'Maaf, kami tidak dapat menemukan desainer dengan kriteria tersebut. Coba kata kunci lain.',
    icon: 'search',
    action: 'Hapus Pencarian'
  },
  render: (args) => ({
    components: { OrganismEmptyState },
    setup() {
      return { args }
    },
    template:
      '<div class="border rounded-2xl border-dashed border-neutral-300"><OrganismEmptyState v-bind="args" @action="args.onAction" /></div>'
  })
}
