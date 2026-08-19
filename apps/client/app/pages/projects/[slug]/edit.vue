<script setup lang="ts">
import { ref, computed, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type {
  Project,
  CreateProjectPayload,
  ProjectStatus
} from '~/types/project'

import EditTabInfo from '~/components/project/edit/EditTabInfo.vue'
import EditTabRequirements from '~/components/project/edit/EditTabRequirements.vue'
import EditTabTimeline from '~/components/project/edit/EditTabTimeline.vue'
import EditTabStatus from '~/components/project/edit/EditTabStatus.vue'
import ProjectStatusConfirmModal from '~/components/project/ProjectStatusConfirmModal.vue'
import { WorkspaceService } from '~/services/workspace.service'

import { SkillService } from '~/services/skill.service'

definePageMeta({ layout: 'home', middleware: ['auth', 'onboarding-guard'] })

const route = useRoute()
const router = useRouter()
const {
  getProjectBySlug,
  updateProjectFull,
  publishProject,
  startProject,
  completeProject,
  archiveProject,
  getProjectApplicants
} = useProjects()
const { user, currentUserId } = useAuth()
const { add: addToast } = useToast()
const { tools, loadTools } = useSkill()

const projectSlug = route.params.slug as string
const project = ref<Project | null>(null)
const contributionRoles = ref<{ id: string; name: string; slug: string; category?: string | null }[]>([])
const pending = ref(true)
const isSubmitting = ref(false)

// Tab state
const activeTab = ref(0)
const tabs = [
  { label: 'Informasi Dasar' },
  { label: 'Kebutuhan & Keahlian' },
  { label: 'Timeline' },
  { label: 'Status & Publikasi' }
]

// Form state
const form = reactive<CreateProjectPayload>({
  title: '',
  summary: '',
  description: '',
  project_category: 'product',
  visibility: 'public',
  start_date: undefined,
  deadline: undefined,
  tool_ids: [],
  why_join: '',
  skill_ids: [],
  roles: []
})

// Modal state
const showConfirmModal = ref(false)
const confirmAction = ref<'open' | 'archived' | 'completed' | 'in_progress'>(
  'open'
)
const hasActiveApplicants = ref(false)
const deliverableCount = ref(0)

const hydrateForm = (source: Project) => {
  form.title = source.title
  form.summary = source.summary
  form.description = source.description || ''
  form.project_category = source.project_category
  form.visibility = source.visibility
  form.start_date = source.start_date
  form.deadline = source.deadline
  form.tool_ids = source.project_technologies?.map((item) => item.tool_id) || []
  form.why_join = source.why_join || ''
  form.skill_ids = source.project_skills?.map((skill) => skill.skill_tag_id) || []
  form.owner_contribution_role_id = source.owner_contribution_role_id || undefined
  form.owner_custom_role_title = source.owner_custom_role_title || undefined
  form.roles = source.project_roles
    ?.filter((role) => role.status !== 'archived')
    .map((role) => ({
      id: role.id,
      contribution_role_id: role.contribution_role_id || undefined,
      custom_title: role.custom_title || undefined,
      description: role.description || undefined,
      capacity: role.capacity,
      tool_ids: role.tools?.map((tool) => tool.id) || []
    })) || []
}

onMounted(async () => {
  try {
    const [p, skills] = await Promise.all([
      getProjectBySlug(projectSlug),
      SkillService.getSkills(),
      loadTools()
    ])

    if (!p) {
      addToast({ variant: 'danger', message: 'Project tidak ditemukan.' })
      router.push('/projects')
      return
    }

    if (!currentUserId.value || currentUserId.value !== p.creator_id) {
      addToast({
        variant: 'danger',
        message: 'Anda tidak memiliki akses untuk mengedit project ini.'
      })
      router.push(`/projects/${projectSlug}`)
      return
    }

    project.value = p
    deliverableCount.value = (await WorkspaceService.getDeliverables(p.id)).length
    contributionRoles.value = skills.filter(
      (skill) => skill.category !== 'Legacy project skill'
    )

    hydrateForm(p)

    // Check active applicants for archive warning
    if (p.status !== 'draft' && p.status !== 'archived') {
      const applicants = await getProjectApplicants(p.id)
      hasActiveApplicants.value = applicants.some(
        (a) => a.status === 'pending' || a.status === 'accepted'
      )
    }
  } catch (error: any) {
    addToast({
      variant: 'danger',
      message: error.message || 'Gagal memuat project.'
    })
  } finally {
    pending.value = false
  }
})

useHead({
  title: computed(() =>
    project.value
      ? `Edit ${project.value.title} - Kolaboria`
      : 'Edit Project - Kolaboria'
  )
})

const handleSave = async () => {
  if (!project.value) return
  isSubmitting.value = true

  try {
    const updatedProject = await updateProjectFull(project.value.id, form)
    const hasSlugChanged = updatedProject.slug !== projectSlug
    project.value = updatedProject
    hydrateForm(updatedProject)

    if (hasSlugChanged) {
      addToast({
        variant: 'success',
        message: 'Slug berhasil diperbarui! Redirecting...'
      })
      router.replace(`/projects/${updatedProject.slug}/edit`)
      return
    }

    if (project.value.status === 'draft') {
      addToast({
        variant: 'warning',
        message:
          'Perubahanmu tersimpan, tapi project belum bisa dilihat publik karena masih Draft. Publikasikan untuk membuatnya aktif.'
      })
    } else {
      addToast({ variant: 'success', message: 'Perubahan berhasil disimpan!' })
    }
  } catch (error: any) {
    addToast({
      variant: 'danger',
      message: error.message || 'Gagal menyimpan perubahan.'
    })
  } finally {
    isSubmitting.value = false
  }
}

const triggerStatusAction = (
  action: 'open' | 'archived' | 'completed' | 'in_progress'
) => {
  console.log(action)
  confirmAction.value = action
  showConfirmModal.value = true
}

const handleStatusConfirm = async () => {
  if (!project.value) return
  isSubmitting.value = true
  showConfirmModal.value = false

  try {
    if (confirmAction.value === 'open') {
      // Pastikan data terakhir tersimpan sebelum publish
      const updatedProject = await updateProjectFull(project.value.id, form)
      project.value = updatedProject
      hydrateForm(updatedProject)
      await publishProject(updatedProject.id)
      addToast({
        variant: 'success',
        message: 'Project berhasil dipublikasikan!'
      })
      router.push(`/projects/${updatedProject.slug}`)
    } else {
      if (confirmAction.value === 'in_progress') await startProject(project.value.id)
      if (confirmAction.value === 'completed') await completeProject(project.value.id)
      if (confirmAction.value === 'archived') await archiveProject(project.value.id)
      addToast({
        variant: 'success',
        message: 'Status project berhasil diperbarui!'
      })
      router.push('/projects/my-projects')
    }
  } catch (error: any) {
    addToast({
      variant: 'danger',
      message: error.message || 'Gagal memperbarui status.'
    })
    isSubmitting.value = false
  }
}

const isValid = computed(() => {
  return form.title.trim().length > 0 && form.summary.trim().length > 0
})
</script>

<template>
  <div class="min-h-screen bg-neutral-50 pb-20">
    <MoleculeLoading
      v-if="pending"
      type="fullscreen"
      label="Memuat data project..."
    />

    <div v-else-if="project" class="mx-auto w-full max-w-7xl py-8">
      <!-- Header -->
      <div class="mb-8">
        <NuxtLink
          :to="`/projects/${project.slug}`"
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
          Kembali ke Detail Project
        </NuxtLink>
        <div
          class="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div>
            <h1 class="font-title-2">Edit Project</h1>
            <p class="mt-2 font-paragraph-2 text-secondary">
              Perbarui informasi atau kelola status project
              <span class="font-bold text-secondary">{{ project.title }}</span
              >.
            </p>
          </div>
          <ProjectStatusBadge :status="project.status" />
        </div>
      </div>

      <div class="flex flex-col lg:flex-row gap-8">
        <!-- Sidebar Navigation -->
        <div class="lg:w-64 flex-shrink-0">
          <OrganismContentList v-model="activeTab" :items="tabs" mode="free" />
        </div>

        <!-- Main Content Form -->
        <div class="flex-1">
          <OrganismCard
            variant="elevated"
            class="border-0 shadow-lg shadow-neutral-200/50 p-6 sm:p-8"
          >
            <div class="mb-6 border-b border-neutral-100 pb-5">
              <h2 class="font-title-2">
                {{ tabs[activeTab]?.label }}
              </h2>
            </div>

            <!-- Tabs Content -->
            <KeepAlive>
              <EditTabInfo
                v-if="activeTab === 0"
                v-model:form="form"
                :current-slug="project?.slug"
              />
              <EditTabRequirements
                v-else-if="activeTab === 1"
                v-model:form="form"
                :contribution-roles="contributionRoles"
                :tools="tools"
              />
              <EditTabTimeline
                v-else-if="activeTab === 2"
                v-model:form="form"
              />
              <EditTabStatus
                v-else-if="activeTab === 3"
                :status="project.status"
                :is-submitting="isSubmitting"
                @action="triggerStatusAction"
              />
            </KeepAlive>
          </OrganismCard>

          <!-- Navigation - Sticky Floating Bar -->
          <div
            v-if="activeTab !== 3"
            class="sticky bottom-6 z-30 mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end bg-white/95 backdrop-blur-sm p-4 rounded-2xl border border-neutral-200 shadow-[0_8px_30px_rgb(0,0,0,0.12)] animate-fade-in"
          >
            <NuxtLink
              :to="`/projects/${project.slug}`"
              class="w-full sm:w-auto"
            >
              <AtomicButton
                variant="outline"
                class="w-full hover:bg-neutral-50"
              >
                Batal
              </AtomicButton>
            </NuxtLink>
            <AtomicButton
              variant="primary"
              class="w-full sm:w-auto"
              :disabled="isSubmitting || !isValid"
              @click="handleSave"
            >
              {{ isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan' }}
            </AtomicButton>
          </div>
        </div>
      </div>
    </div>

    <!-- Confirmation Modal -->
    <ProjectStatusConfirmModal
      :show="showConfirmModal"
      :action="confirmAction"
      :project-title="project?.title || ''"
      :has-active-applicants="hasActiveApplicants"
      @close="showConfirmModal = false"
      @confirm="handleStatusConfirm"
    />

    <MoleculeLoading
      v-if="isSubmitting"
      type="fullscreen"
      label="Menyimpan Perubahan..."
    />
  </div>
</template>
