<script setup lang="ts">
import type { CreateProjectPayload } from '~/types/project'

const props = defineProps<{
  skillTags: { id: string; name: string }[]
}>()

const form = defineModel<CreateProjectPayload>('form', { required: true })

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
  <OrganismCard variant="elevated" class="animate-fade-in border-0 shadow-lg shadow-neutral-200/50">
    <div class="mb-6 border-b border-neutral-100 pb-5">
      <h3 class="text-title text-secondary-900">2. Kebutuhan & Skill</h3>
      <p class="mt-1.5 text-body text-neutral-500">Tentukan siapa yang kamu butuhkan untuk mewujudkan project ini agar kami dapat mempertemukanmu dengan talenta yang tepat.</p>
    </div>

    <div class="space-y-8">
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

      <!-- Section: Konteks Project -->
      <div class="space-y-5">
        <div class="flex flex-col gap-1.5">
          <label class="text-xs font-semibold tracking-wide uppercase text-neutral-500">
            Deskripsi Lengkap
          </label>
          <textarea
            v-model="form.description"
            rows="6"
            placeholder="Ceritakan lebih dalam tentang latar belakang project, masalah spesifik yang ingin dipecahkan, dan ekspektasi peran dari para kontributor..."
            class="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-body text-neutral-900 outline-none transition-all duration-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 resize-none hover:border-primary-300 shadow-sm"
          />
          <span class="text-caption text-neutral-500">Deskripsi yang detail akan meningkatkan kemungkinan talenta untuk tertarik bergabung.</span>
        </div>
      </div>
    </div>
  </OrganismCard>
</template>
