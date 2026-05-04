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
  <form class="flex flex-col gap-6" @submit.prevent="handleSave">
    <!-- INFORMASI DASAR SECTION -->
    <section class="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8">
      <div class="mb-6">
        <p class="text-caption font-semibold uppercase tracking-wider text-primary-700">Informasi Dasar</p>
        <h2 class="mt-1 text-title font-bold text-secondary-900">Identitas Portfolio</h2>
      </div>

      <div class="grid gap-5 sm:grid-cols-2">
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

      <div class="mt-5">
        <MoleculeInputField
          v-model="form.headline"
          label="Headline"
          placeholder="Contoh: Frontend Developer | UI/UX Enthusiast"
        />
      </div>

      <div class="mt-5">
        <div class="flex flex-col gap-1.5">
          <label class="text-caption font-semibold uppercase tracking-wider text-neutral-500">Bio</label>
          <textarea
            v-model="form.bio"
            rows="4"
            placeholder="Ceritakan fokus, pengalaman, atau cara kamu berkontribusi."
            class="w-full resize-none rounded-xl border border-neutral-300 bg-white px-4 py-3 text-body text-neutral-900 transition-colors focus:border-primary-500 focus:outline-none disabled:bg-neutral-100"
            :disabled="loading"
          />
        </div>
      </div>

      <div class="mt-5">
        <div class="flex flex-col gap-1.5">
          <label class="text-caption font-semibold uppercase tracking-wider text-neutral-500">Goal</label>
          <textarea
            v-model="form.goal"
            rows="3"
            placeholder="Contoh: Mencari pengalaman project nyata dan mentor untuk berkembang."
            class="w-full resize-none rounded-xl border border-neutral-300 bg-white px-4 py-3 text-body text-neutral-900 transition-colors focus:border-primary-500 focus:outline-none disabled:bg-neutral-100"
            :disabled="loading"
          />
        </div>
      </div>
    </section>

    <!-- SKILLS SECTION -->
    <section class="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8">
      <div class="mb-6">
        <p class="text-caption font-semibold uppercase tracking-wider text-primary-700">Skills</p>
        <h2 class="mt-1 text-title font-bold text-secondary-900">Primary & Supporting Skills</h2>
      </div>

      <div class="flex flex-col sm:flex-row gap-3 items-start sm:items-end">
        <div class="w-full">
          <MoleculeDropdown
            v-model="selectedSkillId"
            label="Tambah Skill"
            placeholder="Pilih skill"
            :options="skillOptions"
            searchable
            :disabled="loading || skillOptions.length === 0"
          />
        </div>
        <AtomicButton
          type="button"
          variant="primary"
          class="w-full sm:w-auto shrink-0 mb-[2px]"
          :disabled="!selectedSkillId || loading"
          @click="handleAddSkill"
        >
          <span class="flex items-center gap-1">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Tambah
          </span>
        </AtomicButton>
      </div>

      <div v-if="userSkills.length > 0" class="mt-6 grid gap-3 sm:grid-cols-2">
        <div
          v-for="skill in userSkills"
          :key="skill.id"
          class="flex items-center justify-between gap-3 rounded-xl border border-neutral-200 bg-neutral-50 p-3"
        >
          <div class="min-w-0 flex-1">
            <div class="flex items-center gap-2">
              <p class="text-body font-semibold text-secondary-900 truncate" :title="skill.skills?.name">
                {{ skill.skills?.name }}
              </p>
              <span v-if="skill.is_primary" class="shrink-0 bg-primary-100 text-primary-700 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-widest">
                Primary
              </span>
            </div>
            <p v-if="skill.skills?.category" class="text-[11px] font-medium text-neutral-500 uppercase tracking-wider truncate mt-0.5">
              {{ skill.skills.category }}
            </p>
          </div>
          
          <div class="flex items-center gap-1 shrink-0">
            <button
              v-if="!skill.is_primary"
              type="button"
              class="w-8 h-8 flex items-center justify-center rounded-lg text-neutral-400 hover:text-primary-600 hover:bg-primary-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
              title="Jadikan Primary"
              :disabled="loading"
              @click="emit('setPrimarySkill', skill.id)"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </button>
            <button
              type="button"
              class="w-8 h-8 flex items-center justify-center rounded-lg text-neutral-400 hover:text-danger-600 hover:bg-danger-50 transition-colors focus:outline-none focus:ring-2 focus:ring-danger-500"
              title="Hapus Skill"
              :disabled="loading"
              @click="emit('removeSkill', skill.id)"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div v-else class="mt-6 flex flex-col items-center justify-center text-center rounded-xl border border-dashed border-neutral-300 bg-neutral-50 p-6">
        <svg class="w-8 h-8 text-neutral-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
        <p class="text-body font-medium text-neutral-700">Belum ada skill</p>
        <p class="text-caption text-neutral-500 mt-1">Tambahkan minimal satu skill untuk menaikkan profile readiness.</p>
      </div>
    </section>

    <!-- TOOLS SECTION -->
    <section class="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8">
      <div class="mb-6">
        <p class="text-caption font-semibold uppercase tracking-wider text-primary-700">Tools</p>
        <h2 class="mt-1 text-title font-bold text-secondary-900">Stack & Alat Kerja</h2>
      </div>

      <div class="flex flex-col sm:flex-row gap-3 items-start sm:items-end">
        <div class="w-full">
          <MoleculeDropdown
            v-model="selectedToolId"
            label="Tambah Tool"
            placeholder="Pilih tool"
            :options="toolOptions"
            searchable
            :disabled="loading || toolOptions.length === 0"
          />
        </div>
        <AtomicButton
          type="button"
          variant="primary"
          class="w-full sm:w-auto shrink-0 mb-[2px]"
          :disabled="!selectedToolId || loading"
          @click="handleAddTool"
        >
          <span class="flex items-center gap-1">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Tambah
          </span>
        </AtomicButton>
      </div>

      <div v-if="userTools.length > 0" class="mt-6 flex flex-wrap gap-2">
        <AtomicTag
          v-for="tool in userTools"
          :key="tool.id"
          variant="default"
          class="pl-3 pr-2 py-1.5"
          closable
          @close="emit('removeTool', tool.id)"
        >
          <span class="mr-1">{{ tool.tools?.name }}</span>
        </AtomicTag>
      </div>

      <div v-else class="mt-6 flex flex-col items-center justify-center text-center rounded-xl border border-dashed border-neutral-300 bg-neutral-50 p-6">
        <svg class="w-8 h-8 text-neutral-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <p class="text-body font-medium text-neutral-700">Belum ada tool</p>
        <p class="text-caption text-neutral-500 mt-1">Tambahkan tools agar calon kolaborator tahu stack yang kamu kuasai.</p>
      </div>
    </section>

    <!-- STICKY ACTION BAR -->
    <div class="sticky bottom-6 z-30 mt-2 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-neutral-200 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
      <AtomicButton
        type="button"
        variant="outline"
        class="w-full sm:w-auto hover:bg-neutral-50"
        :disabled="loading"
        @click="emit('cancel')"
      >
        Batal
      </AtomicButton>
      <AtomicButton
        type="submit"
        variant="primary"
        class="w-full sm:w-auto"
        :loading="loading"
      >
        Simpan Perubahan
      </AtomicButton>
    </div>
  </form>
</template>
