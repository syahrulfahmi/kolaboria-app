<script setup lang="ts">
import type { Project } from '../../../../types/project'
import type {
  CreateWorkspaceTaskPayload,
  ReorderTaskUpdate,
  UpdateTaskPayload
} from '../../../../types/workspace'

definePageMeta({ layout: 'home', middleware: 'auth' })

const route = useRoute()
const router = useRouter()
const user = useSupabaseUser()
const { getProjectBySlug } = useProjects()
const toast = useToast()

const slug = computed(() => String(route.params.slug || ''))
const boardRef = ref<HTMLElement | null>(null)

const { data: project, pending } = await useAsyncData<Project | null>(
  () => `project-workspace-${slug.value}`,
  () => getProjectBySlug(slug.value),
  { watch: [slug] }
)

const projectId = computed(() => project.value?.id)
const workspace = useWorkspace(projectId)
const {
  tasksByStatus,
  activities,
  overview,
  members,
  comments,
  loading,
  saving,
  commentsLoading
} = workspace

const isOwner = computed(() =>
  Boolean(user.value?.id && project.value?.creator_id === user.value.id)
)

const isMember = computed(() => {
  if (isOwner.value) return true
  return Boolean(
    project.value?.project_members?.some(
      (member) => member.profile_id === user.value?.id
    )
  )
})

const canOpenWorkspace = computed(
  () => Boolean(project.value) && project.value?.status === 'in_progress'
)

const scrollToBoard = () => {
  boardRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const handleCreateTask = async (payload: CreateWorkspaceTaskPayload) => {
  await workspace.createTask(payload)
}

const handleReorderTasks = async (updates: ReorderTaskUpdate[]) => {
  await workspace.reorderTasks(updates)
}

const handleUpdateTask = async (taskId: string, payload: UpdateTaskPayload) => {
  await workspace.updateTask(taskId, payload)
}

const handleDeleteTask = async (taskId: string) => {
  await workspace.deleteTask(taskId)
}

const handleCommentSubmit = async (taskId: string, body: string) => {
  await workspace.addComment(taskId, body)
}

const handleCommentsRefresh = async (taskId: string) => {
  await workspace.fetchTaskComments(taskId)
}

watch(
  [project, user],
  async ([currentProject, currentUser]) => {
    if (!currentProject) return
    if (!currentUser?.id) return

    if (currentProject.status !== 'in_progress') return

    if (!isMember.value) {
      toast.error('Kamu tidak memiliki akses ke workspace project ini.')
      await router.replace(`/projects/${slug.value}`)
      return
    }

    try {
      await workspace.refreshWorkspace(currentProject.creator_id)
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Gagal memuat workspace.'
      toast.error(message)
    }
  },
  { immediate: true }
)
</script>

<template>
  <div class="min-h-screen bg-neutral-50 pb-16">
    <MoleculeLoading v-if="pending" label="Memuat workspace..." class="py-20" />

    <main
      v-else-if="project"
      class="mx-auto flex max-w-7xl flex-col gap-8 pb-8"
    >
      <section class="rounded-lg border border-neutral-200 bg-white p-6">
        <div
          class="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"
        >
          <div>
            <div
              class="flex flex-wrap items-center gap-2 text-caption text-neutral-500"
            >
              <NuxtLink
                :to="isOwner ? '/projects/my-projects' : '/projects/my-applications'"
                class="font-semibold text-primary-700 hover:text-primary-800"
              >
                {{ isOwner ? 'Project Saya' : 'Lamaran Saya' }}
              </NuxtLink>
              <span>/</span>
              <NuxtLink
                :to="`/projects/${project.slug}`"
                class="font-semibold text-primary-700 hover:text-primary-800"
              >
                {{ project.title }}
              </NuxtLink>
              <span>/ Workspace</span>
            </div>

            <h1 class="mt-4 text-display text-secondary-900">
              {{ project.title }}
            </h1>
            <p class="mt-3 max-w-3xl text-body text-neutral-600">
              {{ project.summary }}
            </p>
          </div>

          <ProjectStatusBadge :status="project.status" size="sm" />
        </div>
      </section>

      <OrganismEmptyState
        v-if="!canOpenWorkspace"
        title="Workspace belum aktif"
        description="Project perlu dimulai terlebih dahulu sebelum board dan activity workspace dapat digunakan."
        icon="folder"
      />

      <template v-else>
        <WorkspaceOverview
          :overview="overview"
          @scroll-to-board="scrollToBoard"
        />

        <section ref="boardRef">
          <WorkspaceBoard
            :tasks="tasksByStatus"
            :members="members"
            :comments="comments"
            :comments-loading="commentsLoading"
            :saving="saving"
            :is-owner="isOwner"
            @task-create="handleCreateTask"
            @tasks-reorder="handleReorderTasks"
            @task-update="handleUpdateTask"
            @task-delete="handleDeleteTask"
            @comment-submit="handleCommentSubmit"
            @comments-refresh="handleCommentsRefresh"
          />
        </section>

        <WorkspaceActivityFeed :logs="activities" :loading="loading" />
      </template>
    </main>

    <main v-else class="mx-auto max-w-4xl px-4 py-20">
      <OrganismEmptyState
        title="Project tidak ditemukan"
        description="Project yang kamu cari tidak tersedia atau sudah tidak bisa diakses."
        icon="search"
      />
    </main>
  </div>
</template>
