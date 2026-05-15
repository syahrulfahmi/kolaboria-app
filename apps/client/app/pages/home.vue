<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { Profile, UserSkill, UserTool } from '../types/profile'

definePageMeta({
  layout: 'home',
  middleware: 'auth'
})

useHead({
  title: 'Home - Kolaboria'
})

const { getProfile, getChecklist } = useProfile()
const { getUserSkills } = useSkill()
const { getUserTools } = useTool()
const { resendVerification } = useAuth()
const { success, error: showError } = useToast()
const user = useSupabaseUser()

const isResending = ref(false)

const profile = ref<Profile | null>(null)
const skills = ref<UserSkill[]>([])
const tools = ref<UserTool[]>([])
const checklist = ref<ReturnType<typeof getChecklist>>([])
const isLoading = ref(true)
const loadError = ref('')

const primarySkill = computed(() =>
  skills.value.find((skill) => skill.is_primary)
)

const fetchAllData = async () => {
  isLoading.value = true
  loadError.value = ''

  try {
    profile.value = await getProfile()

    if (user.value) {
      const [userSkills, userTools] = await Promise.all([
        getUserSkills(user.value.id),
        getUserTools(user.value.id)
      ])

      skills.value = userSkills
      tools.value = userTools
      checklist.value = getChecklist(profile.value, userSkills, userTools)
    }
  } catch (error: any) {
    loadError.value = error?.message || 'Gagal memuat dashboard.'
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchAllData)

const handleResendEmail = async () => {
  if (isResending.value) return
  isResending.value = true
  
  try {
    await resendVerification()
    success('Email verifikasi telah dikirim ulang. Silakan periksa inbox Anda.')
    // Cooldown 60 detik
    setTimeout(() => {
      isResending.value = false
    }, 60000)
  } catch (err: any) {
    showError(err.message || 'Gagal mengirim ulang email.')
    isResending.value = false
  }
}
</script>

<template>
  <div class="mx-auto max-w-7xl">
    <MoleculeLoading
      v-if="isLoading"
      text="Memuat dashboard..."
      class="py-16"
    />

    <OrganismCard v-else-if="loadError" variant="outlined" class="mt-6">
      <div class="text-center">
        <h1 class="text-title text-secondary-900">
          Dashboard belum bisa dimuat
        </h1>
        <p class="mt-2 text-body text-neutral-600">{{ loadError }}</p>
        <AtomicButton class="mt-5" variant="primary" @click="fetchAllData">
          Coba lagi
        </AtomicButton>
      </div>
    </OrganismCard>

    <OrganismCard v-else-if="!profile" variant="outlined" class="mt-6">
      <div class="text-center">
        <h1 class="text-title text-secondary-900">Profil belum tersedia</h1>
        <p class="mt-2 text-body text-neutral-600">
          Kami belum menemukan data profil untuk akun ini.
        </p>
      </div>
    </OrganismCard>

    <template v-else>
      <div class="space-y-8 fade-in-up delay-100">
        <HomeVerificationBanner
          v-if="!profile.is_verified"
          :is-verified="profile.is_verified"
          @resend="handleResendEmail"
        />

        <HomeGreeting
          :name="profile.full_name || profile.username"
          :is-verified="profile.is_verified"
          :headline="profile.headline"
          :completion-score="profile.completion_score"
          :primary-skill-name="primarySkill?.skills?.name"
        />
      </div>

      <div
        class="mt-8 grid gap-6 lg:grid-cols-[1.35fr_0.9fr] fade-in-up delay-200"
      >
        <HomeCompletionWidget
          :score="profile.completion_score"
          :completed-items="checklist"
          :username="profile.username"
        />

        <HomeActionButtons
          :is-verified="profile.is_verified"
          :completion-score="profile.completion_score"
          :username="profile.username"
          @resend="handleResendEmail"
        />
      </div>

      <div class="mt-12 fade-in-up delay-300">
        <HomeProjectDiscovery />
      </div>
    </template>
  </div>
</template>

<style scoped>
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in-up {
  animation: fadeInUp 0.4s ease-out both;
}

.delay-100 {
  animation-delay: 100ms;
}

.delay-200 {
  animation-delay: 200ms;
}

.delay-300 {
  animation-delay: 300ms;
}
</style>
