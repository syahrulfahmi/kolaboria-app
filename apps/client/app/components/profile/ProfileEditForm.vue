<script setup lang="ts">
import { computed, ref } from 'vue'
import type {
  Profile,
  TalentProfile,
  UserSkill,
  UserTool
} from '../../types/profile'
import type { Skill, Tool } from '../../types/skill'

const props = defineProps<{
  profile: Profile
  talentProfile?: TalentProfile | null
  allSkills: Skill[]
  userSkills: UserSkill[]
  allTools: Tool[]
  userTools: UserTool[]
  loading?: boolean
}>()

const emit = defineEmits<{
  save: [
    data: {
      full_name: string
      headline: string
      location: string
      bio: string
      goal: string
    }
  ]
  cancel: []
  addSkill: [skillId: string]
  removeSkill: [userSkillId: string]
  setPrimarySkill: [userSkillId: string]
  addTool: [toolId: string]
  removeTool: [userToolId: string]
}>()

const form = ref({
  full_name: props.profile.full_name || '',
  headline: props.profile.headline || '',
  location: props.profile.location || '',
  bio: props.profile.bio || '',
  goal: props.talentProfile?.goal || ''
})

const selectedSkillId = ref<string | null>(null)
const selectedToolId = ref<string | null>(null)

const skillOptions = computed(() =>
  props.allSkills
    .filter(
      (skill) =>
        !props.userSkills.some((userSkill) => userSkill.skill_id === skill.id)
    )
    .map((skill) => ({
      label: skill.category ? `${skill.name} - ${skill.category}` : skill.name,
      value: skill.id
    }))
)

const toolOptions = computed(() =>
  props.allTools
    .filter(
      (tool) =>
        !props.userTools.some((userTool) => userTool.tool_id === tool.id)
    )
    .map((tool) => ({
      label: tool.category ? `${tool.name} - ${tool.category}` : tool.name,
      value: tool.id
    }))
)

const handleSave = () => {
  emit('save', { ...form.value })
}

const handleAddSkill = () => {
  if (!selectedSkillId.value) return
  emit('addSkill', selectedSkillId.value)
  selectedSkillId.value = null
}

const handleAddTool = () => {
  if (!selectedToolId.value) return
  emit('addTool', selectedToolId.value)
  selectedToolId.value = null
}
</script>

<template>
  <form class="space-y-6" @submit.prevent="handleSave">
    <div class="grid gap-6 lg:grid-cols-[1.2fr_1fr] items-start">
      <!-- Left Column -->
      <div class="space-y-6">
        <section
          class="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8"
        >
          <div class="mb-6">
            <p class="text-caption font-semibold uppercase text-primary-700">
              Informasi dasar
            </p>
            <h2 class="mt-1 text-title text-secondary-900">
              Identitas portfolio
            </h2>
          </div>

          <div class="grid gap-4 sm:grid-cols-2">
            <MoleculeInputField
              v-model="form.full_name"
              label="Nama Lengkap"
              placeholder="Masukkan nama lengkap kamu"
            />

            <MoleculeInputField
              v-model="form.location"
              label="Lokasi"
              placeholder="Contoh: Jakarta, Indonesia"
            />
          </div>

          <div class="mt-4">
            <MoleculeInputField
              v-model="form.headline"
              label="Headline"
              placeholder="Contoh: Frontend Developer | UI/UX Enthusiast"
            />
          </div>

          <div class="mt-4 grid gap-4 lg:grid-cols-2">
            <div class="flex flex-col gap-1.5">
              <label
                class="text-caption font-semibold uppercase text-neutral-500"
                >Bio</label
              >
              <textarea
                v-model="form.bio"
                rows="6"
                placeholder="Ceritakan fokus, pengalaman, atau cara kamu berkontribusi."
                class="w-full resize-none rounded-lg border border-neutral-300 bg-white px-4 py-2.5 text-body text-neutral-900 transition-colors focus:border-primary-500 focus:outline-none disabled:bg-neutral-100"
                :disabled="loading"
              />
            </div>

            <div class="flex flex-col gap-1.5">
              <label
                class="text-caption font-semibold uppercase text-neutral-500"
                >Goal</label
              >
              <textarea
                v-model="form.goal"
                rows="6"
                placeholder="Contoh: Mencari pengalaman project nyata dan mentor untuk berkembang."
                class="w-full resize-none rounded-lg border border-neutral-300 bg-white px-4 py-2.5 text-body text-neutral-900 transition-colors focus:border-primary-500 focus:outline-none disabled:bg-neutral-100"
                :disabled="loading"
              />
            </div>
          </div>
        </section>
      </div>

      <!-- Right Column -->
      <div class="space-y-6">
        <section
          class="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8"
        >
          <div class="mb-6">
            <p class="text-caption font-semibold uppercase text-primary-700">
              Skills
            </p>
            <h2 class="mt-1 text-title text-secondary-900">
              Primary dan supporting skills
            </h2>
          </div>

          <div class="grid gap-3 lg:grid-cols-[1fr_auto]">
            <MoleculeDropdown
              v-model="selectedSkillId"
              label="Tambah skill"
              placeholder="Pilih skill"
              :options="skillOptions"
              searchable
              :disabled="loading || skillOptions.length === 0"
            />
            <AtomicButton
              type="button"
              variant="primary"
              class="self-end"
              :disabled="!selectedSkillId || loading"
              @click="handleAddSkill"
            >
              Tambah Skill
            </AtomicButton>
          </div>

          <div v-if="userSkills.length > 0" class="mt-6 space-y-3">
            <div
              v-for="skill in userSkills"
              :key="skill.id"
              class="flex flex-col gap-3 rounded-xl border border-neutral-200 bg-neutral-50 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <div class="flex flex-wrap items-center gap-2">
                  <p class="text-body font-semibold text-secondary-900">
                    {{ skill.skills?.name }}
                  </p>
                  <AtomicTag v-if="skill.is_primary" variant="primary"
                    >Primary</AtomicTag
                  >
                </div>
                <p
                  v-if="skill.skills?.category"
                  class="mt-1 text-caption text-neutral-500"
                >
                  {{ skill.skills.category }}
                </p>
              </div>
              <div class="flex flex-wrap gap-2">
                <AtomicButton
                  v-if="!skill.is_primary"
                  type="button"
                  variant="outline"
                  size="sm"
                  :disabled="loading"
                  @click="emit('setPrimarySkill', skill.id)"
                >
                  Jadikan Primary
                </AtomicButton>
                <AtomicButton
                  type="button"
                  variant="ghost-danger"
                  size="sm"
                  :disabled="loading"
                  @click="emit('removeSkill', skill.id)"
                >
                  Hapus
                </AtomicButton>
              </div>
            </div>
          </div>

          <p
            v-else
            class="mt-6 rounded-xl border border-neutral-200 bg-neutral-50 p-4 text-body text-neutral-600"
          >
            Tambahkan minimal satu skill untuk menaikkan profile readiness.
          </p>
        </section>

        <section
          class="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8"
        >
          <div class="mb-6">
            <p class="text-caption font-semibold uppercase text-primary-700">
              Tools
            </p>
            <h2 class="mt-1 text-title text-secondary-900">
              Stack dan alat kerja
            </h2>
          </div>

          <div class="grid gap-3 lg:grid-cols-[1fr_auto]">
            <MoleculeDropdown
              v-model="selectedToolId"
              label="Tambah tool"
              placeholder="Pilih tool"
              :options="toolOptions"
              searchable
              :disabled="loading || toolOptions.length === 0"
            />
            <AtomicButton
              type="button"
              variant="primary"
              class="self-end"
              :disabled="!selectedToolId || loading"
              @click="handleAddTool"
            >
              Tambah Tool
            </AtomicButton>
          </div>

          <div v-if="userTools.length > 0" class="mt-6 flex flex-wrap gap-2">
            <AtomicTag
              v-for="tool in userTools"
              :key="tool.id"
              variant="default"
              closable
              @close="emit('removeTool', tool.id)"
            >
              {{ tool.tools?.name }}
            </AtomicTag>
          </div>

          <p
            v-else
            class="mt-6 rounded-xl border border-neutral-200 bg-neutral-50 p-4 text-body text-neutral-600"
          >
            Tambahkan tools agar calon kolaborator tahu stack yang kamu kuasai.
          </p>
        </section>
      </div>
    </div>

    <div class="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
      <AtomicButton
        type="button"
        variant="outline"
        :disabled="loading"
        @click="emit('cancel')"
      >
        Batal
      </AtomicButton>
      <AtomicButton type="submit" variant="primary" :loading="loading">
        Simpan Perubahan
      </AtomicButton>
    </div>
  </form>
</template>
