import type { Meta, StoryObj } from '@storybook/vue3-vite'
import MoleculeAccordion from '../../app/components/ui/molecules/Accordion.vue'

const meta: Meta<typeof MoleculeAccordion> = {
  title: 'Molecules/Accordion',
  component: MoleculeAccordion,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Komponen lipat-buka konten menggunakan animasi CSS grid rows yang halus. Mendukung mode single (satu panel aktif) atau multiple (banyak panel aktif sekaligus). Konten bisa berupa teks HTML aman atau slot kustom.'
      }
    }
  },
  argTypes: {
    items: {
      control: 'object',
      description: 'Array data accordion `{ title, content? }`',
      table: { type: { summary: 'AccordionItemData[]' } }
    },
    multiple: {
      control: 'boolean',
      description: 'Izinkan lebih dari satu panel terbuka bersamaan',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' }
      }
    },
    defaultOpen: {
      control: 'number',
      description: 'Indeks panel yang terbuka secara default',
      table: { type: { summary: 'number | number[]' } }
    }
  }
}

export default meta
type Story = StoryObj<typeof MoleculeAccordion>

const faqItems = [
  {
    title: 'Apa itu Kolaboria?',
    content:
      'Kolaboria adalah platform kolaborasi berbasis proyek yang menghubungkan <strong>developer, desainer, dan kreator</strong> untuk membangun produk bersama.'
  },
  {
    title: 'Bagaimana cara bergabung ke sebuah proyek?',
    content:
      'Temukan proyek di halaman <em>Explore</em>, lalu klik tombol <strong>"Lamar"</strong> dan isi form ketertarikan Anda. Tim pemilik proyek akan meninjau lamaran Anda.'
  },
  {
    title: 'Apakah Kolaboria gratis untuk digunakan?',
    content:
      'Ya! Kolaboria menyediakan paket gratis dengan akses ke fitur-fitur dasar. Untuk fitur premium seperti analytics lanjutan dan unlimited anggota, tersedia paket Pro.'
  },
  {
    title: 'Bagaimana sistem pembayaran bekerja?',
    content:
      'Saat ini Kolaboria bersifat gratis. Sistem monetisasi sedang dalam pengembangan dan akan diumumkan melalui newsletter resmi kami.'
  }
]

export const Default: Story = {
  args: {
    items: faqItems,
    multiple: false,
    defaultOpen: 0
  },
  render: (args) => ({
    components: { MoleculeAccordion },
    setup() {
      return { args }
    },
    template: `<div class="max-w-xl"><MoleculeAccordion v-bind="args" /></div>`
  })
}

export const MultipleOpen: Story = {
  args: {
    items: faqItems,
    multiple: true
  },
  parameters: {
    docs: {
      description: {
        story:
          'Dengan `multiple: true`, beberapa panel dapat terbuka secara bersamaan.'
      }
    }
  },
  render: (args) => ({
    components: { MoleculeAccordion },
    setup() {
      return { args }
    },
    template: `<div class="max-w-xl"><MoleculeAccordion v-bind="args" /></div>`
  })
}

export const WithCustomSlot: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Menggunakan named slot `item-{index}` untuk konten kustom (bukan hanya teks).'
      }
    }
  },
  render: () => ({
    components: { MoleculeAccordion },
    template: `
      <div class="max-w-xl">
        <MoleculeAccordion :items="[
          { title: 'Tim Kolaboria' },
          { title: 'Teknologi yang Digunakan' },
        ]">
          <template #item-0>
            <div class="flex gap-3">
              <div class="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-sm shrink-0">FR</div>
              <div>
                <p class="font-semibold text-neutral-800">Fahmi Rahman</p>
                <p class="text-neutral-500 text-xs">Founder & Full-stack Developer</p>
              </div>
            </div>
          </template>
          <template #item-1>
            <div class="flex flex-wrap gap-2">
              <span class="px-3 py-1 text-xs font-semibold rounded-full bg-primary-100 text-primary-700 border border-primary-200">Vue 3</span>
              <span class="px-3 py-1 text-xs font-semibold rounded-full bg-success-50 text-success-700 border border-success-200">Nuxt 4</span>
              <span class="px-3 py-1 text-xs font-semibold rounded-full bg-accent-100 text-accent-900 border border-accent-200">Tailwind v4</span>
              <span class="px-3 py-1 text-xs font-semibold rounded-full bg-neutral-100 text-neutral-700 border border-neutral-200">Supabase</span>
            </div>
          </template>
        </MoleculeAccordion>
      </div>
    `
  })
}
