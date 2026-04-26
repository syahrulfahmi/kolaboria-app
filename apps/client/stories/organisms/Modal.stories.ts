import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import OrganismModal from '../../app/components/ui/organisms/Modal.vue'
import AtomicButton from '../../app/components/ui/atoms/Button.vue'

const meta: Meta<typeof OrganismModal> = {
  title: 'Organisms/Modal',
  component: OrganismModal,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Komponen dialog umum yang fleksibel untuk berbagai keperluan (form, informasi panjang, dll).'
      }
    }
  },
  argTypes: {
    modelValue: {
      control: 'boolean',
      description: 'v-model untuk buka/tutup modal',
      table: { type: { summary: 'boolean' } }
    },
    title: {
      control: 'text',
      description: 'Judul modal di bagian header',
      table: { type: { summary: 'string' } }
    },
    subtitle: {
      control: 'text',
      description: 'Deskripsi pendek di bawah judul',
      table: { type: { summary: 'string' } }
    },
    showClose: {
      control: 'boolean',
      description: 'Tampilkan tombol silang di kanan atas',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'true' } }
    },
    primaryLabel: {
      control: 'text',
      description: 'Label untuk tombol primary',
      table: { type: { summary: 'string' } }
    },
    secondaryLabel: {
      control: 'text',
      description: 'Label untuk tombol secondary',
      table: { type: { summary: 'string' } }
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl'],
      description: 'Ukuran maksimal lebar modal',
      table: { type: { summary: 'string' }, defaultValue: { summary: 'md' } }
    },
    persistent: {
      control: 'boolean',
      description: 'Mencegah modal ditutup dengan klik backdrop',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' }
      }
    }
  }
}

export default meta
type Story = StoryObj<typeof OrganismModal>

// Template wrapper to make the v-model work interactively in Storybook
const createModalTemplate = (
  args: any,
  content: string = '<p class="text-neutral-600">Konten modal berada di sini.</p>'
) => ({
  components: { OrganismModal, AtomicButton },
  setup() {
    const isOpen = ref(false)
    return { args, isOpen }
  },
  template: `
    <div>
      <AtomicButton @click="isOpen = true" variant="primary">Buka Modal</AtomicButton>
      <OrganismModal v-bind="args" v-model="isOpen" @primary="isOpen = false" @secondary="isOpen = false">
        ${content}
      </OrganismModal>
    </div>
  `
})

export const Default: Story = {
  render: (args) =>
    createModalTemplate(
      {
        ...args,
        title: 'Syarat dan Ketentuan'
      },
      '<p class="text-neutral-600">Dengan menggunakan layanan Kolaboria, Anda menyetujui seluruh syarat dan ketentuan yang berlaku.</p>'
    )
}

export const WithSubtitle: Story = {
  render: (args) =>
    createModalTemplate(
      {
        ...args,
        title: 'Edit Profil',
        subtitle: 'Perbarui informasi dasar profil Anda.',
        primaryLabel: 'Simpan',
        secondaryLabel: 'Simpan'
      },
      `
    <div class="flex flex-col gap-4">
      <div class="flex flex-col gap-1.5">
        <label class="text-xs font-semibold tracking-wide uppercase text-neutral-500">Nama</label>
        <input type="text" class="w-full rounded-lg border border-neutral-300 px-4 py-2" value="Fahmi Rahman" />
      </div>
      <div class="flex flex-col gap-1.5">
        <label class="text-xs font-semibold tracking-wide uppercase text-neutral-500">Email</label>
        <input type="email" class="w-full rounded-lg border border-neutral-300 px-4 py-2" value="fahmi@example.com" />
      </div>
    </div>
  `
    )
}

export const SingleButton: Story = {
  render: (args) =>
    createModalTemplate(
      {
        ...args,
        title: 'Pengumuman Penting',
        primaryLabel: 'Saya Mengerti'
      },
      '<p class="text-neutral-600 text-center py-4">Terdapat pembaruan pada sistem kami yang akan berlangsung malam ini. Harap maklum jika ada kendala akses sementara.</p>'
    )
}

export const DoubleButton: Story = {
  render: (args) =>
    createModalTemplate(
      {
        ...args,
        title: 'Konfirmasi Keluar',
        primaryLabel: 'Keluar',
        secondaryLabel: 'Batal'
      },
      '<p class="text-neutral-600">Apakah Anda yakin ingin keluar dari aplikasi?</p>'
    )
}

export const WithoutCloseIcon: Story = {
  render: (args) =>
    createModalTemplate(
      {
        ...args,
        title: 'Wajib Dibaca',
        showClose: false,
        persistent: true,
        primaryLabel: 'Setuju'
      },
      '<p class="text-neutral-600">Ini adalah modal yang tidak bisa ditutup kecuali menekan tombol aksi (persistent: true & showClose: false).</p>'
    )
}

export const Sizes: Story = {
  render: (args) => ({
    components: { OrganismModal, AtomicButton },
    setup() {
      const openSm = ref(false)
      const openMd = ref(false)
      const openLg = ref(false)
      const openXl = ref(false)
      return { args, openSm, openMd, openLg, openXl }
    },
    template: `
      <div class="flex flex-wrap gap-4">
        <AtomicButton @click="openSm = true">Buka Small</AtomicButton>
        <AtomicButton @click="openMd = true">Buka Medium</AtomicButton>
        <AtomicButton @click="openLg = true">Buka Large</AtomicButton>
        <AtomicButton @click="openXl = true">Buka Extra Large</AtomicButton>

        <OrganismModal v-model="openSm" title="Small Modal" size="sm" primaryLabel="Tutup" @primary="openSm = false">
          <p>Konten modal ukuran kecil (max-w-sm).</p>
        </OrganismModal>

        <OrganismModal v-model="openMd" title="Medium Modal" size="md" primaryLabel="Tutup" @primary="openMd = false">
          <p>Konten modal ukuran menengah (max-w-md, default).</p>
        </OrganismModal>

        <OrganismModal v-model="openLg" title="Large Modal" size="lg" primaryLabel="Tutup" @primary="openLg = false">
          <p>Konten modal ukuran besar (max-w-lg). Cocok untuk form panjang.</p>
        </OrganismModal>

        <OrganismModal v-model="openXl" title="Extra Large Modal" size="xl" primaryLabel="Tutup" @primary="openXl = false">
          <p>Konten modal ukuran paling besar (max-w-2xl). Cocok untuk tabel atau konten lebar.</p>
        </OrganismModal>
      </div>
    `
  })
}
