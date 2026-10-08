<script setup lang="ts">
import type {
  ProjectEditorMode,
  ProjectEditorStep
} from '~/types/project-editor'

defineProps<{
  mode: ProjectEditorMode
  currentStep: ProjectEditorStep
  completedSteps: boolean[]
}>()

const emit = defineEmits<{
  (event: 'navigate', step: ProjectEditorStep): void
}>()

const steps = [
  { label: 'Informasi Dasar', description: 'Judul dan gambaran proyek' },
  { label: 'Kebutuhan Tim', description: 'Peran, slot, dan keahlian' },
  { label: 'Konteks Kolaborasi', description: 'Tujuan dan kontribusi' },
  { label: 'Waktu & Komitmen', description: 'Jadwal serta ekspektasi' },
  { label: 'Review', description: 'Tinjau sebelum menyimpan' }
] as const

const items = steps.map((step, index) => ({
  label: step.label,
  description: step.description,
  completed: false,
  icon: [
    'folder',
    'users',
    'message-square-heart',
    'calendar-days',
    'scan-eye'
  ][index]
}))

const handleNavigate = (step: number) => {
  if (Number.isInteger(step) && step >= 0 && step <= 4)
    emit('navigate', step as ProjectEditorStep)
}
</script>

<template>
  <aside class="space-y-3 lg:sticky lg:top-24">
    <div class="hidden lg:block">
      <OrganismContentList
        :model-value="currentStep"
        :items="
          items.map((item, index) => ({
            ...item,
            completed: completedSteps[index]
          }))
        "
        :mode="mode === 'create' ? 'stepper' : 'free'"
        :sticky="false"
        @update:model-value="handleNavigate"
      />
    </div>
  </aside>
</template>
