import type { Meta, StoryObj } from '@storybook/vue3-vite'
import MoleculeTicker from '../../app/components/ui/molecules/Ticker.vue'

const meta: Meta<typeof MoleculeTicker> = {
  title: 'Molecules/Ticker',
  component: MoleculeTicker,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Komponen banner statis (inline) untuk menampilkan notifikasi atau pesan feedback pada form atau konten halaman. Memiliki 4 varian: success, info, warning, dan danger.'
      }
    }
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['success', 'info', 'warning', 'danger'],
      description: 'Tema warna ticker',
      table: { type: { summary: 'string' }, defaultValue: { summary: 'info' } }
    },
    title: {
      control: 'text',
      description: 'Judul ticker (opsional, dicetak tebal)',
      table: { type: { summary: 'string' } }
    },
    message: {
      control: 'text',
      description: 'Pesan utama ticker',
      table: { type: { summary: 'string' } }
    },
    closable: {
      control: 'boolean',
      description: 'Apakah ticker memiliki tombol tutup (x)',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' }
      }
    }
  }
}

export default meta
type Story = StoryObj<typeof MoleculeTicker>

export const Info: Story = {
  args: {
    variant: 'info',
    title: 'Informasi Baru',
    message: 'Fitur baru kolaboria kini telah tersedia untuk kamu.',
    closable: true
  }
}

export const Success: Story = {
  args: {
    variant: 'success',
    title: 'Berhasil Disimpan',
    message: 'Perubahan pada profil kamu berhasil disimpan ke sistem.',
    closable: true
  }
}

export const Warning: Story = {
  args: {
    variant: 'warning',
    title: 'Sesi Akan Berakhir',
    message: 'Sesi login kamu akan berakhir dalam 5 menit. Harap simpan pekerjaanmu.',
    closable: false
  }
}

export const Danger: Story = {
  args: {
    variant: 'danger',
    title: 'Gagal Masuk',
    message: 'Email atau password yang kamu masukkan salah. Silakan coba lagi.',
    closable: true
  }
}

export const NoTitle: Story = {
  args: {
    variant: 'success',
    message: 'Aksi berhasil dilakukan tanpa ada error.',
    closable: true
  }
}
