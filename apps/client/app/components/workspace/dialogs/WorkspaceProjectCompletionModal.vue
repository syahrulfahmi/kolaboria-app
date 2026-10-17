<script setup lang="ts">
import type { WorkspaceProjectInfoViewModel } from '~/types/workspace-info'

defineProps<{
  open: boolean
  info: WorkspaceProjectInfoViewModel | null
  resultSummary: string
  reviewBasis: string
  saving: boolean
  reviewing: boolean
  canConfirm: boolean
  needsRefresh: boolean
  error: string | null
}>()
const emit = defineEmits<{
  'update:resultSummary': [value: string]
  'update:reviewBasis': [value: string]
  cancel: []
  confirm: []
  refresh: []
}>()
</script>

<template>
  <OrganismModal
    :model-value="open"
    title="Tinjau penutupan proyek"
    size="md"
    :persistent="true"
    :show-close="!saving && !reviewing"
    :mobile-fullscreen="true"
    @close="emit('cancel')"
  >
    <template #description>
      Pastikan hasil dan perubahan scope sudah ditinjau. Setelah ditutup, task proyek hanya dapat dibaca.
    </template>
    <MoleculeLoading v-if="reviewing" label="Memuat ringkasan penutupan terbaru…" />
    <div v-else-if="info?.closure" class="space-y-4">
      <p class="rounded-lg bg-neutral-50 p-3 font-body-2 text-secondary-800">
        {{ info.closure.task_summary.done_tasks }} task selesai · {{ info.closure.task_summary.closed_tasks }} task ditutup karena perubahan scope
        <span v-if="info.closure.task_summary.deleted_tasks" class="mt-1 block font-body-3 text-neutral-500">
          {{ info.closure.task_summary.deleted_tasks }} task dihapus dan dikecualikan.
        </span>
      </p>
      <p v-if="!info.closure.task_summary.done_tasks" class="rounded-lg bg-warning-50 p-3 font-body-3 text-warning-800">
        Belum ada hasil task berstatus Selesai. Jelaskan hasil yang dapat ditinjau dan batasan bukti yang tersedia.
      </p>
      <p v-if="!info.closure.eligible" class="font-body-3 text-danger-700">
        Ada task yang belum memenuhi syarat. Selesaikan atau tutup dengan alasan scope melalui task board.
      </p>
      <MoleculeTextarea
        :model-value="resultSummary"
        label="Ringkasan hasil proyek"
        placeholder="Jelaskan hasil proyek yang sudah ditinjau…"
        :rows="4"
        :max-length="5000"
        :show-counter="true"
        :required="true"
        :disabled="saving"
        @update:model-value="emit('update:resultSummary', $event)"
      />
      <MoleculeTextarea
        :model-value="reviewBasis"
        label="Dasar review dan batasan"
        placeholder="Jelaskan apa yang ditinjau dan keterbatasan bukti atau scope…"
        :rows="3"
        :max-length="5000"
        :show-counter="true"
        :required="info.closure.task_summary.total_tasks === 0"
        :disabled="saving"
        :hint="info.closure.task_summary.total_tasks === 0
          ? 'Wajib diisi karena proyek tidak memiliki task terstruktur.'
          : 'Opsional; berguna untuk menjelaskan hasil di luar task atau perubahan scope.'"
        @update:model-value="emit('update:reviewBasis', $event)"
      />
    </div>
    <p v-else class="font-body-2 text-neutral-600">
      Data penutupan proyek belum tersedia. Muat ulang informasi proyek sebelum melanjutkan.
    </p>
    <p v-if="error" role="alert" class="mt-3 rounded-lg bg-danger-50 p-3 font-body-3 text-danger-800">
      {{ error }}
    </p>
    <template #footer>
      <div class="flex flex-wrap justify-end gap-2">
        <AtomicButton variant="outline" size="sm" :disabled="saving || reviewing" @click="emit('cancel')">
          Batal
        </AtomicButton>
        <AtomicButton
          v-if="needsRefresh"
          variant="outline"
          size="sm"
          :disabled="saving || reviewing"
          @click="emit('refresh')"
        >
          Muat ringkasan terbaru
        </AtomicButton>
        <AtomicButton variant="primary" size="sm" :loading="saving" :disabled="!canConfirm" @click="emit('confirm')">
          {{ saving ? 'Menutup…' : 'Tutup sebagai selesai' }}
        </AtomicButton>
      </div>
    </template>
  </OrganismModal>
</template>
