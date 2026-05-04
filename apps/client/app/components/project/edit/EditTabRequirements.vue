<script setup lang="ts">
import type { CreateProjectPayload } from '~/types/project'

const props = defineProps<{
  skillTags: { id: string; name: string }[]
}>()

const form = defineModel<CreateProjectPayload>('form', { required: true })
const emit = defineEmits<{ (e: 'save'): void }>()

const toggleSkill = (id: string) => {
  if (!form.value.skill_tag_ids) form.value.skill_tag_ids = []
  const index = form.value.skill_tag_ids.indexOf(id)
  if (index === -1) {
    if (form.value.skill_tag_ids.length < 5) form.value.skill_tag_ids.push(id)
  } else {
    form.value.skill_tag_ids.splice(index, 1)
  }
}
</script>

<template>
  <div class="space-y-8 animate-fade-in">
    <!-- Section: Kebutuhan Kontributor -->
    <div class="space-y-5 rounded-2xl bg-neutral-50/50 p-5 ring-1 ring-inset ring-neutral-100">
      <MoleculeInputField
        v-model.number="form.max_slots"
        type="number"
        label="Jumlah Slot Kontributor"
        hint="Maksimal 20 kontributor. Berapa banyak rekan tim yang kamu butuhkan?"
        placeholder="Cth: 3"
        min="1"
        max="20"
      />

      <div class="flex flex-col gap-2 pt-2">
        <div class="flex items-center justify-between">
          <label class="text-xs font-semibold tracking-wide uppercase text-neutral-500">
            Skill yang Dibutuhkan
          </label>
          <span class="text-xs font-medium" :class="form.skill_tag_ids?.length === 5 ? 'text-primary-500' : 'text-neutral-400'">
            {{ form.skill_tag_ids?.length || 0 }} / 5 Dipilih
          </span>
        </div>
        <div class="flex flex-wrap gap-2.5 mt-1">
          <button
            v-for="tag in skillTags"
            :key="tag.id"
            type="button"
            class="rounded-full px-3.5 py-1.5 text-sm font-medium transition-all duration-200"
            :class="[
              form.skill_tag_ids?.includes(tag.id)
                ? 'bg-primary-500 text-white shadow-sm shadow-primary-500/20 ring-1 ring-inset ring-primary-600'
                : 'bg-white text-neutral-600 ring-1 ring-inset ring-neutral-200 hover:ring-primary-300 hover:bg-primary-50 hover:text-primary-700'
            ]"
            @click="toggleSkill(tag.id)"
          >
            {{ tag.name }}
          </button>
        </div>
        <span class="text-[13px] text-neutral-500 mt-1">Pilih hingga 5 skill utama yang wajib dimiliki oleh calon kontributor.</span>
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
