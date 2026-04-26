import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import MoleculeTab from '../../app/components/ui/molecules/Tab.vue'

const meta: Meta<typeof MoleculeTab> = {
  title: 'Molecules/Tab',
  component: MoleculeTab,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Komponen navigasi konten berbasis tab dengan **animated active indicator** yang bergerak mulus antar-tab.'
      }
    }
  },
  argTypes: {
    variant: {
      control: 'radio',
      options: ['underline', 'pill', 'boxed'],
      description: 'Gaya visual tab',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'underline' }
      }
    },
    fullWidth: {
      control: 'boolean',
      description: 'Tab mengisi lebar penuh (flex-1 pada tiap item)',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' }
      }
    }
  }
}

export default meta
type Story = StoryObj<typeof MoleculeTab>

const demoTabs = [
  { value: 'overview', label: 'Overview' },
  { value: 'members', label: 'Members', disabled: false },
  { value: 'settings', label: 'Settings' }
]

const renderTemplate = (args: any) => ({
  components: { MoleculeTab },
  setup() {
    const activeTab = ref(demoTabs[0].value)
    return { args, activeTab }
  },
  template: `
    <div class="max-w-2xl min-h-[150px]">
      <MoleculeTab v-bind="args" v-model="activeTab">
        <template #default="{ active }">
          <div v-if="active === 'overview'" class="p-4 bg-neutral-50 rounded-lg border border-neutral-100 text-neutral-600 text-sm">
            Ini adalah konten untuk tab <strong>Overview</strong>.
          </div>
          <div v-else-if="active === 'members'" class="p-4 bg-neutral-50 rounded-lg border border-neutral-100 text-neutral-600 text-sm">
            Daftar anggota proyek Anda akan tampil di sini.
          </div>
          <div v-else-if="active === 'settings'" class="p-4 bg-neutral-50 rounded-lg border border-neutral-100 text-neutral-600 text-sm">
            Konfigurasi preferensi proyek Anda di sini.
          </div>
        </template>
      </MoleculeTab>
    </div>
  `
})

export const Underlined: Story = {
  args: {
    tabs: demoTabs,
    variant: 'underlined'
  },
  render: renderTemplate
}

export const Pill: Story = {
  args: {
    tabs: demoTabs,
    variant: 'pill'
  },
  render: renderTemplate
}

export const WithDisabledItem: Story = {
  args: {
    tabs: [...demoTabs, { value: 'billing', label: 'Billing', disabled: true }],
    variant: 'pill'
  },
  render: renderTemplate
}
