<script setup lang="ts">
import { computed } from 'vue'
import type { CreateProjectPayload } from '~/types/project'

const form = defineModel<CreateProjectPayload>('form', { required: true })

const props = defineProps<{
  skillTags: { id: string; name: string }[]
}>()

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
  <OrganismCard
    variant="elevated"
    class="animate-fade-in border-0 shadow-lg shadow-neutral-200/50"
  >
    <div class="mb-6 border-b border-neutral-100 pb-5">
      <h3 class="font-title-2">Kebutuhan & Keahlian</h3>
      <p class="mt-1 font-paragraph-2 text-secondary">
        Tentukan siapa yang kamu butuhkan untuk mewujudkan project ini agar kami
        dapat mempertemukanmu dengan talenta yang tepat.
      </p>
    </div>

    <div class="space-y-8">
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

      <!-- Section: Konteks Project -->
      <div class="space-y-5">
        <MoleculeTextarea
          v-model="form.description"
          label="Deskripsi Lengkap"
          placeholder="Jelaskan latar belakang proyek, masalah yang ingin diselesaikan, tujuan yang ingin dicapai, serta peran dan kontribusi yang diharapkan dari setiap anggota tim."
          :rows="6"
          hint="Deskripsi yang detail akan meningkatkan kemungkinan talenta untuk tertarik bergabung."
        />
      </div>
    </div>
  </OrganismCard>
</template>
