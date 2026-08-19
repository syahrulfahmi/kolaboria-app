<script setup lang="ts">
import type { CreateProjectPayload } from '~/types/project'
import { SkillService } from '~/services/skill.service'

definePageMeta({ layout: 'home', middleware: ['auth', 'onboarding-guard'] })
useHead({ title: 'Buat Project — Kolaboria' })

const { createProject, publishProject } = useProjects()
const { getProfile } = useProfile()
const { isVerified } = useAuth()
const { tools, loadTools } = useSkill()
const router = useRouter()

const currentStep = ref(1)
const totalSteps = 4
const isSubmitting = ref(false)
const submitError = ref('')

const stepperSteps = [
  { title: 'Informasi Dasar', description: 'Isi detail utama project' },
  { title: 'Kebutuhan & Keahlian', description: 'Tentukan kontributor' },
  { title: 'Timeline & Komitmen', description: 'Jadwal dan komitmen' },
  { title: 'Review & Simpan', description: 'Tinjau kembali project' }
]

// Load data awal
const profile = ref<any>(null)
const skillTags = ref<{ id: string; name: string }[]>([])
const contributionRoles = ref<
  { id: string; name: string; slug: string; category?: string | null }[]
>([])

onMounted(async () => {
  profile.value = await getProfile()
  try {
    const skills = await SkillService.getSkills()
    skillTags.value = skills
    contributionRoles.value = skills
    await loadTools()
  } catch (err) {
    console.error('Failed to load project reference data:', err)
  }
})

const canPublish = computed(() => (profile.value?.completion_score ?? 0) >= 50)

// Form state
const form = reactive<CreateProjectPayload>({
  title: '',
  summary: '',
  description: '',
  project_category: 'product',
  visibility: 'public',
  max_slots: 3,
  start_date: undefined,
  deadline: undefined,
  tool_ids: [],
  why_join: '',
  skill_ids: [],
  roles: []
})

const stepValid = computed(() => {
  if (currentStep.value === 1)
    return form.title.trim().length > 0 && form.summary.trim().length > 0
  if (currentStep.value === 2) return true
  if (currentStep.value === 3) return true
  return true
})

const goNext = () => {
  if (stepValid.value && currentStep.value < totalSteps) currentStep.value++
}
const goBack = () => {
  if (currentStep.value > 1) currentStep.value--
}

const { show: showPopup } = usePopup()

const saveDraft = async () => {
  isSubmitting.value = true
  submitError.value = ''
  try {
    const project = await createProject(form)
    router.push(`/projects/${project.slug}`)
  } catch (e: any) {
    submitError.value = e?.message || 'Gagal menyimpan draft.'
  } finally {
    isSubmitting.value = false
  }
}

const confirmSaveDraft = () => {
  showPopup({
    title: 'Simpan sebagai Draft?',
    description:
      'Apakah Anda yakin ingin menyimpan project ini sebagai draft? Project baru akan dapat diakses secara publik setelah dipublikasikan.',
    type: 'info',
    positiveLabel: 'Ya, Simpan Draft',
    negativeLabel: 'Batal',
    onPositive: saveDraft
  })
}

const saveAndPublish = async () => {
  isSubmitting.value = true
  submitError.value = ''
  try {
    const project = await createProject(form)
    await publishProject(project.id)
    router.push(`/projects/${project.id}`)
  } catch (e: any) {
    submitError.value = e?.message || 'Gagal mempublikasikan project.'
  } finally {
    isSubmitting.value = false
  }
}

const confirmSaveAndPublish = () => {
  if (!canPublish.value) {
    submitError.value =
      'Completion score kamu belum mencapai 50%. Lengkapi profil terlebih dahulu.'
    return
  }

  showPopup({
    title: 'Publikasikan Project?',
    description:
      'Apakah Anda yakin ingin mempublikasikan project ini sekarang? Project akan langsung terlihat oleh publik dan siap menerima lamaran.',
    type: 'warning',
    positiveLabel: 'Ya, Publikasikan',
    negativeLabel: 'Batal',
    onPositive: saveAndPublish
  })
}
</script>

<template>
  <div class="mx-auto w-full max-w-7xl">
    <!-- Header -->
    <div class="mb-8">
      <NuxtLink
        to="/projects"
        class="mb-4 inline-flex items-center gap-2 text-sm font-medium text-neutral-500 transition hover:text-neutral-800"
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
        Kembali ke Project
      </NuxtLink>
      <h1 class="font-title-2">Buat Project Baru</h1>
      <p class="mt-2 font-paragraph-2 text-secondary">
        Isi detail project dan ajak talenta lain untuk berkolaborasi.
      </p>
    </div>

    <!-- Two-column Layout -->
    <div v-if="!isVerified" class="mt-8">
      <OrganismCard variant="outlined" class="text-center p-12">
        <h2 class="font-body-1 mb-2">Verifikasi Email Diperlukan</h2>
        <p class="font-paragraph-2 text-secondary mb-6">
          Anda harus memverifikasi email Anda terlebih dahulu sebelum dapat
          membuat proyek baru. Silakan periksa inbox Anda atau minta tautan
          verifikasi baru dari halaman utama.
        </p>
        <NuxtLink to="/home">
          <AtomicButton variant="primary">Kembali ke Beranda</AtomicButton>
        </NuxtLink>
      </OrganismCard>
    </div>

    <div v-else class="flex flex-col lg:flex-row gap-8">
      <!-- Sidebar Stepper -->
      <div class="lg:w-64 flex-shrink-0">
        <OrganismContentList
          :model-value="currentStep - 1"
          :items="
            stepperSteps.map((s, i) => ({
              label: s.title,
              description: s.description,
              completed: i < currentStep - 1
            }))
          "
          mode="stepper"
          @update:model-value="
            (val) => {
              if (val < currentStep) currentStep = val + 1
            }
          "
        />
      </div>

      <!-- Main Content -->
      <div class="flex-1">
        <!-- Step 1: Info Dasar -->
        <ProjectCreateStep1Info v-if="currentStep === 1" v-model:form="form" />

        <!-- Step 2: Skill & Kebutuhan -->
        <ProjectCreateStep2Requirements
          v-else-if="currentStep === 2"
          v-model:form="form"
          :skill-tags="skillTags"
          :contribution-roles="contributionRoles"
        />

        <!-- Step 3: Timeline -->
        <ProjectCreateStep3Timeline
          v-else-if="currentStep === 3"
          v-model:form="form"
        />

        <!-- Step 4: Review -->
        <ProjectCreateStep4Review
          v-else
          v-model:form="form"
          :profile="profile"
          :can-publish="canPublish"
          :submit-error="submitError"
          :is-submitting="isSubmitting"
          :skill-tags="skillTags"
          :tools="tools"
          :contribution-roles="contributionRoles"
        />

        <!-- Navigation - Sticky Floating Bar -->
        <div
          class="sticky bottom-6 z-30 mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end bg-white/95 backdrop-blur-sm p-4 rounded-2xl border border-neutral-200 shadow-[0_8px_30px_rgb(0,0,0,0.12)] animate-fade-in"
        >
          <template v-if="currentStep === totalSteps">
            <AtomicButton
              variant="outline"
              class="w-full sm:w-auto hover:bg-neutral-50"
              @click="goBack"
            >
              Kembali
            </AtomicButton>
            <AtomicButton
              variant="outline"
              class="w-full sm:w-auto hover:bg-neutral-50"
              :disabled="isSubmitting"
              @click="confirmSaveDraft"
            >
              Simpan sebagai Draft
            </AtomicButton>
            <AtomicButton
              variant="primary"
              class="w-full sm:w-auto"
              :disabled="isSubmitting || !canPublish"
              @click="confirmSaveAndPublish"
            >
              {{ isSubmitting ? 'Memproses...' : 'Publish Project Sekarang' }}
            </AtomicButton>
          </template>

          <template v-else>
            <AtomicButton
              v-if="currentStep > 1"
              variant="outline"
              class="w-full sm:w-auto hover:bg-neutral-50"
              @click="goBack"
            >
              Kembali
            </AtomicButton>
            <div v-else class="hidden sm:block" />
            <AtomicButton
              variant="primary"
              class="w-full sm:w-auto"
              :disabled="!stepValid"
              @click="goNext"
            >
              Lanjut
            </AtomicButton>
          </template>
        </div>
      </div>
    </div>

    <MoleculeLoading
      v-if="isSubmitting"
      type="fullscreen"
      label="Menyimpan Project..."
    />
  </div>
</template>
