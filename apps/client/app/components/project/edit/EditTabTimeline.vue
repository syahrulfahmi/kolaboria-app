<script setup lang="ts">
import { ref, computed } from 'vue'
import type { CreateProjectPayload } from '~/types/project'

const form = defineModel<CreateProjectPayload>('form', { required: true })
const emit = defineEmits<{ (e: 'save'): void }>()

const techInput = ref('')

const addTech = () => {
  if (techInput.value.trim()) {
    if (!form.value.tech_stack) form.value.tech_stack = []
    if (!form.value.tech_stack.includes(techInput.value.trim())) {
      form.value.tech_stack.push(techInput.value.trim())
    }
    techInput.value = ''
  }
}

const removeTech = (tech: string) => {
  if (form.value.tech_stack) {
    form.value.tech_stack = form.value.tech_stack.filter(t => t !== tech)
  }
}

// Convert YYYY-MM-DD string to Date object and back for MoleculeDatePicker
const startDateObj = computed({
  get: () => form.value.start_date ? new Date(form.value.start_date) : null,
  set: (val: Date | null | { start: Date | null, end: Date | null }) => {
    if (val instanceof Date) {
      const d = new Date(val)
      d.setMinutes(d.getMinutes() - d.getTimezoneOffset())
      form.value.start_date = d.toISOString().split('T')[0]
    } else {
      form.value.start_date = undefined
    }
  }
})

const deadlineObj = computed({
  get: () => form.value.deadline ? new Date(form.value.deadline) : null,
  set: (val: Date | null | { start: Date | null, end: Date | null }) => {
    if (val instanceof Date) {
      const d = new Date(val)
      d.setMinutes(d.getMinutes() - d.getTimezoneOffset())
      form.value.deadline = d.toISOString().split('T')[0]
    } else {
      form.value.deadline = undefined
    }
  }
})
</script>

<template>
  <div class="space-y-8 animate-fade-in">
    <!-- Section: Jadwal -->
    <div class="space-y-5 rounded-2xl bg-neutral-50/50 p-5 ring-1 ring-inset ring-neutral-100">
      <h4 class="text-sm font-semibold text-secondary-900">Perkiraan Waktu</h4>
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 mt-2">
        <div class="flex flex-col gap-1">
          <MoleculeDatePicker
            v-model="startDateObj"
            label="Tanggal Mulai"
            placeholder="Pilih tanggal mulai"
          />
        </div>
        <div class="flex flex-col gap-1">
          <MoleculeDatePicker
            v-model="deadlineObj"
            label="Deadline (Opsional)"
            placeholder="Pilih deadline"
          />
        </div>
      </div>
    </div>

    <!-- Section: Tech Stack -->
    <div class="space-y-5">
      <div class="flex flex-col gap-1.5">
        <label class="text-xs font-semibold tracking-wide uppercase text-neutral-500">
          Tech Stack / Tools
        </label>
        <div class="flex gap-2 mt-1">
          <input
            v-model="techInput"
            type="text"
            placeholder="Cth: Vue.js, Figma, Node.js, dll"
            class="h-11 flex-1 rounded-xl border border-neutral-300 bg-white px-4 text-body text-neutral-900 outline-none transition-all duration-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 hover:border-primary-300 shadow-sm"
            @keydown.enter.prevent="addTech"
          />
          <AtomicButton type="button" variant="outline" @click="addTech" class="h-11 px-6 font-medium whitespace-nowrap bg-white hover:bg-neutral-50">
            Tambah
          </AtomicButton>
        </div>
        <span class="text-caption text-neutral-500">Sebutkan teknologi atau tools yang akan digunakan. Tekan Enter untuk menambahkan.</span>
        
        <div
          v-if="form.tech_stack && form.tech_stack.length > 0"
          class="mt-3 flex flex-wrap gap-2 p-3 rounded-xl bg-neutral-50 border border-neutral-100 min-h-[3rem]"
        >
          <span
            v-for="tech in form.tech_stack"
            :key="tech"
            class="flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-sm font-medium text-secondary-700 ring-1 ring-inset ring-neutral-200 shadow-sm"
          >
            {{ tech }}
            <button
              type="button"
              class="group -mr-1.5 flex h-5 w-5 items-center justify-center rounded-md hover:bg-danger-50 transition-colors"
              @click="removeTech(tech)"
            >
              <svg class="h-3.5 w-3.5 text-neutral-400 group-hover:text-danger-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
              </svg>
            </button>
          </span>
        </div>
      </div>
    </div>

    <!-- Section: Benefits -->
    <div class="space-y-5">
      <div class="flex flex-col gap-1.5">
        <label class="text-xs font-semibold tracking-wide uppercase text-neutral-500">
          Kenapa Bergabung? (Value Proposition)
        </label>
        <textarea
          v-model="form.why_join"
          rows="4"
          placeholder="Jelaskan apa keuntungan yang akan didapat kontributor. Misalnya: Pembagian hasil, portfolio, networking, atau sertifikat."
          class="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-body text-neutral-900 outline-none transition-all duration-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 resize-none hover:border-primary-300 shadow-sm"
        />
      </div>
    </div>

    <!-- Save Button -->
    <div class="flex justify-end pt-4 border-t border-neutral-100">
      <AtomicButton
        variant="primary"
        @click="emit('save')"
      >
        Simpan Perubahan
      </AtomicButton>
    </div>
  </div>
</template>
