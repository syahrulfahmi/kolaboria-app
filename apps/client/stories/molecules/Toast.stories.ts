import type { Meta, StoryObj } from '@storybook/vue3-vite'
import MoleculeToast from '../../app/components/ui/molecules/Toast.vue'
import MoleculeToastContainer from '../../app/components/ui/molecules/ToastContainer.vue'
import { useToast } from '../../app/composables/useToast'
import { defineComponent } from 'vue'

// Custom wrapper to demonstrate the Toast Composable and Container in action
const ToastDemo = defineComponent({
  components: { MoleculeToastContainer },
  setup() {
    const toast = useToast()

    const triggerSuccess = () =>
      toast.success('Berhasil menyimpan perubahan profil', 'Sukses!')
    const triggerError = () =>
      toast.error('Gagal menghubungkan ke server.', 'Error 500')
    const triggerInfo = () =>
      toast.info('Pembaruan sistem akan dilakukan malam ini.')
    const triggerWarning = () =>
      toast.warning('Sisa kuota upload kamu tinggal 10MB.')
    const triggerPersistent = () =>
      toast.add({
        variant: 'info',
        title: 'Notifikasi Tetap',
        message: 'Toast ini tidak akan hilang otomatis (duration: 0).',
        duration: 0
      })

    return {
      triggerSuccess,
      triggerError,
      triggerInfo,
      triggerWarning,
      triggerPersistent
    }
  },
  template: `
    <div class="p-6 bg-neutral-50 rounded-xl border border-neutral-200">
      <h3 class="text-heading font-bold mb-4">Uji Coba Toast</h3>
      <div class="flex flex-wrap gap-3">
        <button class="px-4 py-2 bg-success-500 text-white rounded-lg hover:bg-success-600 transition" @click="triggerSuccess">Success Toast</button>
        <button class="px-4 py-2 bg-danger-500 text-white rounded-lg hover:bg-danger-600 transition" @click="triggerError">Error Toast</button>
        <button class="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition" @click="triggerInfo">Info Toast</button>
        <button class="px-4 py-2 bg-accent-500 text-white rounded-lg hover:bg-accent-600 transition" @click="triggerWarning">Warning Toast</button>
        <button class="px-4 py-2 bg-neutral-800 text-white rounded-lg hover:bg-neutral-900 transition" @click="triggerPersistent">Persistent Toast</button>
      </div>
      <!-- Render the container so toasts show up -->
      <MoleculeToastContainer />
    </div>
  `
})

const meta: Meta<typeof MoleculeToast> = {
  title: 'Molecules/Toast',
  component: MoleculeToast,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Sistem notifikasi mengambang (floating notification) untuk memberikan umpan balik global ke pengguna. Jangan import `MoleculeToast` atau `MoleculeToastContainer` secara langsung. Cukup panggil `useToast()` dari composable.'
      }
    }
  }
}

export default meta
type Story = StoryObj<typeof MoleculeToast>

export const Demo: Story = {
  render: () => ({
    components: { ToastDemo },
    template: '<ToastDemo />'
  })
}

// Komponen mandiri untuk dokumentasi statis Storybook
export const StaticVariants: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Varian desain Toast (hanya untuk preview komponen satuan, tanpa animasi container).'
      }
    }
  },
  render: () => ({
    components: { MoleculeToast },
    template: `
      <div class="flex flex-col gap-4 max-w-[400px]">
        <MoleculeToast id="1" variant="success" title="Berhasil" message="Data berhasil disimpan" />
        <MoleculeToast id="2" variant="info" title="Info" message="Ada pesan baru untukmu" />
        <MoleculeToast id="3" variant="warning" title="Peringatan" message="Koneksi lambat" />
        <MoleculeToast id="4" variant="danger" title="Gagal" message="Tidak bisa menghapus data" />
      </div>
    `
  })
}
