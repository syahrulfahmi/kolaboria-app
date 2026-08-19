<script setup lang="ts">
import { ref, computed } from 'vue'
import type {
  Profile,
  TalentProfile,
  UserSkill,
  UserTool
} from '../../../types/profile'
import type { Skill, Tool } from '../../../types/skill'
import type { CareerHistory } from '~/composables/useCareer'

definePageMeta({
  layout: 'home',
  middleware: ['auth', 'onboarding-guard']
})

const route = useRoute()

const { getProfile, getTalentProfile } = useProfile()
const { getUserSkills, getUserTools } = useSkill()
const { getCompletedProjects, getPinnedProjectIds } = usePortfolio()
const { getCareerHistories } = useCareer()

const profile = ref<Profile | null>(null)
const talentProfile = ref<TalentProfile | null>(null)
const userSkills = ref<UserSkill[]>([])
const userTools = ref<UserTool[]>([])
const completedProjects = ref<any[]>([])
const pinnedProjectIds = ref<string[]>([])
const careerHistories = ref<CareerHistory[]>([])

const pageRef = ref<any>(null)

const isDirty = computed(() => pageRef.value?.isDirty ?? false)
const isSaving = computed(() => pageRef.value?.isSaving ?? false)

const { triggerCancel } = useFormGuard(() => isDirty.value)

const onSave = () => {
  pageRef.value?.handleSave?.()
}

const onCancel = () => {
  triggerCancel('/profile/me')
}

const loadEditableData = async () => {
  const p = await getProfile()
  if (!p)
    throw createError({
      statusCode: 404,
      statusMessage: 'Profile not found',
      fatal: true
    })

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
    completedProjects: completedProjs,
    pinnedProjectIds: pinnedIds,
    careerHistories: careers
  }
}

const { data, refresh } = await useAsyncData(
  'profile-edit-me',
  loadEditableData
)

if (data.value) {
  profile.value = data.value.profile
  talentProfile.value = data.value.talentProfile
  userSkills.value = data.value.userSkills
  userTools.value = data.value.userTools
  completedProjects.value = data.value.completedProjects
  pinnedProjectIds.value = data.value.pinnedProjectIds
  careerHistories.value = data.value.careerHistories
}

const refreshEditableData = async () => {
  await refresh()
  if (data.value) {
    profile.value = data.value.profile
    talentProfile.value = data.value.talentProfile
    userSkills.value = data.value.userSkills
    userTools.value = data.value.userTools
    completedProjects.value = data.value.completedProjects
    pinnedProjectIds.value = data.value.pinnedProjectIds
    careerHistories.value = data.value.careerHistories
  }
}

useHead({
  title: 'Edit Profil - Kolaboria'
})

// Navigation Tabs
const tabs = [
  { name: 'Dasar', path: '/profile/me/edit/basic', icon: 'user' },
  { name: 'Skills & Tools', path: '/profile/me/edit/skills', icon: 'code' },
  { name: 'Portofolio', path: '/profile/me/edit/portfolio', icon: 'briefcase' },
  {
    name: 'Riwayat Karier',
    path: '/profile/me/edit/career',
    icon: 'academic-cap'
  }
]

const currentPath = computed(() => route.path)

const activeTabIndex = computed({
  get() {
    return tabs.findIndex((tab) => route.path === tab.path)
  },
  set(index) {
    const tab = tabs[index]
    if (tab) {
      navigateTo(tab.path)
    }
  }
})

const contentListItems = computed(() =>
  tabs.map((tab) => ({
    label: tab.name,
    icon: tab.icon
  }))
)
</script>

<template>
  <div class="mx-auto pb-8 relative">
    <!-- Header Mini Preview -->
    <div
      v-if="profile"
      class="mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-6 bg-white rounded-2xl border border-neutral-200 p-6"
    >
      <!-- Avatar -->
      <AtomicAvatar
        :src="profile.avatar"
        :name="profile.full_name || profile.username"
        :is-verified="profile.is_verified"
        class="h-16! w-16!"
      />
      <!-- Info Singkat -->
      <div class="flex-1 min-w-0">
        <h1 class="text-heading font-bold text-secondary-900 truncate">
          Edit Profil
        </h1>
        <p class="truncate mt-0.5">
          <span class="font-body-1">{{
            profile.full_name || profile.username
          }}</span>
          <span v-if="profile.full_name" class="text-neutral-400 mx-1.5"
            >•</span
          >
          <span v-if="profile.full_name" class="text-secondary">
            @{{ profile.username }}
          </span>
        </p>
      </div>
      <!-- Completion Score badge -->
      <div class="shrink-0 self-start sm:self-auto">
        <div class="flex flex-col items-end">
          <span class="font-label-2 mb-1">Kelengkapan</span>
          <div class="flex items-center gap-2">
            <div class="w-20 h-2 bg-neutral-100 rounded-full overflow-hidden">
              <div
                class="h-full bg-success-500 rounded-full transition-all duration-500"
                :style="{ width: `${profile.completion_score || 0}%` }"
              ></div>
            </div>
            <span
              class="font-label-1"
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

    <!-- Main Revamped Grid Layout -->
    <div class="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8 items-start">
      <!-- Sidebar / Navigation -->
      <aside class="w-full lg:sticky lg:top-[80px] lg:w-60 shrink-0 z-20">
        <!-- Desktop Sidebar (Content List) -->
        <OrganismContentList
          v-model="activeTabIndex"
          :items="contentListItems"
          mode="free"
          :sticky="false"
          class="hidden lg:block bg-white rounded-2xl overflow-hidden"
        />

        <!-- Mobile Horizontal Tab (Scrollable & Sticky) -->
        <nav
          class="flex lg:hidden sticky top-16 z-20 overflow-x-auto gap-2 py-3 px-4 sm:px-6 bg-neutral-50/95 backdrop-blur-md border-b border-neutral-200 -mx-4 sm:-mx-6 scrollbar-hide"
        >
          <NuxtLink
            v-for="tab in tabs"
            :key="tab.name"
            :to="tab.path"
            class="flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold shrink-0 shadow-sm border transition-all duration-150"
            :class="[
              currentPath === tab.path
                ? 'bg-primary-600 text-white border-primary-600'
                : 'bg-white text-neutral-600 border-neutral-200'
            ]"
          >
            {{ tab.name }}
          </NuxtLink>
        </nav>
      </aside>

      <!-- Main Nested Page Render -->
      <main class="w-full min-w-0">
        <NuxtPage v-slot="{ Component }" v-if="profile">
          <component
            :is="Component"
            ref="pageRef"
            :profile="profile"
            :talentProfile="talentProfile"
            :userSkills="userSkills"
            :userTools="userTools"
            :completedProjects="completedProjects"
            :pinnedProjectIds="pinnedProjectIds"
            :careerHistories="careerHistories"
            @update:userSkills="(val: any) => (userSkills = val)"
            @update:userTools="(val: any) => (userTools = val)"
            @refresh="refreshEditableData"
          />
        </NuxtPage>

        <!-- STICKY ACTION BAR -->
        <div
          v-if="pageRef"
          class="sticky bottom-6 z-30 mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end bg-white/95 backdrop-blur-sm p-4 rounded-2xl border border-neutral-200 shadow-[0_8px_30px_rgb(0,0,0,0.12)] animate-fade-in"
        >
          <AtomicButton
            type="button"
            variant="outline"
            class="w-full sm:w-auto hover:bg-neutral-50"
            :disabled="isSaving"
            @click="onCancel"
          >
            Batal
          </AtomicButton>
          <AtomicButton
            type="button"
            variant="primary"
            class="w-full sm:w-auto"
            :loading="isSaving"
            :disabled="isSaving"
            @click="onSave"
          >
            Simpan Perubahan
          </AtomicButton>
        </div>
      </main>
    </div>

    <MoleculeLoading
      v-if="isSaving"
      type="fullscreen"
      label="Menyimpan Perubahan..."
    />
  </div>
</template>

<style scoped>
/* Hide scrollbar for Chrome, Safari and Opera */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
/* Hide scrollbar for IE, Edge and Firefox */
.scrollbar-hide {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}
</style>
