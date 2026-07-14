import type { Meta, StoryObj } from '@storybook/vue3-vite'
import AtomicSwitch from '../../app/components/ui/atoms/Switch.vue'

const meta: Meta<typeof AtomicSwitch> = {
  title: 'Atoms/Switch',
  component: AtomicSwitch,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Form input switch/toggle yang merepresentasikan status aktif (on) atau nonaktif (off). Menggunakan transisi halus dan styling visual agar sinkron dengan design system.'
      }
    }
  },
  argTypes: {
    modelValue: {
      control: 'boolean',
      description: 'Status nilai aktif/tidak (v-model)',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' }
      }
    },
    disabled: {
      control: 'boolean',
      description: 'Mematikan interaksi pengguna pada switch',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' }
      }
    }
  }
}

export default meta
type Story = StoryObj<typeof AtomicSwitch>

export const Default: Story = {
  args: {
    modelValue: false
  },
  render: (args) => ({
    components: { AtomicSwitch },
    setup() {
      return { args }
    },
    template: '<AtomicSwitch v-bind="args" v-model="args.modelValue" />'
  })
}

export const States: Story = {
  render: () => ({
    components: { AtomicSwitch },
    template: `
      <div class="flex flex-col gap-4">
        <div class="flex items-center gap-2">
          <span class="text-sm text-neutral-600 w-24">Off (Default):</span>
          <AtomicSwitch :modelValue="false" />
        </div>
        <div class="flex items-center gap-2">
          <span class="text-sm text-neutral-600 w-24">On:</span>
          <AtomicSwitch :modelValue="true" />
        </div>
        <div class="flex items-center gap-2">
          <span class="text-sm text-neutral-600 w-24">Disabled Off:</span>
          <AtomicSwitch disabled :modelValue="false" />
        </div>
        <div class="flex items-center gap-2">
          <span class="text-sm text-neutral-600 w-24">Disabled On:</span>
          <AtomicSwitch disabled :modelValue="true" />
        </div>
      </div>
    `
  })
}
