<script setup lang="ts">
import type { Application } from '../../types/project'

const props = defineProps<{
  application: Application | null
  modelValue: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  close: []
  reviewed: [status: 'accepted' | 'rejected', note: string]
}>()

const reviewerNote = ref('')
const isSubmitting = ref(false)

// Reset note when modal opens/closes
watch(
  () => props.modelValue,
  (val) => {
    if (!val) reviewerNote.value = ''
  }
)

const handleReview = async (status: 'accepted' | 'rejected') => {
  if (!props.application) return
  isSubmitting.value = true
  try {
    emit('reviewed', status, reviewerNote.value)
  } finally {
    isSubmitting.value = false
  }
}

const handleClose = () => {
  emit('update:modelValue', false)
  emit('close')
}

const availabilityLabels: Record<string, string> = {
  flexible: 'Fleksibel',
  full_time: 'Full Time',
  part_time: 'Part Time',
  weekends_only: 'Hanya Akhir Pekan'
}

const statusConfig: Record<string, { label: string; classes: string }> = {
  pending: {
    label: 'Menunggu',
    classes: 'bg-accent-50 text-accent-700 ring-accent-200'
  },
  accepted: {
    label: 'Diterima',
    classes: 'bg-success-50 text-success-700 ring-success-200'
  },
  rejected: {
    label: 'Ditolak',
    classes: 'bg-danger-50 text-danger-700 ring-danger-200'
  },
  withdrawn: {
    label: 'Dibatalkan',
    classes: 'bg-neutral-100 text-neutral-500 ring-neutral-200'
  }
}
</script>

<template>
  <OrganismModal
    :modelValue="modelValue"
    @update:modelValue="(val) => emit('update:modelValue', val)"
    title="Detail Pelamar"
    size="xl"
    @close="handleClose"
  >
    <div v-if="application" class="space-y-6">
      <!-- Status Badge (If not pending) -->
      <div
        v-if="application.status !== 'pending'"
        class="flex items-center gap-3 rounded-xl border border-neutral-100 bg-neutral-50 p-4"
      >
        <div class="flex-1">
          <p
            class="text-caption font-semibold text-neutral-500 uppercase tracking-wider mb-1"
          >
            Status Lamaran
          </p>
          <span
            :class="[
              'inline-flex items-center rounded-full px-3 py-1 text-caption font-bold ring-1 ring-inset',
              statusConfig[application.status]?.classes
            ]"
          >
            {{ statusConfig[application.status]?.label }}
          </span>
        </div>
        <div class="flex-1" v-if="application.reviewer_note">
          <p
            class="text-caption font-semibold text-neutral-500 uppercase tracking-wider mb-1"
          >
            Catatan Anda
          </p>
          <p class="text-sm font-medium text-secondary-900 line-clamp-2">
            "{{ application.reviewer_note }}"
          </p>
        </div>
      </div>

      <!-- Applicant Profile Summary -->
      <div
        class="flex items-center gap-4 rounded-xl border border-neutral-200 bg-white shadow-sm p-4"
      >
        <div
          class="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-title font-semibold text-primary-700 border-2 border-white shadow-sm"
        >
          {{
            (
              application.profiles?.full_name ||
              application.profiles?.username ||
              '?'
            )
              .charAt(0)
              .toUpperCase()
          }}
        </div>
        <div>
          <h3 class="text-body font-semibold text-secondary-900">
            {{
              application.profiles?.full_name || application.profiles?.username
            }}
          </h3>
          <p class="text-caption text-neutral-600">
            {{ application.profiles?.headline || 'Talent Kolaboria' }}
          </p>
        </div>
        <div class="ml-auto flex flex-col items-end">
          <span class="text-[11px] font-semibold uppercase text-neutral-500"
            >Completion Score</span
          >
          <span class="text-body font-bold text-success-600"
            >{{ application.profiles?.completion_score }}%</span
          >
        </div>
      </div>

      <!-- Application Details -->
      <div class="space-y-4">
        <div>
          <h4 class="text-caption font-semibold uppercase text-neutral-500">
            Motivasi
          </h4>
          <p
            class="mt-1 whitespace-pre-line text-body text-secondary-900 rounded-lg bg-neutral-50 border border-neutral-100 p-4"
          >
            {{ application.motivation }}
          </p>
        </div>

        <div v-if="application.expected_contribution">
          <h4 class="text-caption font-semibold uppercase text-neutral-500">
            Ekspektasi Kontribusi
          </h4>
          <p
            class="mt-1 whitespace-pre-line text-body text-secondary-900 rounded-lg bg-neutral-50 border border-neutral-100 p-4"
          >
            {{ application.expected_contribution }}
          </p>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <h4 class="text-caption font-semibold uppercase text-neutral-500">
              Ketersediaan
            </h4>
            <p
              class="mt-1 text-body font-medium text-secondary-900 flex items-center gap-2"
            >
              <svg
                class="w-4 h-4 text-neutral-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {{ availabilityLabels[application.availability] }}
            </p>
          </div>
          <div>
            <h4 class="text-caption font-semibold uppercase text-neutral-500">
              Portfolio Links
            </h4>
            <div
              v-if="
                application.portfolio_links &&
                application.portfolio_links.length > 0
              "
              class="mt-1 flex flex-col gap-2"
            >
              <a
                v-for="link in application.portfolio_links"
                :key="link"
                :href="link"
                target="_blank"
                rel="noopener noreferrer"
                class="truncate text-caption font-medium text-primary-600 hover:text-primary-800 hover:underline flex items-center gap-1.5 bg-primary-50 px-3 py-1.5 rounded-lg w-max"
              >
                <svg
                  class="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
                {{ link.replace(/^https?:\/\//, '') }}
              </a>
            </div>
            <p
              v-else
              class="mt-1 text-caption font-medium text-neutral-500 bg-neutral-50 px-3 py-1.5 rounded-lg w-max"
            >
              Tidak ada tautan portfolio
            </p>
          </div>
        </div>
      </div>

      <!-- Action Area (Only if pending) -->
      <div
        v-if="application.status === 'pending'"
        class="border-t border-neutral-200 pt-5 mt-2"
      >
        <label
          class="mb-1.5 block text-caption font-semibold text-secondary-900"
        >
          Catatan Reviewer
          <span class="text-neutral-400 font-normal">(Opsional)</span>
        </label>
        <textarea
          v-model="reviewerNote"
          rows="2"
          placeholder="Berikan alasan atau pesan ke pelamar..."
          class="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-body outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-100 resize-none shadow-sm"
        />

        <div class="mt-4 flex gap-3">
          <AtomicButton
            variant="outline"
            class="flex-1 !border-danger-200 !text-danger-600 hover:!bg-danger-50 hover:!border-danger-300"
            :disabled="isSubmitting"
            @click="handleReview('rejected')"
          >
            Tolak Lamaran
          </AtomicButton>
          <AtomicButton
            variant="primary"
            class="flex-1 !bg-success-600 hover:!bg-success-700 !text-white"
            :disabled="isSubmitting"
            @click="handleReview('accepted')"
          >
            Terima sebagai Kontributor
          </AtomicButton>
        </div>
      </div>
    </div>
  </OrganismModal>
</template>
