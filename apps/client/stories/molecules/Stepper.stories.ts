import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import MoleculeStepper from '../../app/components/ui/molecules/Stepper.vue'

const meta: Meta<typeof MoleculeStepper> = {
  title: 'Molecules/Stepper',
  component: MoleculeStepper,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Komponen panduan multi-langkah yang menampilkan progres secara visual dengan dua orientasi: `horizontal` dan `vertical`.'
      }
    }
  },
  argTypes: {
    orientation: {
      control: 'radio',
      options: ['horizontal', 'vertical'],
      description: 'Arah tampilan stepper',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'horizontal' }
      }
    },
    showNavigation: {
      control: 'boolean',
      description: 'Tampilkan tombol navigasi bawaan',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' }
      }
    }
  }
}

export default meta
type Story = StoryObj<typeof MoleculeStepper>

const demoSteps = [
  { title: 'Daftar Akun', description: 'Buat akun baru' },
  { title: 'Lengkapi Profil', description: 'Tambahkan nama dan foto' },
  { title: 'Verifikasi', description: 'Cek email Anda' }
]

const renderTemplate = (args: any) => ({
  components: { MoleculeStepper },
  setup() {
    const activeStep = ref(1) // Set ke step kedua agar terlihat state completed & active
    return { args, activeStep }
  },
  template: `
    <div :class="args.orientation === 'horizontal' ? 'w-full' : 'h-80 w-64'">
      <MoleculeStepper v-bind="args" v-model="activeStep" />
    </div>
  `
})

export const Horizontal: Story = {
  args: {
    steps: demoSteps,
    orientation: 'horizontal'
  },
  render: renderTemplate
}

export const Vertical: Story = {
  args: {
    steps: demoSteps,
    orientation: 'vertical'
  },
  render: renderTemplate
}

export const WithNavigation: Story = {
  args: {
    steps: demoSteps,
    orientation: 'horizontal',
    showNavigation: true
  },
  render: (args) => ({
    components: { MoleculeStepper },
    setup() {
      const activeStep = ref(0)
      const onComplete = () => alert('Semua step selesai!')
      return { args, activeStep, onComplete }
    },
    template: `
      <div class="w-full">
        <MoleculeStepper v-bind="args" v-model="activeStep" @complete="onComplete" />
      </div>
    `
  })
}
