<script setup lang="ts">
import { ref } from 'vue'

definePageMeta({
  layout: 'home',
  middleware: ['auth', 'onboarding-guard']
})

const { getProfile, getProfileWithRelations } = useProfile()

const profile = ref<any>(null)
const skills = ref<any[]>([])
const tools = ref<any[]>([])
const stats = ref<any>({
  project_joined: 0,
  project_completed: 0,
  contribution_score: 0
})
const talentProfile = ref<any>(null)

const { data, pending, error } = await useAsyncData(
  'profile-me',
  async () => {
    // 1. Fetch current user profile first to get the username
    const me = await getProfile()
    if (!me || !me.username) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Username not found in profile',
        fatal: true
      })
    }

    // 2. Fetch full profile relations using the username
    const res = await getProfileWithRelations(me.username)
    if (!res)
      throw createError({
        statusCode: 404,
        statusMessage: 'Profile not found',
        fatal: true
      })

    return res
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
    : 'Profil Saya - Kolaboria'
})
</script>

<template>
  <div class="min-h-screen bg-neutral-50 max-w-7xl">
    <div v-if="pending" class="flex min-h-screen items-center justify-center">
      <MoleculeLoading label="Memuat profil..." />
    </div>

    <div v-else-if="error" class="max-w-4xl mx-auto py-20 px-4 text-center">
      <h1 class="text-display text-secondary-900 mb-4">
        Gagal Memuat Profil
      </h1>
      <p class="text-body text-neutral-500 mb-8">
        Terjadi kesalahan saat memuat profil Anda.
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
      :is-owner="true"
    />
  </div>
</template>
