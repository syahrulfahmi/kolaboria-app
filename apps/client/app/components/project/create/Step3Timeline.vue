<script setup lang="ts">
import { onMounted, computed } from 'vue'
import type { CreateProjectPayload } from '~/types/project'
import { useSkill } from '~/composables/useSkill'

const form = defineModel<CreateProjectPayload>('form', { required: true })

const { tools: availableTools, loadTools, isLoadingTools } = useSkill()

onMounted(async () => {
  if (availableTools.value.length === 0) {
    await loadTools()
  }
})

if (!form.value.tool_ids) {
	form.value.tool_ids = []
}

const techOptions = computed(() => {
  return availableTools.value.map((t) => ({
    label: t.name,
    value: t.id
  }))
})

// Convert YYYY-MM-DD string to Date object and back for MoleculeDatePicker
const startDateObj = computed({
  get: () => (form.value.start_date ? new Date(form.value.start_date) : null),
  set: (val: Date | null | { start: Date | null; end: Date | null }) => {
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
  get: () => (form.value.deadline ? new Date(form.value.deadline) : null),
  set: (val: Date | null | { start: Date | null; end: Date | null }) => {
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
  <OrganismCard
    variant="elevated"
    class="animate-fade-in border-0 shadow-lg shadow-neutral-200/50"
  >
    <div class="mb-6 border-b border-neutral-100 pb-5">
      <h3 class="font-title-2">Timeline & Komitmen</h3>
      <p class="mt-1 font-paragraph-2 text-secondary">
        Atur jadwal, ekspektasi teknis, dan apa yang bisa didapatkan oleh
        kontributor saat bergabung di project ini.
      </p>
    </div>

    <div class="space-y-8">
      <!-- Section: Jadwal -->
      <div
        class="space-y-5 rounded-2xl bg-neutral-50/50 p-5 ring-1 ring-inset ring-neutral-100"
      >
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 mt-2">
          <MoleculeDatePicker
            v-model="startDateObj"
            label="Tanggal Mulai"
            placeholder="Pilih tanggal mulai"
            hint="Kapan project ini akan resmi dimulai?"
          />
          <MoleculeDatePicker
            v-model="deadlineObj"
            label="Deadline (Opsional)"
            placeholder="Pilih deadline"
            hint="Kapan project ini ditargetkan selesai?"
          />
        </div>
      </div>

      <!-- Section: Tech Stack -->
      <div class="space-y-5">
        <MoleculeDropdown
          v-model="form.tool_ids"
          label="Tech Stack / Tools"
          placeholder="Cari dan pilih teknologi/tools..."
          :options="techOptions"
          searchable
          multiple
          :loading="isLoadingTools"
          hint="Pilih teknologi, library, atau tools utama yang akan digunakan dalam project ini."
        />
      </div>

      <!-- Section: Benefits -->
      <div class="space-y-5">
        <MoleculeTextarea
          v-model="form.why_join"
          label="Kenapa Bergabung? (Value Proposition)"
          rows="4"
          placeholder="Jelaskan apa keuntungan yang akan didapat kontributor. Misalnya: Pembagian hasil, portfolio, networking, atau sertifikat."
        />
      </div>
    </div>
  </OrganismCard>
</template>
