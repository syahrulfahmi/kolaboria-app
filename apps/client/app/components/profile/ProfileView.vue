<script setup lang="ts">
import type {
  ContributionStats,
  Profile,
  TalentProfile,
  UserSkill,
  UserTool
} from '../../types/profile'

const props = defineProps<{
  profile: Profile
  skills: UserSkill[]
  tools: UserTool[]
  stats: ContributionStats
  talentProfile?: TalentProfile | null
  isOwner: boolean
}>()

const client = useSupabaseClient<any>()

const { data: projects } = await useAsyncData(`portfolio-${props.profile.id}`, async () => {
  const { data, error } = await client
    .from('portfolio_projects')
    .select('project_id, projects(id, title, description, slug, status, type)')
    .eq('user_id', props.profile.id)
    .order('pinned_at', { ascending: false })
    
  if (error) {
    console.error('Error fetching projects:', error)
    return []
  }
  return data?.map((d: any) => d.projects).filter(Boolean) || []
})

const { data: careerJourneys } = await useAsyncData(`career-${props.profile.id}`, async () => {
  const { data, error } = await client
    .from('career_histories')
    .select('*')
    .eq('user_id', props.profile.id)
    .order('start_year', { ascending: false })
    
  if (error) {
    console.error('Error fetching career histories:', error)
    return []
  }
  return data || []
})
</script>

<template>
  <div class="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
    <ProfileHeader 
      :profile="profile" 
      :stats="stats"
      :is-owner="isOwner" 
    />

    <div class="mt-6 grid gap-6 lg:grid-cols-[1fr_2fr] items-start">
      <!-- Sidebar Kiri (1fr) -->
      <aside class="space-y-6">
        <ProfileBioSection
          :bio="profile.bio"
          :goal="talentProfile?.goal"
          :username="profile.username"
          :is-owner="isOwner"
          :external-links="profile.external_links"
          :experience-level="talentProfile?.experience_level"
        />
        <ProfileSkillSection 
          :skills="skills" 
          :tools="tools"
        />
      </aside>

      <!-- Konten Utama Kanan (2fr) -->
      <main class="space-y-6">
        <ProfileProjectsSection 
          :projects="projects || []" 
          :is-owner="isOwner"
          :username="profile.username"
        />
        <ProfileCareerSection 
          :career-journeys="careerJourneys" 
          :is-owner="isOwner"
          :username="profile.username"
        />
      </main>
    </div>
  </div>
</template>
