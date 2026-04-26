import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import OrganismPopup from '../../app/components/ui/organisms/Popup.vue'
import AtomicButton from '../../app/components/ui/atoms/Button.vue'

const meta: Meta<typeof OrganismPopup> = {
  title: 'Organisms/Popup',
  component: OrganismPopup,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Komponen dialog konfirmasi yang terfokus. Digunakan untuk tindakan spesifik seperti konfirmasi penghapusan, pesan sukses, peringatan, atau info penting.'
      }
    }
  },
  argTypes: {
    modelValue: {
      control: 'boolean',
      description: 'v-model untuk buka/tutup popup',
      table: { type: { summary: 'boolean' } }
    },
    title: {
      control: 'text',
      description: 'Judul popup',
      table: { type: { summary: 'string' } }
    },
    description: {
      control: 'text',
      description:
        'Deskripsi popup. Mendukung teks HTML yang akan disanitasi secara aman menggunakan v-dompurify-html.',
      table: { type: { summary: 'string' } }
    },
    showClose: {
      control: 'boolean',
      description: 'Tampilkan tombol silang di kanan atas',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' }
      }
    },
    positiveLabel: {
      control: 'text',
      description:
        'Label untuk tombol konfirmasi utama (warna menyesuaikan tipe)',
      table: { type: { summary: 'string' } }
    },
    negativeLabel: {
      control: 'text',
      description:
        'Label untuk tombol batal (selalu menggunakan varian ghost-secondary)',
      table: { type: { summary: 'string' } }
    },
    type: {
      control: 'select',
      options: ['info', 'success', 'warning', 'danger'],
      description:
        'Tema visual popup yang mengubah ikon, warna background ikon, dan varian tombol positif.',
      table: { type: { summary: 'string' }, defaultValue: { summary: 'info' } }
    },
    persistent: {
      control: 'boolean',
      description: 'Mencegah popup ditutup dengan klik backdrop',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' }
      }
    }
  }
}

export default meta
type Story = StoryObj<typeof OrganismPopup>

const createPopupTemplate = (args: any, btnLabel: string) => ({
  components: { OrganismPopup, AtomicButton },
  setup() {
    const isOpen = ref(false)
    return { args, isOpen, btnLabel }
  },
  template: `
    <div>
      <AtomicButton @click="isOpen = true" :variant="args.type === 'danger' ? 'danger' : (args.type === 'warning' ? 'secondary' : 'primary')">
        {{ btnLabel }}
      </AtomicButton>
      <OrganismPopup v-bind="args" v-model="isOpen" @positive="isOpen = false" @negative="isOpen = false" />
    </div>
  `
})

export const InfoPopup: Story = {
  render: (args) =>
    createPopupTemplate(
      {
        ...args,
        type: 'info',
        title: 'Informasi Baru',
        description:
          'Terdapat pembaruan fitur pada platform Kolaboria. Silakan cek halaman panduan untuk melihat detailnya.',
        positiveLabel: 'Saya Mengerti'
      },
      'Buka Info Popup'
    )
}

export const SuccessPopup: Story = {
  render: (args) =>
    createPopupTemplate(
      {
        ...args,
        type: 'success',
        title: 'Pembayaran Berhasil',
        description:
          'Terima kasih, pembayaran Anda untuk paket Premium telah berhasil dikonfirmasi.',
        positiveLabel: 'Lihat Tagihan',
        negativeLabel: 'Tutup'
      },
      'Buka Success Popup'
    )
}

export const WarningPopup: Story = {
  render: (args) =>
    createPopupTemplate(
      {
        ...args,
        type: 'warning',
        title: 'Batalkan Perubahan?',
        description:
          'Anda memiliki perubahan yang belum disimpan. Yakin ingin membatalkan dan keluar dari halaman ini?',
        positiveLabel: 'Ya, Batalkan',
        negativeLabel: 'Kembali'
      },
      'Buka Warning Popup'
    )
}

export const DangerPopup: Story = {
  render: (args) =>
    createPopupTemplate(
      {
        ...args,
        type: 'danger',
        title: 'Hapus Proyek',
        description:
          'Apakah Anda yakin ingin menghapus proyek ini secara permanen? Tindakan ini tidak dapat dibatalkan.',
        positiveLabel: 'Hapus Permanen',
        negativeLabel: 'Batal'
      },
      'Buka Danger Popup'
    )
}

export const WithHTMLDescription: Story = {
  render: (args) =>
    createPopupTemplate(
      {
        ...args,
        type: 'success',
        title: 'Undangan Terkirim!',
        description:
          'Undangan kolaborasi telah berhasil dikirimkan ke <b>fahmi@example.com</b>. Mereka akan menerima email notifikasi segera.',
        positiveLabel: 'Selesai'
      },
      'Popup dengan Teks HTML'
    )
}

export const WithCloseIcon: Story = {
  render: (args) =>
    createPopupTemplate(
      {
        ...args,
        type: 'info',
        showClose: true,
        title: 'Pembaruan Tersedia',
        description:
          'Versi terbaru aplikasi sudah tersedia. Harap muat ulang halaman untuk mendapatkan performa terbaik.',
        positiveLabel: 'Muat Ulang Sekarang'
      },
      'Popup dengan Ikon Close'
    )
}
