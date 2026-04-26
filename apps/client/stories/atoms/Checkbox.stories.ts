import type { Meta, StoryObj } from '@storybook/vue3-vite'
import AtomicCheckbox from '../../app/components/ui/atoms/Checkbox.vue'

const meta: Meta<typeof AtomicCheckbox> = {
  title: 'Atoms/Checkbox',
  component: AtomicCheckbox,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Form input untuk memilih satu atau beberapa opsi dalam sebuah list. Menggunakan custom styling (non-native) agar tetap sinkron dengan design system di semua browser.'
      }
    }
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'Teks label pendamping checkbox',
      table: { type: { summary: 'string' } }
    },
    modelValue: {
      control: 'boolean',
      description: 'Status nilai (v-model)',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' }
      }
    },
    disabled: {
      control: 'boolean',
      description: 'Mematikan interaksi pengguna',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' }
      }
    }
  }
}

export default meta
type Story = StoryObj<typeof AtomicCheckbox>

export const Default: Story = {
  args: {
    label: 'Saya setuju dengan syarat dan ketentuan',
    modelValue: false
  },
  render: (args) => ({
    components: { AtomicCheckbox },
    setup() {
      return { args }
    },
    template: '<AtomicCheckbox v-bind="args" v-model="args.modelValue" />'
  })
}

export const States: Story = {
  render: () => ({
    components: { AtomicCheckbox },
    template: `
      <div class="flex flex-col gap-4">
        <AtomicCheckbox label="Unchecked" :modelValue="false" />
        <AtomicCheckbox label="Checked" :modelValue="true" />
        <AtomicCheckbox label="Disabled Unchecked" disabled :modelValue="false" />
        <AtomicCheckbox label="Disabled Checked" disabled :modelValue="true" />
      </div>
    `
  })
}
