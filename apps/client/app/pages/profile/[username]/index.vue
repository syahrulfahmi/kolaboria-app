<script setup lang="ts">
import { ref, computed } from 'vue'

definePageMeta({
  layout: 'home'
})

const route = useRoute()
const username = route.params.username as string

const { getProfileByUsername, getTalentProfile } = useProfile()
const { getUserSkills } = useSkill()
const { getUserTools } = useTool()
const currentUser = useSupabaseUser()

const profile = ref<any>(null)
const skills = ref<any[]>([])
const tools = ref<any[]>([])
const stats = ref<any>({
  project_joined: 0,
  project_completed: 0,
  contribution_score: 0
})
const talentProfile = ref<any>(null)

const isOwner = computed(() => {
  return (
    currentUser.value &&
    profile.value &&
    currentUser.value.id === profile.value.id
  )
})

const { data, pending, error } = await useAsyncData(
  `profile-${username}`,
  async () => {
    const p = await getProfileByUsername(username)
    if (!p)
      throw createError({
        statusCode: 404,
        statusMessage: 'Profile not found',
        fatal: true
      })

    const [s, t, tp] = await Promise.all([
      getUserSkills(p.id),
      getUserTools(p.id),
      getTalentProfile(p.id)
    ])

    return { profile: p, skills: s, tools: t, talentProfile: tp }
  }
)

if (data.value) {
  profile.value = data.value.profile
  skills.value = data.value.skills
  tools.value = data.value.tools
  talentProfile.value = data.value.talentProfile
  if (data.value.talentProfile) {
    stats.value = {
      project_joined: data.value.talentProfile.project_count || 0,
      project_completed: data.value.talentProfile.completed_projects || 0,
      contribution_score: data.value.talentProfile.contribution_score || 0
    }
  }
}

useHead({
  title: profile.value
    ? `${profile.value.full_name || profile.value.username} - Kolaboria`
    : 'Profile - Kolaboria'
})
</script>

<template>
  <div class="min-h-screen bg-neutral-50 max-w-7xl">
    <div v-if="pending" class="flex min-h-screen items-center justify-center">
      <MoleculeLoading label="Memuat profil..." />
    </div>

    <div v-else-if="error" class="max-w-4xl mx-auto py-20 px-4 text-center">
      <h1 class="text-display text-secondary-900 mb-4">
        Profil Tidak Ditemukan
      </h1>
      <p class="text-body text-neutral-500 mb-8">
        Maaf, kami tidak dapat menemukan profil dengan username @{{ username }}.
      </p>
      <AtomicButton to="/" variant="primary">Kembali ke Beranda</AtomicButton>
    </div>

    <ProfileView
      v-else
      :profile="profile"
      :skills="skills"
      :tools="tools"
      :stats="stats"
      :talent-profile="talentProfile"
      :is-owner="isOwner"
    />
  </div>
</template>
