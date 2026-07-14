<script setup lang="ts">
import type { Project } from '../../../../types/project'
import type {
  CreateWorkspaceTaskPayload,
  Task,
  TaskStatus,
  UpdateTaskPayload
} from '../../../../types/workspace'

definePageMeta({ layout: 'home', middleware: ['auth', 'onboarding-guard'] })

const route = useRoute()
const router = useRouter()
const { user, currentUserId } = useAuth()
const { getProjectBySlug } = useProjects()
const toast = useToast()

const slug = computed(() => String(route.params.slug || ''))

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
  members,
  comments,
  loading,
  saving,
  commentsLoading
} = workspace

const isOwner = computed(() =>
  Boolean(
    currentUserId.value && project.value?.creator_id === currentUserId.value
  )
)

const isMember = computed(() => {
  if (isOwner.value) return true
  return Boolean(
    project.value?.project_members?.some(
      (member) => member.profile_id === currentUserId.value
    )
  )
})

const canOpenWorkspace = computed(
  () =>
    Boolean(project.value) &&
    ['in_progress', 'completed', 'archived'].includes(
      project.value?.status ?? ''
    )
)

// Task Detail & Creation State
const selectedTaskId = ref<string | null>(null)
const isDetailOpen = ref(false)
const isCreateOpen = ref(false)
const searchQuery = ref('')
const showStatusPopup = ref(false)

const isReadOnly = computed(
  () =>
    project.value?.status === 'completed' ||
    project.value?.status === 'archived'
)

const inactivePopupContent = computed(() => {
  if (project.value?.status === 'completed') {
    return {
      type: 'success' as const,
      title: 'Project Telah Selesai',
      description:
        'Project ini telah selesai dan ditutup. Terima kasih atas kontribusimu!'
    }
  }
  if (project.value?.status === 'archived') {
    return {
      type: 'warning' as const,
      title: 'Project Diarsipkan',
      description:
        'Project ini telah diarsipkan oleh pemiliknya. Board masih bisa dilihat namun tidak bisa dimodifikasi.'
    }
  }
  return null
})

const handleInactiveConfirm = () => {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.replace('/')
  }
}

const selectedTask = computed(() => {
  if (!selectedTaskId.value) return null
  return (
    workspace.tasks.value.find((t) => t.id === selectedTaskId.value) ?? null
  )
})

const createForm = reactive<CreateWorkspaceTaskPayload>({
  title: '',
  description: '',
  assignee_id: null,
  due_date: null,
  status: 'todo'
})

const assigneeOptions = computed(() => [
  { label: 'Tidak ada assignee', value: '' },
  ...members.value.map((member) => ({
    label: member.full_name || member.username,
    value: member.id
  }))
])

const filteredTasks = computed<Record<TaskStatus, Task[]>>(() => {
  const q = searchQuery.value.toLowerCase().trim()
  if (!q) return tasksByStatus.value

  const filterList = (list: Task[]) =>
    list.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        (t.description && t.description.toLowerCase().includes(q))
    )

  return {
    todo: filterList(tasksByStatus.value.todo),
    in_progress: filterList(tasksByStatus.value.in_progress),
    review: filterList(tasksByStatus.value.review),
    done: filterList(tasksByStatus.value.done)
  }
})

const handleTaskClick = (task: Task) => {
  selectedTaskId.value = task.id
  isDetailOpen.value = true
  workspace.fetchTaskComments(task.id)
}

const openCreateModal = (status: TaskStatus) => {
  createForm.title = ''
  createForm.description = ''
  createForm.assignee_id = null
  createForm.due_date = null
  createForm.status = status
  isCreateOpen.value = true
}

const submitCreate = async () => {
  const title = createForm.title.trim()
  if (!title) return

  try {
    await workspace.createTask({
      title,
      description: createForm.description?.trim() || null,
      assignee_id: createForm.assignee_id || null,
      due_date: createForm.due_date || null,
      status: createForm.status
    })
    isCreateOpen.value = false
  } catch (err) {
    // Handled in composable toast
  }
}

const handleUpdateTask = async (taskId: string, payload: UpdateTaskPayload) => {
  await workspace.updateTask(taskId, payload)
}

const handleDeleteTask = async (taskId: string) => {
  await workspace.deleteTask(taskId)
  if (selectedTaskId.value === taskId) {
    selectedTaskId.value = null
    isDetailOpen.value = false
  }
}

const handleCommentSubmit = async (taskId: string, body: string) => {
  await workspace.addComment(taskId, body)
}

const handleCommentUpdate = async (commentId: string, body: string) => {
  await workspace.updateComment(commentId, body)
}

const handleCommentDelete = async (commentId: string) => {
  await workspace.deleteComment(commentId)
}

const handleCommentsRefresh = async (taskId: string) => {
  await workspace.fetchTaskComments(taskId)
}

watch(
  [project, currentUserId],
  async ([currentProject, id]) => {
    if (!currentProject || !id) return

    // Tampilkan popup informatif jika project sudah tidak aktif
    if (
      currentProject.status === 'completed' ||
      currentProject.status === 'archived'
    ) {
      showStatusPopup.value = true
      try {
        await workspace.refreshWorkspace(currentProject.creator_id)
      } catch {}
      return
    }

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
  <div class="h-[calc(100vh-64px)] flex flex-col bg-neutral-50 overflow-hidden">
    <MoleculeLoading v-if="pending" label="Memuat workspace..." class="py-20" />

    <template v-else-if="project">
      <WorkspacePageHeader
        :project="project"
        :tasks="tasksByStatus"
        :is-owner="isOwner && !isReadOnly"
        :is-submitting="saving"
        @create-task-click="openCreateModal('todo')"
        @search-change="searchQuery = $event"
      />

      <div class="flex-1 flex overflow-hidden min-h-0 relative">
        <!-- Sidebar -->
        <WorkspaceSidebar
          :members="members"
          :activities="activities"
          :project-creator-id="project.creator_id"
          :loading="loading"
        />

        <!-- Empty State if not started -->
        <div
          v-if="!canOpenWorkspace"
          class="flex-1 flex items-center justify-center p-8 bg-white"
        >
          <OrganismEmptyState
            title="Workspace belum aktif"
            description="Project perlu dimulai terlebih dahulu sebelum board dan activity workspace dapat digunakan."
            icon="folder"
          />
        </div>

        <!-- Kanban Board Area -->
        <template v-else>
          <WorkspaceBoard
            class="flex-1 h-full min-h-0"
            :tasks="filteredTasks"
            :members="members"
            :is-owner="isOwner && !isReadOnly"
            :selected-task-id="selectedTaskId"
            @task-create="openCreateModal"
            @task-click="handleTaskClick"
          />

          <!-- Task Detail Pane -->
          <WorkspaceTaskDetailPane
            :is-open="isDetailOpen"
            :task="selectedTask"
            :members="workspace.members.value"
            :comments="workspace.comments.value"
            :comments-loading="workspace.commentsLoading.value"
            :saving="workspace.saving.value"
            :is-owner="isOwner"
            :current-user-id="currentUserId || ''"
            @close="
              () => {
                isDetailOpen = false
                selectedTaskId = null
              }
            "
            @update="handleUpdateTask"
            @delete="handleDeleteTask"
            @comment-submit="handleCommentSubmit"
            @comment-update="handleCommentUpdate"
            @comment-delete="handleCommentDelete"
            @comments-refresh="handleCommentsRefresh"
          />

          <MoleculeLoading
            v-if="workspace.saving.value"
            type="fullscreen"
            label="Menyimpan Task..."
          />
        </template>
      </div>

      <!-- Creation Modal -->
      <OrganismModal
        v-model="isCreateOpen"
        title="Buat Task Baru"
        size="xl"
        primary-label="Buat Task"
        secondary-label="Batal"
        :primary-loading="saving"
        :primary-disabled="saving || createForm.title.trim().length === 0"
        @on-primary-click="submitCreate"
        @on-secondary-click="isCreateOpen = false"
      >
        <div class="grid gap-4 md:grid-cols-2">
          <MoleculeInputField
            v-model="createForm.title"
            label="Judul"
            required
            :disabled="saving"
          />

          <MoleculeDropdown
            v-model="createForm.status"
            label="Status"
            :options="[
              { label: 'Todo', value: 'todo' },
              { label: 'In Progress', value: 'in_progress' },
              { label: 'Review', value: 'review' },
              { label: 'Done', value: 'done' }
            ]"
            :disabled="saving"
          />

          <MoleculeDropdown
            v-model="createForm.assignee_id"
            label="Ditugaskan kepada"
            :options="assigneeOptions"
            :disabled="saving"
            searchable
          />

          <MoleculeDatePicker
            :model-value="
              createForm.due_date ? new Date(createForm.due_date) : null
            "
            @update:model-value="
              createForm.due_date = $event
                ? `${($event as Date).getFullYear()}-${String(($event as Date).getMonth() + 1).padStart(2, '0')}-${String(($event as Date).getDate()).padStart(2, '0')}`
                : null
            "
            label="Target Selesai"
            :disabled="saving"
          />

          <MoleculeTextarea
            :model-value="createForm.description ?? undefined"
            @update:model-value="
              createForm.description = $event ? String($event) : null
            "
            label="Deskripsi"
            :rows="4"
            :disabled="saving"
            class="md:col-span-2"
          />
        </div>
      </OrganismModal>

      <!-- Status Inactive Popup -->
      <OrganismPopup
        v-if="inactivePopupContent"
        v-model="showStatusPopup"
        :type="inactivePopupContent.type"
        :title="inactivePopupContent.title"
        :description="inactivePopupContent.description"
        positive-label="Mengerti"
        :show-close="false"
        :persistent="true"
        @positive="handleInactiveConfirm"
      />
    </template>

    <div v-else class="mx-auto max-w-4xl px-4 py-20">
      <OrganismEmptyState
        title="Project tidak ditemukan"
        description="Project yang kamu cari tidak tersedia atau sudah tidak bisa diakses."
        icon="search"
      />
    </div>
  </div>
</template>
