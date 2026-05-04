<script setup lang="ts">
import { ref } from 'vue'
import type {
  Profile,
  TalentProfile,
  UserSkill,
  UserTool
} from '../../../types/profile'
import type { Skill, Tool } from '../../../types/skill'

definePageMeta({
  layout: 'home',
  middleware: 'auth'
})

const route = useRoute()
const router = useRouter()
const username = route.params.username as string

const {
  getProfileByUsername,
  getTalentProfile,
  updateProfile,
  updateTalentProfile
} = useProfile()
const {
  skills: availableSkills,
  tools: availableTools,
  loadSkills,
  loadTools,
  getUserSkills,
  addSkill,
  removeSkill,
  setPrimarySkill
} = useSkill()
const { getUserTools, addUserTool, removeUserTool } = useTool()
const currentUser = useSupabaseUser()
const { add: addToast } = useToast()

const profile = ref<Profile | null>(null)
const talentProfile = ref<TalentProfile | null>(null)
const userSkills = ref<UserSkill[]>([])
const userTools = ref<UserTool[]>([])
const allSkills = ref<Skill[]>([])
const allTools = ref<Tool[]>([])
const isActionLoading = ref(false)

const loadEditableData = async () => {
  const p = await getProfileByUsername(username)
  if (!p)
    throw createError({
      statusCode: 404,
      statusMessage: 'Profile not found',
      fatal: true
    })

  if (!currentUser.value || currentUser.value.id !== p.id) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden',
      fatal: true
    })
  }

  await Promise.all([loadSkills(), loadTools()])

  const [skills, tools, talent] = await Promise.all([
    getUserSkills(p.id),
    getUserTools(p.id),
    getTalentProfile(p.id)
  ])

  return {
    profile: p,
    talentProfile: talent,
    userSkills: skills,
    userTools: tools,
    allSkills: availableSkills.value,
    allTools: availableTools.value
  }
}

const { data } = await useAsyncData(
  `profile-edit-${username}`,
  loadEditableData
)

if (data.value) {
  profile.value = data.value.profile
  talentProfile.value = data.value.talentProfile
  userSkills.value = data.value.userSkills
  userTools.value = data.value.userTools
  allSkills.value = data.value.allSkills
  allTools.value = data.value.allTools
}

useHead({
  title: 'Edit Profil - Kolaboria'
})

const refreshEditableData = async () => {
  const data = await loadEditableData()
  profile.value = data.profile
  talentProfile.value = data.talentProfile
  userSkills.value = data.userSkills
  userTools.value = data.userTools
  allSkills.value = data.allSkills
  allTools.value = data.allTools
}

const runAction = async (
  successMessage: string,
  action: () => Promise<void>
) => {
  isActionLoading.value = true
  try {
    await action()
    await refreshEditableData()
    addToast({
      variant: 'success',
      title: 'Perubahan disimpan',
      message: successMessage
    })
    await router.replace(`/profile/${username}`)
  } catch (err: any) {
    addToast({
      variant: 'danger',
      title: 'Gagal menyimpan',
      message: err.message || 'Terjadi kesalahan saat menyimpan perubahan.'
    })
  } finally {
    isActionLoading.value = false
  }
}

const handleSave = async (formData: any) => {
  await runAction('Profil kamu berhasil diperbarui.', async () => {
    const { goal, ...profilePayload } = formData
    await updateProfile(profilePayload)
    await updateTalentProfile({ goal })
  })
}

const handleAddSkill = async (skillId: string) => {
  await runAction('Skill berhasil ditambahkan.', async () => {
    await addSkill(skillId, userSkills.value.length === 0)
  })
}

const handleRemoveSkill = async (userSkillId: string) => {
  await runAction('Skill berhasil dihapus.', async () => {
    await removeSkill(userSkillId)
  })
}

const handleSetPrimarySkill = async (userSkillId: string) => {
  await runAction('Primary skill berhasil diperbarui.', async () => {
    await setPrimarySkill(userSkillId)
  })
}

const handleAddTool = async (toolId: string) => {
  await runAction('Tool berhasil ditambahkan.', async () => {
    await addUserTool(toolId)
  })
}

const handleRemoveTool = async (userToolId: string) => {
  await runAction('Tool berhasil dihapus.', async () => {
    await removeUserTool(userToolId)
  })
}

const handleCancel = () => {
  router.push(`/profile/${username}`)
}
</script>

<template>
  <div class="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8 relative">
    <!-- Breadcrumb -->
    <NuxtLink
      :to="`/profile/${username}`"
      class="mb-6 inline-flex items-center gap-2 text-sm font-medium text-neutral-500 hover:text-primary-600"
    >
      <svg
        class="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M10 19l-7-7m0 0l7-7m-7 7h18"
        />
      </svg>
      Kembali ke profil
    </NuxtLink>

    <!-- Header Mini Preview -->
    <div
      v-if="profile"
      class="mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-6 bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm"
    >
      <!-- Avatar -->
      <div
        class="w-16 h-16 rounded-full border-2 border-white bg-primary-50 text-title font-bold text-primary-700 overflow-hidden relative shadow-sm shrink-0 flex items-center justify-center"
      >
        <img
          v-if="profile.avatar"
          :src="profile.avatar"
          :alt="profile.full_name || profile.username"
          class="w-full h-full object-cover"
        />
        <span v-else>{{
          (profile.full_name || profile.username || '?').charAt(0).toUpperCase()
        }}</span>
      </div>
      <!-- Info Singkat -->
      <div class="flex-1 min-w-0">
        <h1 class="text-heading font-bold text-secondary-900 truncate">
          Edit Profil
        </h1>
        <p class="text-body text-neutral-500 truncate mt-0.5">
          <span class="font-medium text-secondary-700">{{
            profile.full_name || profile.username
          }}</span>
          <span v-if="profile.full_name" class="text-neutral-400 mx-1.5"
            >•</span
          >
          <span v-if="profile.full_name">@{{ profile.username }}</span>
        </p>
      </div>
      <!-- Completion Score badge -->
      <div class="shrink-0 self-start sm:self-auto">
        <div class="flex flex-col items-end">
          <span
            class="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 mb-1"
            >Kelengkapan</span
          >
          <div class="flex items-center gap-2">
            <div class="w-20 h-2 bg-neutral-100 rounded-full overflow-hidden">
              <div
                class="h-full bg-success-500 rounded-full"
                :style="{ width: `${profile.completion_score || 0}%` }"
              ></div>
            </div>
            <span
              class="text-sm font-bold"
              :class="
                profile.completion_score >= 80
                  ? 'text-success-600'
                  : 'text-accent-600'
              "
            >
              {{ profile.completion_score || 0 }}%
            </span>
          </div>
        </div>
      </div>
    </div>

    <ProfileEditForm
      v-if="profile"
      :profile="profile"
      :talent-profile="talentProfile"
      :all-skills="allSkills"
      :user-skills="userSkills"
      :all-tools="allTools"
      :user-tools="userTools"
      :loading="isActionLoading"
      @save="handleSave"
      @cancel="handleCancel"
      @add-skill="handleAddSkill"
      @remove-skill="handleRemoveSkill"
      @set-primary-skill="handleSetPrimarySkill"
      @add-tool="handleAddTool"
      @remove-tool="handleRemoveTool"
    />
  </div>
</template>
