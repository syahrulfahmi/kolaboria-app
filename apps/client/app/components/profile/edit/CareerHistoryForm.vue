<script setup lang="ts">
import { ref, computed } from 'vue'
import { z } from 'zod'
import type { CareerHistory } from '~/composables/useCareer'

const props = defineProps<{
  initialData?: CareerHistory | null
  loading?: boolean
}>()

const emit = defineEmits<{
  (e: 'save', payload: CareerHistory): void
  (e: 'cancel'): void
}>()

const isEdit = computed(() => !!props.initialData?.id)

// Form State
const title = ref(props.initialData?.title || '')
const company = ref(props.initialData?.company || '')
const startYear = ref<number | string>(
  props.initialData?.start_year || new Date().getFullYear()
)
const isCurrent = ref(
  props.initialData ? props.initialData.end_year === null : true
)
const endYear = ref<number | string>(
  props.initialData?.end_year || new Date().getFullYear()
)
const description = ref(props.initialData?.description || '')

// Zod Schema
const schema = z
  .object({
    title: z.string().min(2, 'Posisi/jabatan harus diisi.'),
    company: z.string().min(2, 'Nama perusahaan harus diisi.'),
    start_year: z.coerce
      .number()
      .min(1950, 'Tahun tidak valid.')
      .max(new Date().getFullYear(), 'Tahun tidak boleh melebihi tahun ini.'),
    end_year: z.coerce.number().optional().nullable()
  })
  .superRefine((data, ctx) => {
    if (!isCurrent.value) {
      if (!data.end_year) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Tahun selesai harus diisi jika tidak dicentang.',
          path: ['end_year']
        })
      } else if (data.end_year < data.start_year) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Tahun selesai tidak boleh kurang dari tahun mulai.',
          path: ['end_year']
        })
      }
    }
  })

const errors = ref<Record<string, string>>({})

const handleSubmit = () => {
  errors.value = {}

  const payloadData = {
    title: title.value,
    company: company.value,
    start_year: startYear.value,
    end_year: isCurrent.value ? null : endYear.value
  }

  const validation = schema.safeParse(payloadData)

  if (!validation.success) {
    validation.error.issues.forEach((issue) => {
      if (issue.path[0]) {
        errors.value[issue.path[0] as string] = issue.message
      }
    })
    return
  }

  emit('save', {
    ...validation.data,
    description: description.value || null
  } as CareerHistory)
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <!-- Jabatan -->
      <div class="sm:col-span-2">
        <MoleculeInputField
          id="title"
          label="Jabatan / Posisi"
          v-model="title"
          placeholder="Contoh: Frontend Engineer"
          :error="errors.title"
        />
      </div>

      <!-- Perusahaan -->
      <div class="sm:col-span-2">
        <MoleculeInputField
          id="company"
          label="Perusahaan / Organisasi"
          v-model="company"
          placeholder="Contoh: PT Kolaboria Nusantara"
          :error="errors.company"
        />
      </div>

      <!-- Tahun Mulai -->
      <div>
        <MoleculeInputField
          id="start_year"
          type="number"
          label="Tahun Mulai"
          v-model="startYear"
          placeholder="Contoh: 2021"
          :error="errors.start_year"
        />
      </div>

      <!-- Tahun Selesai -->
      <div>
        <MoleculeInputField
          id="end_year"
          type="number"
          label="Tahun Selesai"
          v-model="endYear"
          :disabled="isCurrent"
          placeholder="Contoh: 2023"
          :error="errors.end_year"
        />

        <div class="mt-3">
          <AtomicCheckbox v-model="isCurrent" label="Masih bekerja di sini" />
        </div>
      </div>

      <!-- Deskripsi -->
      <div class="sm:col-span-2 flex flex-col gap-1.5">
        <label
          for="description"
          class="text-xs font-semibold tracking-wide uppercase text-neutral-500"
        >
          Deskripsi (Opsional)
        </label>
        <textarea
          id="description"
          v-model="description"
          rows="4"
          placeholder="Ceritakan peran, tanggung jawab, dan pencapaian kamu di sini..."
          class="w-full rounded-lg border border-neutral-300 bg-white px-4 py-2.5 text-body text-neutral-900 transition-all duration-150 focus:border-primary-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-neutral-500"
        ></textarea>
      </div>
    </div>

    <div
      class="flex items-center justify-end gap-3 pt-4 border-t border-neutral-200"
    >
      <AtomicButton
        type="button"
        variant="outline"
        @click="emit('cancel')"
        :disabled="loading"
      >
        Batal
      </AtomicButton>
      <AtomicButton
        type="submit"
        variant="primary"
        :loading="loading"
        :disabled="loading"
      >
        Simpan
      </AtomicButton>
    </div>
  </form>
</template>
