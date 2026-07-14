<script setup lang="ts">
import { computed } from 'vue'
import type { CreateProjectPayload } from '~/types/project'

const props = defineProps<{
  skillTags: { id: string; name: string }[]
}>()

const form = defineModel<CreateProjectPayload>('form', { required: true })

if (!form.value.skill_tag_ids) {
  form.value.skill_tag_ids = []
}

const skillOptions = computed(() => {
  return props.skillTags.map((tag) => ({
    label: tag.name,
    value: tag.id
  }))
})
</script>

<template>
  <div class="space-y-8 animate-fade-in">
    <!-- Section: Kebutuhan Kontributor -->
    <div
      class="space-y-5 rounded-2xl bg-neutral-50/50 p-5 ring-1 ring-inset ring-neutral-100"
    >
      <MoleculeInputField
        v-model.number="form.max_slots"
        type="number"
        label="Jumlah Slot Kontributor"
        hint="Maksimal 20 kontributor. Berapa banyak rekan tim yang kamu butuhkan?"
        placeholder="Cth: 3"
        min="1"
        max="20"
      />

      <MoleculeDropdown
        v-model="form.skill_tag_ids"
        label="Skill yang Dibutuhkan"
        placeholder="Cari dan pilih skill..."
        :options="skillOptions"
        searchable
        multiple
        :max="5"
        hint="Pilih hingga 5 skill utama yang wajib dimiliki oleh calon kontributor."
      />
    </div>
  </div>
</template>
