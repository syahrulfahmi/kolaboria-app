<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { CareerHistory } from '~/composables/useCareer'
import type {
  DateValue,
  RangeValue
} from '~/components/ui/molecules/DatePicker.vue'
import { toMonthDate } from '~/utils/year-month'
import {
  careerHistoryFormSchema,
  type CareerHistoryFormValues
} from '~/data/career-history-validation'

const props = defineProps<{
  initialData?: CareerHistory | null
  loading?: boolean
}>()

const emit = defineEmits<{
  (event: 'save', payload: CareerHistory): void
}>()

const title = ref(props.initialData?.title ?? '')
const company = ref(props.initialData?.company ?? '')
const startDate = ref<Date | null>(
  toMonthDate(props.initialData?.start_year, props.initialData?.start_month)
)
const endDate = ref<Date | null>(
  toMonthDate(props.initialData?.end_year, props.initialData?.end_month)
)
const minDate = new Date(1950, 0, 1)
const maxDate = new Date()
const isCurrent = ref(props.initialData?.end_year == null)
const startHint = computed(() =>
  !startDate.value && props.initialData?.start_year
    ? `Tahun tersimpan: ${props.initialData.start_year}. Lengkapi bulan mulai.`
    : undefined
)
const endHint = computed(() =>
  !isCurrent.value && !endDate.value && props.initialData?.end_year
    ? `Tahun tersimpan: ${props.initialData.end_year}. Lengkapi bulan selesai.`
    : undefined
)
const description = ref(props.initialData?.description ?? '')
const errors = ref<Record<string, string>>({})

const updateStartDate = (value: DateValue | RangeValue) => {
  startDate.value = value instanceof Date ? value : null
}
const updateEndDate = (value: DateValue | RangeValue) => {
  endDate.value = value instanceof Date ? value : null
}
watch(isCurrent, (current) => {
  if (current) {
    endDate.value = null
    delete errors.value.end_year
    delete errors.value.end_month
  }
})

const handleSubmit = () => {
  if (props.loading) return
  errors.value = {}

  const validation = careerHistoryFormSchema.safeParse({
    title: title.value,
    company: company.value,
    start_year: startDate.value?.getFullYear() ?? null,
    start_month: startDate.value ? startDate.value.getMonth() + 1 : null,
    end_year: isCurrent.value ? null : (endDate.value?.getFullYear() ?? null),
    end_month:
      isCurrent.value || !endDate.value ? null : endDate.value.getMonth() + 1,
    description: description.value,
    is_current: isCurrent.value
  })

  if (!validation.success) {
    for (const issue of validation.error.issues) {
      const field = issue.path[0]
      if (typeof field === 'string' && !errors.value[field]) {
        errors.value[field] = issue.message
      }
    }
    return
  }

  const values: CareerHistoryFormValues = validation.data

  emit('save', {
    id: props.initialData?.id,
    title: values.title,
    company: values.company,
    start_year: values.start_year,
    start_month: values.start_month,
    end_year: values.is_current ? null : values.end_year,
    end_month: values.is_current ? null : values.end_month,
    description: values.description || null
  })
}
</script>

<template>
  <form
    id="career-history-form"
    class="space-y-6 sm:space-y-7"
    @submit.prevent="handleSubmit"
  >
    <section class="space-y-4">
      <header class="space-y-1">
        <h4 class="font-body-1 text-neutral-900">Informasi pengalaman</h4>
        <p class="font-body-3 text-secondary">
          Informasi utama yang akan ditampilkan pada profil.
        </p>
      </header>

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-x-5 sm:gap-y-4">
        <MoleculeInputField
          id="career-title"
          v-model="title"
          label="Peran / Posisi"
          placeholder="Contoh: Frontend Developer"
          :error="errors.title"
          :disabled="loading"
          required
          maxlength="150"
        />
        <MoleculeInputField
          id="career-company"
          v-model="company"
          label="Perusahaan / Organisasi / Project"
          placeholder="Contoh: Kolaboria"
          :error="errors.company"
          :disabled="loading"
          required
          maxlength="150"
        />
      </div>
    </section>

    <section class="space-y-4 border-t border-neutral-200 pt-5 sm:pt-6">
      <header class="space-y-1">
        <h4 class="font-label-1 text-neutral-900">Periode</h4>
        <p class="font-body-3 text-secondary">
          Pilih bulan dan tahun pengalaman ini berlangsung.
        </p>
      </header>

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-x-5">
        <MoleculeDatePicker
          :model-value="startDate"
          granularity="month"
          label="Mulai"
          placeholder="Pilih bulan dan tahun"
          :initial-view-year="initialData?.start_year"
          :hint="startHint"
          :error="errors.start_month || errors.start_year"
          :disabled="loading"
          required
          :min-date="minDate"
          :max-date="maxDate"
          @update:model-value="updateStartDate"
        />
        <div class="space-y-3">
          <MoleculeDatePicker
            :model-value="endDate"
            granularity="month"
            label="Selesai"
            :placeholder="
              isCurrent ? 'Masih berlangsung' : 'Pilih bulan dan tahun'
            "
            :initial-view-year="initialData?.end_year ?? undefined"
            :hint="endHint"
            :error="errors.end_month || errors.end_year"
            :disabled="loading || isCurrent"
            :required="!isCurrent"
            :min-date="startDate || minDate"
            :max-date="maxDate"
            @update:model-value="updateEndDate"
          />
          <AtomicCheckbox
            v-model="isCurrent"
            label="Saya masih menjalani pengalaman ini"
            :disabled="loading"
          />
        </div>
      </div>
    </section>

    <section class="space-y-4 border-t border-neutral-200 pt-5 sm:pt-6">
      <header class="space-y-1">
        <h4 class="font-label-1 text-neutral-900">Kontribusi</h4>
        <p class="font-body-3 text-secondary">
          Ceritakan peran, tanggung jawab, atau hasil yang relevan.
        </p>
      </header>

      <MoleculeTextarea
        id="career-description"
        v-model="description"
        label="Deskripsi (opsional)"
        placeholder="Jelaskan kontribusi dan hasil yang kamu berikan."
        :error="errors.description"
        :disabled="loading"
        :max-length="2000"
        :show-counter="true"
        :rows="4"
      />
    </section>
  </form>
</template>
