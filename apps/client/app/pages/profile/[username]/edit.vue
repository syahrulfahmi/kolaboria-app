<script setup lang="ts">
import { ref } from 'vue'
import type {
  Profile,
  TalentProfile,
  UserSkill,
  UserTool
} from '../../../types/profile'
import type { Skill, Tool } from '../../../types/skill'
import CareerHistoryForm from '~/components/profile/edit/CareerHistoryForm.vue'
import type { CareerHistory } from '~/composables/useCareer'

definePageMeta({
  layout: 'home',
  middleware: ['auth', 'onboarding-guard']
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

const { getCompletedProjects, getPinnedProjectIds, pinProject, unpinProject } =
  usePortfolio()
const {
  getCareerHistories,
  addCareerHistory,
  updateCareerHistory,
  deleteCareerHistory
} = useCareer()

const completedProjects = ref<any[]>([])
const pinnedProjectIds = ref<string[]>([])
const isPinLimitReached = computed(() => pinnedProjectIds.value.length >= 10)

const careerHistories = ref<CareerHistory[]>([])
const showCareerForm = ref(false)
const editingCareer = ref<CareerHistory | null>(null)

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

  const [skills, tools, talent, completedProjs, pinnedIds, careers] =
    await Promise.all([
      getUserSkills(p.id),
      getUserTools(p.id),
      getTalentProfile(p.id),
      getCompletedProjects(p.id),
      getPinnedProjectIds(p.id),
      getCareerHistories(p.id)
    ])

  return {
    profile: p,
    talentProfile: talent,
    userSkills: skills,
    userTools: tools,
    allSkills: availableSkills.value,
    allTools: availableTools.value,
    completedProjects: completedProjs,
    pinnedProjectIds: pinnedIds,
    careerHistories: careers
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
  completedProjects.value = data.value.completedProjects
  pinnedProjectIds.value = data.value.pinnedProjectIds
  careerHistories.value = data.value.careerHistories
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
  completedProjects.value = data.completedProjects
  pinnedProjectIds.value = data.pinnedProjectIds
  careerHistories.value = data.careerHistories
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
  isActionLoading.value = true
  try {
    const { goal, ...profilePayload } = formData
    await updateProfile(profilePayload)
    await updateTalentProfile({ goal })
    await refreshEditableData()
    addToast({
      variant: 'success',
      title: 'Profil diperbarui',
      message: 'Profil kamu berhasil diperbarui.'
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

// Portfolio Handlers
const handleTogglePin = async (projectId: string, isPinned: boolean) => {
  await runAction(
    isPinned
      ? 'Karya unggulan dihapus dari profil.'
      : 'Karya unggulan berhasil ditambahkan.',
    async () => {
      if (isPinned) {
        await unpinProject(projectId)
      } else {
        await pinProject(projectId, pinnedProjectIds.value.length)
      }
    }
  )
}

// Career Handlers
const handleSaveCareer = async (payload: CareerHistory) => {
  await runAction(
    editingCareer.value
      ? 'Riwayat karier diperbarui.'
      : 'Riwayat karier berhasil ditambahkan.',
    async () => {
      if (editingCareer.value?.id) {
        await updateCareerHistory(editingCareer.value.id, payload)
      } else {
        await addCareerHistory(payload)
      }
      showCareerForm.value = false
      editingCareer.value = null
    }
  )
}

const handleDeleteCareer = async (id: string) => {
  if (!confirm('Yakin ingin menghapus riwayat karier ini?')) return
  await runAction('Riwayat karier berhasil dihapus.', async () => {
    await deleteCareerHistory(id)
  })
}

const openEditCareer = (career: CareerHistory) => {
  editingCareer.value = career
  showCareerForm.value = true
}

const cancelCareerForm = () => {
  showCareerForm.value = false
  editingCareer.value = null
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

    <!-- Section Kelola Portofolio -->
    <div
      id="portfolio"
      class="mt-8 bg-white rounded-2xl border border-neutral-200 shadow-sm p-6 sm:p-8"
    >
      <div
        class="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 pb-5"
      >
        <div>
          <h2 class="text-xl font-bold text-secondary-900">
            Kelola Portofolio
          </h2>
          <p class="text-sm text-neutral-500 mt-1">
            Pilih maksimal 10 project selesai untuk ditampilkan sebagai karya
            unggulan di profil publikmu.
          </p>
        </div>
        <div
          class="shrink-0 flex items-center justify-center bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-2"
        >
          <span
            class="text-sm font-bold"
            :class="isPinLimitReached ? 'text-danger-600' : 'text-primary-600'"
          >
            {{ pinnedProjectIds.length }} / 10
          </span>
          <span class="text-sm text-neutral-500 ml-1.5 font-medium"
            >karya ditampilkan</span
          >
        </div>
      </div>

      <div
        v-if="completedProjects.length === 0"
        class="py-12 flex flex-col items-center justify-center text-center"
      >
        <div
          class="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400 mb-4"
        >
          <svg
            class="w-8 h-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
        </div>
        <h3 class="text-lg font-bold text-secondary-900 mb-2">
          Belum ada project selesai
        </h3>
        <p class="text-sm text-neutral-500 max-w-sm mb-6">
          Kamu belum memiliki project dengan status selesai. Selesaikan project
          terlebih dahulu untuk bisa menambahkannya ke portofolio.
        </p>
        <NuxtLink to="/projects/my-projects">
          <AtomicButton variant="primary"> Lihat Project Saya </AtomicButton>
        </NuxtLink>
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="project in completedProjects"
          :key="project.id"
          class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-neutral-100 bg-neutral-50/50 hover:border-neutral-200 transition-colors"
        >
          <div class="flex-1 min-w-0">
            <h4 class="font-bold text-secondary-900 truncate">
              {{ project.title }}
            </h4>
            <p
              class="text-xs text-neutral-500 mt-1 uppercase tracking-wider font-semibold"
            >
              {{ project.type?.replace('_', ' ') || 'Lainnya' }}
            </p>
          </div>

          <div class="shrink-0 flex items-center">
            <label
              class="relative inline-flex items-center cursor-pointer"
              :title="
                !pinnedProjectIds.includes(project.id) && isPinLimitReached
                  ? 'Batas maksimum 10 karya tercapai'
                  : ''
              "
            >
              <input
                type="checkbox"
                class="sr-only peer"
                :checked="pinnedProjectIds.includes(project.id)"
                :disabled="
                  !pinnedProjectIds.includes(project.id) && isPinLimitReached
                "
                @change="
                  handleTogglePin(
                    project.id,
                    pinnedProjectIds.includes(project.id)
                  )
                "
              />
              <div
                class="w-11 h-6 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"
                :class="{
                  'opacity-50 cursor-not-allowed':
                    !pinnedProjectIds.includes(project.id) && isPinLimitReached
                }"
              ></div>
              <span
                class="ml-3 text-sm font-medium"
                :class="
                  pinnedProjectIds.includes(project.id)
                    ? 'text-primary-700'
                    : 'text-neutral-500'
                "
              >
                {{
                  pinnedProjectIds.includes(project.id)
                    ? 'Ditampilkan'
                    : 'Sembunyikan'
                }}
              </span>
            </label>
          </div>
        </div>
      </div>
    </div>

    <!-- Section Riwayat Karier -->
    <div
      id="career"
      class="mt-8 bg-white rounded-2xl border border-neutral-200 shadow-sm p-6 sm:p-8"
    >
      <div
        class="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 pb-5"
      >
        <div>
          <h2 class="text-xl font-bold text-secondary-900">Riwayat Karier</h2>
          <p class="text-sm text-neutral-500 mt-1">
            Tambahkan pengalaman kerja atau riwayat karier profesionalmu.
          </p>
        </div>
        <AtomicButton
          variant="primary"
          @click="
            () => {
              editingCareer = null
              showCareerForm = true
            }
          "
        >
          + Tambah Riwayat
        </AtomicButton>
      </div>

      <div v-if="careerHistories.length === 0" class="py-10 text-center">
        <p class="text-sm text-neutral-500">
          Belum ada riwayat karier yang ditambahkan.
        </p>
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="career in careerHistories"
          :key="career.id"
          class="p-5 rounded-xl border border-neutral-100 hover:border-neutral-200 transition-colors group relative"
        >
          <div
            class="flex flex-col sm:flex-row sm:items-start justify-between gap-4"
          >
            <div>
              <h4 class="font-bold text-secondary-900 text-lg">
                {{ career.title }}
              </h4>
              <p class="text-sm font-semibold text-neutral-700 mb-2">
                {{ career.company }}
              </p>
              <span
                class="inline-block text-xs font-semibold text-neutral-500 bg-neutral-100 px-2.5 py-1 rounded-md mb-3"
              >
                {{ career.start_year }} - {{ career.end_year || 'Sekarang' }}
              </span>
              <p
                v-if="career.description"
                class="text-sm text-neutral-600 line-clamp-2"
              >
                {{ career.description }}
              </p>
            </div>

            <div
              class="flex items-center gap-2 shrink-0 sm:opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <button
                @click="openEditCareer(career)"
                class="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                title="Edit"
              >
                <svg
                  class="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
              </button>
              <button
                @click="career.id && handleDeleteCareer(career.id)"
                class="p-2 text-danger-600 hover:bg-danger-50 rounded-lg transition-colors"
                title="Hapus"
              >
                <svg
                  class="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Career Form Modal -->
    <OrganismModal v-model="showCareerForm" size="lg">
      <template #description>
        <h3 class="text-xl font-bold text-secondary-900 mb-4">
          {{ editingCareer ? 'Edit Riwayat Karier' : 'Tambah Riwayat Karier' }}
        </h3>
      </template>
      <CareerHistoryForm
        :initial-data="editingCareer"
        :loading="isActionLoading"
        @save="handleSaveCareer"
        @cancel="cancelCareerForm"
      />
    </OrganismModal>
  </div>
</template>
