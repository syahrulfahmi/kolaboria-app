<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type {
  Profile,
  TalentProfile,
  UserSkill,
  UserTool
} from '../../../types/profile'
import type { CareerHistory } from '~/composables/useCareer'
import {
  canShowProfileEditActions,
  PROFILE_EDIT_MENU_ITEMS,
  PROFILE_EDIT_ROOT_PATH
} from '~/data/profile-edit-navigation'

definePageMeta({
  layout: 'home',
  middleware: ['auth', 'onboarding-guard'],
  homeNavbar: {
    variant: 'back-path',
    title: 'Edit Profil'
  }
})

const route = useRoute()
const hasFlushHomeContent = computed(
  () => route.meta.homeNavbar?.mainHorizontalPadding === 'none'
)

const { getProfile, getTalentProfile } = useProfile()
const { getUserSkills, getUserTools } = useSkill()
const { getCareerHistories } = useCareer()

const profile = ref<Profile | null>(null)
const talentProfile = ref<TalentProfile | null>(null)
const userSkills = ref<UserSkill[]>([])
const userTools = ref<UserTool[]>([])
const careerHistories = ref<CareerHistory[]>([])
const isEditMenu = computed(() => route.path === PROFILE_EDIT_ROOT_PATH)

interface EditablePageHandle {
  isDirty?: boolean
  isSaving?: boolean
  handleSave?: () => void
  handleCancel?: () => void
}
const pageRef = ref<EditablePageHandle | null>(null)

const isDirty = computed(() => pageRef.value?.isDirty ?? false)
const isSaving = computed(() => pageRef.value?.isSaving ?? false)
const showSaveActions = computed(() =>
  canShowProfileEditActions(route.path, pageRef.value !== null)
)

const { triggerCancel } = useFormGuard(() => isDirty.value)

const onSave = () => {
  pageRef.value?.handleSave?.()
}

const onCancel = () => {
  triggerCancel('/profile/me')
}

interface EditableData {
  profile: Profile
  talentProfile: TalentProfile | null
  userSkills: UserSkill[]
  userTools: UserTool[]
  careerHistories: CareerHistory[]
}

const loadEditableData = async (): Promise<EditableData | null> => {
  const section = PROFILE_EDIT_MENU_ITEMS.find(
    (item) => item.path === route.path
  )
  if (!section) return null

  const p = await getProfile()
  if (!p)
    throw createError({
      statusCode: 404,
      statusMessage: 'Profile not found',
      fatal: true
    })

  let talent: TalentProfile | null = null
  let skills: UserSkill[] = []
  let tools: UserTool[] = []
  let careers: CareerHistory[] = []

  switch (section.key) {
    case 'basic':
      talent = await getTalentProfile(p.id)
      break
    case 'skills':
      ;[skills, tools] = await Promise.all([
        getUserSkills(p.id),
        getUserTools(p.id)
      ])
      break
    case 'career':
      careers = await getCareerHistories(p.id)
      break
  }

  return {
    profile: p,
    talentProfile: talent,
    userSkills: skills,
    userTools: tools,
    careerHistories: careers
  }
}

const applyEditableData = (editableData: EditableData | null) => {
  profile.value = editableData?.profile ?? null
  talentProfile.value = editableData?.talentProfile ?? null
  userSkills.value = editableData?.userSkills ?? []
  userTools.value = editableData?.userTools ?? []
  careerHistories.value = editableData?.careerHistories ?? []
}

const { data } = await useAsyncData('profile-edit-me', loadEditableData, {
  watch: [() => route.path]
})

watch(data, applyEditableData, { immediate: true })

const refreshEditableData = async () => {
  applyEditableData(await loadEditableData())
}

useHead({
  title: 'Edit Profil - Kolaboria'
})

const activeTabIndex = computed({
  get() {
    return PROFILE_EDIT_MENU_ITEMS.findIndex((tab) => route.path === tab.path)
  },
  set(index) {
    const tab = PROFILE_EDIT_MENU_ITEMS[index]
    if (tab) {
      navigateTo(tab.path)
    }
  }
})

const contentListItems = computed(() =>
  PROFILE_EDIT_MENU_ITEMS.map((tab) => ({
    label: tab.label,
    icon: tab.icon
  }))
)
</script>

<template>
  <div
    class="relative mx-auto w-full"
    :class="isEditMenu ? 'pb-8' : 'flex flex-1 flex-col pb-0 lg:pb-8'"
  >
    <!-- Header Mini Preview -->
    <div
      v-if="profile && !isEditMenu"
      class="mb-8 hidden flex-col items-start gap-6 rounded-2xl border border-neutral-200 bg-white p-6 sm:flex-row sm:items-center lg:flex"
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
    <div
      class="grid flex-1 grid-cols-1 gap-8 lg:grid-cols-[300px_1fr]"
      :class="isEditMenu ? 'items-start' : 'items-stretch'"
    >
      <!-- Sidebar / Navigation -->
      <aside
        v-if="!isEditMenu"
        class="hidden w-full shrink-0 lg:sticky lg:top-[80px] lg:block lg:self-start"
      >
        <!-- Desktop Sidebar (Content List) -->
        <OrganismContentList
          v-model="activeTabIndex"
          :items="contentListItems"
          mode="free"
          :sticky="false"
          class="hidden lg:block bg-white rounded-2xl overflow-hidden"
        />
      </aside>

      <!-- Main Nested Page Render -->
      <main class="flex w-full min-w-0 flex-col">
        <NuxtPage v-slot="{ Component }">
          <component v-if="isEditMenu" :is="Component" ref="pageRef" />
          <component
            v-else-if="profile"
            :is="Component"
            ref="pageRef"
            :profile="profile"
            :talentProfile="talentProfile"
            :userSkills="userSkills"
            :userTools="userTools"
            :careerHistories="careerHistories"
            @update:userSkills="(val: UserSkill[]) => (userSkills = val)"
            @update:userTools="(val: UserTool[]) => (userTools = val)"
            @refresh="refreshEditableData"
          />
        </NuxtPage>

        <div v-if="showSaveActions" class="flex-1" aria-hidden="true" />

        <!-- STICKY ACTION BAR -->
        <div
          v-if="showSaveActions"
          class="sticky bottom-0 z-30 mt-6 flex items-center gap-2 border-t border-neutral-200 bg-white/95 px-4 py-3 backdrop-blur-sm animate-fade-in lg:bottom-6 lg:mx-0 lg:justify-end lg:gap-3 lg:rounded-2xl lg:border lg:p-4"
          :class="hasFlushHomeContent ? 'mx-0' : '-mx-4'"
        >
          <AtomicButton
            type="button"
            variant="outline"
            size="md"
            class="w-20 shrink-0 hover:bg-neutral-50 lg:w-auto lg:px-5 lg:py-2.5"
            :disabled="isSaving"
            @click="onCancel"
          >
            Batal
          </AtomicButton>
          <AtomicButton
            type="button"
            variant="primary"
            size="md"
            class="min-w-0 flex-1 lg:w-auto lg:flex-none lg:px-5 lg:py-2.5"
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
