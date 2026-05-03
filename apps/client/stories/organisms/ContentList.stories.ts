import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import OrganismContentList from '../../app/components/ui/organisms/ContentList.vue'

const meta: Meta<typeof OrganismContentList> = {
  title: 'Organisms/ContentList',
  component: OrganismContentList,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Sidebar navigasi vertikal yang bisa diklik. Mendukung dua mode: `free` (semua item bisa dipilih bebas) dan `stepper` (navigasi linear — item terkunci sampai step sebelumnya selesai). Cocok untuk form multi-tab, wizard, atau menu pengaturan.'
      }
    }
  },
  argTypes: {
    mode: {
      control: 'select',
      options: ['free', 'stepper'],
      description: 'Mode navigasi: bebas (free) atau linear terkunci (stepper)',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'free' }
      }
    },
    sticky: {
      control: 'boolean',
      description: 'Sidebar menempel saat scroll (sticky)',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' }
      }
    }
  }
}

export default meta
type Story = StoryObj<typeof OrganismContentList>

// ─── Free Mode ───────────────────────────────────────────────────────────────

export const Default: Story = {
  parameters: {
    docs: {
      description: { story: 'Mode bebas: user bisa mengklik item mana saja.' }
    }
  },
  render: () => ({
    components: { OrganismContentList },
    setup() {
      const active = ref(0)
      const items = [
        { label: 'Informasi Dasar' },
        { label: 'Kebutuhan & Skill' },
        { label: 'Timeline' },
        { label: 'Status & Publikasi' }
      ]
      return { active, items }
    },
    template: `
      <div class="w-64">
        <OrganismContentList
          v-model="active"
          :items="items"
          mode="free"
          :sticky="false"
        />
        <p class="mt-4 text-sm text-neutral-500">Tab aktif: <strong>{{ items[active].label }}</strong></p>
      </div>
    `
  })
}

// ─── With Description ─────────────────────────────────────────────────────────

export const WithDescription: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Setiap item bisa memiliki `description` sebagai sub-teks di bawah label.'
      }
    }
  },
  render: () => ({
    components: { OrganismContentList },
    setup() {
      const active = ref(1)
      const items = [
        { label: 'Informasi Dasar', description: 'Identitas dan deskripsi project' },
        { label: 'Kebutuhan & Skill', description: 'Slot dan skill yang dicari' },
        { label: 'Timeline', description: 'Jadwal dan tech stack' },
        { label: 'Status & Publikasi', description: 'Publikasikan atau arsipkan' }
      ]
      return { active, items }
    },
    template: `
      <div class="w-64">
        <OrganismContentList
          v-model="active"
          :items="items"
          mode="free"
          :sticky="false"
        />
      </div>
    `
  })
}

// ─── Stepper Mode ─────────────────────────────────────────────────────────────

export const StepperMode: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Mode stepper: item setelah step aktif terkunci dan tidak bisa diklik. Item yang sudah selesai menampilkan ikon centang.'
      }
    }
  },
  render: () => ({
    components: { OrganismContentList },
    setup() {
      const active = ref(2)
      const items = [
        { label: 'Informasi Dasar', description: 'Isi detail utama project', completed: true },
        { label: 'Kebutuhan & Skill', description: 'Tentukan kontributor', completed: true },
        { label: 'Timeline & Komitmen', description: 'Jadwal dan komitmen', completed: false },
        { label: 'Review & Simpan', description: 'Tinjau kembali project', completed: false }
      ]
      return { active, items }
    },
    template: `
      <div class="w-64">
        <OrganismContentList
          v-model="active"
          :items="items"
          mode="stepper"
          :sticky="false"
        />
        <p class="mt-4 text-sm text-neutral-500">Step aktif: <strong>{{ active + 1 }}</strong></p>
      </div>
    `
  })
}
