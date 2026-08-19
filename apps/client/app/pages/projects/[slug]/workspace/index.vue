<script setup lang="ts">
import type { Project } from '../../../../types/project'
import type {
  CreateWorkspaceTaskPayload,
  DeliverablePayload,
  UpdateDeliverablePayload,
  Task,
  TaskStatus,
  UpdateTaskPayload
} from '../../../../types/workspace'

definePageMeta({ layout: 'home', middleware: ['auth', 'onboarding-guard'] })

const route = useRoute()
const router = useRouter()
const { user, currentUserId } = useAuth()
const {
  getProjectBySlug,
  leaveProject,
  updateMemberStatus,
  changeMemberRole
} = useProjects()
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
  overview,
  loading,
  saving,
  commentsLoading,
  error,
  deliverables,
  snapshots,
  finalizationStatus,
  createDeliverable,
  updateDeliverable,
  deleteDeliverable,
  refreshFinalization
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
        && member.status === 'active'
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
const isCollaborationOpen = ref(false)

const isReadOnly = computed(
  () =>
    project.value?.status === 'completed' ||
    project.value?.status === 'archived'
)

const handleCreateDeliverable = async (payload: DeliverablePayload) => {
  try {
    await createDeliverable(payload)
    await workspace.fetchActivities()
    toast.success('Deliverable berhasil ditambahkan.')
  } catch (err) {
    toast.error(err instanceof Error ? err.message : 'Gagal menambahkan deliverable.')
  }
}

const handleUpdateDeliverable = async (id: string, payload: UpdateDeliverablePayload) => {
  try {
    await updateDeliverable(id, payload)
    await workspace.fetchActivities()
    toast.success('Deliverable berhasil diperbarui.')
  } catch (err) {
    toast.error(err instanceof Error ? err.message : 'Gagal memperbarui deliverable.')
  }
}

const handleDeleteDeliverable = async (id: string) => {
  if (!window.confirm('Hapus deliverable ini?')) return
  try {
    await deleteDeliverable(id)
    await workspace.fetchActivities()
    toast.success('Deliverable dihapus.')
  } catch (err) {
    toast.error(err instanceof Error ? err.message : 'Gagal menghapus deliverable.')
  }
}

const handleRefreshFinalization = async () => {
  try {
    await refreshFinalization()
  } catch (err) {
    toast.error(err instanceof Error ? err.message : 'Gagal memuat status finalisasi.')
  }
}

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

const filteredTaskCount = computed(() =>
  Object.values(filteredTasks.value).reduce((sum, list) => sum + list.length, 0)
)

const workspaceMode = computed<'active' | 'not-started' | 'read-only'>(() => {
  if (!canOpenWorkspace.value) return 'not-started'
  if (isReadOnly.value) return 'read-only'
  return 'active'
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

const retryWorkspace = async () => {
  if (!project.value) return
  try {
    await workspace.refreshWorkspace(project.value.creator_id)
  } catch (retryError) {
    toast.error(retryError instanceof Error ? retryError.message : 'Gagal memuat workspace.')
  }
}

const handleLeaveProject = async () => {
  if (!window.confirm('Keluar dari project ini?')) return
  try {
    await leaveProject(projectId.value || '')
    toast.success('Kamu sudah keluar dari project.')
    await router.replace(`/projects/${slug.value}`)
  } catch (error) {
    toast.error(error instanceof Error ? error.message : 'Gagal keluar dari project.')
  }
}

const handleRemoveMember = async (memberId: string) => {
  if (!window.confirm('Keluarkan anggota ini dari project?')) return
  try {
    await updateMemberStatus(projectId.value || '', memberId, 'removed')
    await workspace.refreshWorkspace(project.value?.creator_id || '')
    toast.success('Anggota berhasil dikeluarkan.')
  } catch (error) {
    toast.error(error instanceof Error ? error.message : 'Gagal memperbarui anggota.')
  }
}

const handleChangeMemberRole = async (memberId: string, roleId: string) => {
  if (!roleId) return
  try {
    await changeMemberRole(projectId.value || '', memberId, roleId)
    await workspace.refreshWorkspace(project.value?.creator_id || '')
    toast.success('Role anggota berhasil diperbarui.')
  } catch (error) {
    toast.error(error instanceof Error ? error.message : 'Gagal mengubah role anggota.')
  }
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
  <div class="flex h-[calc(100vh-64px)] flex-col overflow-hidden bg-neutral-50">
    <div v-if="pending" class="flex flex-1 items-center justify-center px-6">
      <div class="w-full max-w-5xl space-y-4" aria-label="Memuat workspace" aria-live="polite">
        <div class="h-24 animate-pulse rounded-xl bg-neutral-200" />
        <div class="grid gap-4 lg:grid-cols-4">
          <div v-for="column in 4" :key="column" class="h-96 animate-pulse rounded-xl bg-neutral-200" />
        </div>
      </div>
    </div>

    <template v-else-if="project">
      <WorkspacePageHeader
        :project="project"
        :tasks="tasksByStatus"
        :is-owner="isOwner"
        :is-read-only="isReadOnly"
        :is-submitting="saving"
        @create-task-click="openCreateModal('todo')"
        @search-change="searchQuery = $event"
        @collaboration-toggle="isCollaborationOpen = true"
      />

      <div class="relative flex min-h-0 flex-1 overflow-hidden">
        <main class="relative flex min-w-0 flex-1 flex-col overflow-hidden" aria-label="Workspace project">
          <div v-if="isReadOnly" class="flex shrink-0 items-start gap-3 border-b border-accent-200 bg-accent-50 px-4 py-3 text-accent-900 sm:px-6" role="status">
            <svg class="mt-0.5 h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 9v4m0 4h.01M10.29 3.86l-7.82 13.5A2 2 0 004.2 20h15.6a2 2 0 001.73-2.64l-7.82-13.5a2 2 0 00-3.42 0z" />
            </svg>
            <div>
              <p class="font-label-1">Workspace dalam mode baca saja</p>
              <p class="mt-0.5 font-body-3">Project {{ workspaceMode === 'read-only' && project.status === 'completed' ? 'sudah selesai' : 'sudah diarsipkan' }}. Board dan aktivitas tetap dapat dilihat, tetapi tidak dapat diubah.</p>
            </div>
          </div>

          <div v-if="loading && workspace.tasks.value.length === 0" class="flex flex-1 items-start gap-4 overflow-hidden p-4 sm:p-6" aria-live="polite" aria-label="Memuat data workspace">
            <div v-for="column in 4" :key="column" class="h-full min-h-[28rem] flex-1 animate-pulse rounded-xl bg-neutral-200" />
          </div>

          <div v-else-if="error" class="flex flex-1 items-center justify-center bg-white p-8">
            <OrganismEmptyState
              title="Workspace gagal dimuat"
              description="Data workspace tidak berhasil dimuat. Coba lagi untuk melanjutkan."
              icon="document"
            >
              <template #actions>
                <AtomicButton variant="outline" @click="retryWorkspace">Coba lagi</AtomicButton>
              </template>
            </OrganismEmptyState>
          </div>

          <div v-else-if="!canOpenWorkspace" class="flex flex-1 items-center justify-center bg-white p-8">
            <OrganismEmptyState
              title="Workspace belum aktif"
              description="Project perlu dimulai terlebih dahulu sebelum board dan activity workspace dapat digunakan."
              icon="folder"
            />
          </div>

          <div v-else-if="searchQuery.trim() && filteredTaskCount === 0" class="flex flex-1 items-center justify-center bg-white p-8">
            <OrganismEmptyState
              title="Task tidak ditemukan"
              description="Tidak ada task yang cocok dengan pencarianmu."
              icon="search"
            >
              <template #actions>
                <AtomicButton variant="outline" @click="searchQuery = ''">Bersihkan pencarian</AtomicButton>
              </template>
            </OrganismEmptyState>
          </div>

          <WorkspaceBoard
            v-else
            class="min-h-0 flex-1"
            :tasks="filteredTasks"
            :members="members"
            :is-owner="isOwner && !isReadOnly"
            :read-only="isReadOnly"
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
            :is-owner="isOwner && !isReadOnly"
            :read-only="isReadOnly"
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
        </main>

        <WorkspaceSidebar
          v-model="isCollaborationOpen"
          :members="members"
          :activities="activities"
          :overview="overview"
          :project-creator-id="project.creator_id"
          :current-user-id="currentUserId"
          :is-owner="isOwner"
          :project-roles="project.project_roles || []"
          :deliverables="deliverables"
          :snapshots="snapshots"
          :finalization-status="finalizationStatus"
          :loading="loading"
          :read-only="isReadOnly"
          @leave="handleLeaveProject"
          @remove="handleRemoveMember"
          @change-role="handleChangeMemberRole"
          @create-deliverable="handleCreateDeliverable"
          @update-deliverable="handleUpdateDeliverable"
          @remove-deliverable="handleDeleteDeliverable"
          @refresh-finalization="handleRefreshFinalization"
        />
      </div>

      <button
        v-if="isOwner && !isReadOnly && canOpenWorkspace"
        type="button"
        class="fixed bottom-5 right-5 z-30 inline-flex h-12 items-center gap-2 rounded-full bg-secondary-500 px-5 font-label-1 text-white shadow-lg transition-colors hover:bg-secondary-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary-300 sm:hidden"
        aria-label="Buat task baru"
        @click="openCreateModal('todo')"
      >
        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Tugas Baru
      </button>

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
