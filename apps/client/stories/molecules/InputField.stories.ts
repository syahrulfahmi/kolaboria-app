import type { Meta, StoryObj } from '@storybook/vue3-vite'
import MoleculeInputField from '../../app/components/ui/molecules/InputField.vue'

const meta: Meta<typeof MoleculeInputField> = {
  title: 'Molecules/InputField',
  component: MoleculeInputField,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Form input teks standar yang mendukung label bergaya premium, icon kiri/kanan, hint text, dan pesan error otomatis dengan ikon.'
      }
    }
  },
  argTypes: {
    label: {
      control: 'text',
      description:
        'Label premium di atas input (otomatis menjadi uppercase dan bold)',
      table: { type: { summary: 'string' } }
    },
    modelValue: {
      control: 'text',
      description: 'Nilai input (v-model)',
      table: { type: { summary: 'string | number' } }
    },
    placeholder: {
      control: 'text',
      description: 'Teks placeholder saat input kosong',
      table: { type: { summary: 'string' } }
    },
    error: {
      control: 'text',
      description:
        'Pesan error. Jika diisi, input akan berubah menjadi gaya error merah dan memunculkan ikon peringatan',
      table: { type: { summary: 'string' } }
    },
    hint: {
      control: 'text',
      description:
        'Teks bantuan halus di bawah input (tidak akan muncul jika ada error)',
      table: { type: { summary: 'string' } }
    },
    disabled: {
      control: 'boolean',
      description: 'Mematikan interaksi input',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' }
      }
    },
    required: {
      control: 'boolean',
      description: 'Menambahkan tanda asterisk biru primer pada label',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' }
      }
    },
    type: {
      control: 'text',
      description: 'Tipe input HTML (text, email, password, dll)',
      table: { type: { summary: 'string' }, defaultValue: { summary: 'text' } }
    }
  }
}

export default meta
type Story = StoryObj<typeof MoleculeInputField>

export const Default: Story = {
  args: {
    label: 'Nama Lengkap',
    placeholder: 'Masukkan nama Anda',
    required: true,
    modelValue: ''
  }
}

export const WithHint: Story = {
  args: {
    label: 'Email',
    type: 'email',
    placeholder: 'contoh@kolaboria.com',
    hint: 'Gunakan email profesional Anda'
  }
}

export const WithError: Story = {
  args: {
    label: 'Password',
    type: 'password',
    modelValue: '123',
    error: 'Password minimal 8 karakter'
  }
}

export const Disabled: Story = {
  args: {
    label: 'Username',
    modelValue: 'fahmirahman',
    disabled: true
  }
}

export const Password: Story = {
  args: {
    label: 'Kata Sandi',
    type: 'password',
    placeholder: 'Masukkan kata sandi',
    modelValue: 'rahasia123'
  }
}

export const WithIcons: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Mendukung dua slot kustom: `icon-left` dan `icon-right`.'
      }
    }
  },
  render: () => ({
    components: { MoleculeInputField },
    template: `
      <div class="flex flex-col gap-6">
        <MoleculeInputField label="Jumlah Donasi (Rp)">
          <template #icon-left>
            <span class="font-medium text-neutral-500">Rp</span>
          </template>
        </MoleculeInputField>
        
        <MoleculeInputField label="Website Pribadi" placeholder="kolaboria.com">
          <template #icon-right>
            <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </template>
        </MoleculeInputField>
      </div>
    `
  })
}
