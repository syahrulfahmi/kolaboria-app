<script setup lang="ts">
import { computed, provide, ref, watch } from "vue";
import { Ellipsis, Plus } from "@lucide/vue";
import {
  useWorkspaceController,
  type WorkspaceConfirmationDialogContext,
  type WorkspaceDiscussionContext,
  type WorkspaceProjectCloseDialogContext,
  type WorkspaceTaskDialogContext,
  type WorkspaceTasksContext,
} from "~/composables/useWorkspaceController";
import { workspaceRouteContextKey } from "~/composables/workspace-route-context";
import { useAuth } from '~/composables/useAuth';
import { useWorkspaceProjectInfoQuery } from '~/composables/useWorkspaceProjectInfo';
import { useWorkspaceLiveContext } from '~/composables/workspace-live-context';
import { getApiErrorMessage } from '~/utils/error';
import WorkspaceConfirmationDialog from "./dialogs/WorkspaceConfirmationDialog.vue";
import WorkspaceTaskDialog from "./dialogs/WorkspaceTaskDialog.vue";
import WorkspaceProjectCloseDialog from "./dialogs/WorkspaceProjectCloseDialog.vue";
import WorkspaceNavbar from "./WorkspaceNavbar.vue";

const workspace = useWorkspaceController();
const route = useRoute();
const {
  state,
  currentUser,
  isProjectManager,
  canManageTasks,
  canClose,
  notice,
  views,
  activeView,
  mobileMoreOpen,
  assigneeFilter,
  searchQuery,
  dialogOpen,
  dialogKind,
  pendingConfirmation,
  taskForm,
  resultSummary,
  currentProject,
  selectedTask,
  taskIsClosed,
  statusLabel,
  activeTitle,
  activeDescription,
  goToView,
  goToPersonTasks,
  filterTasksByAssignee,
  setTaskFilter,
  moveTaskFromBoard,
  openTask,
  openNewTask,
  closeDialog,
  cancelConfirmation,
  confirmPendingAction,
  confirmTaskAccessChange,
  confirmProjectStart,
  confirmReadinessChange,
  saveTask,
  deleteSelectedTask,
  submitTaskComment,
  submitTaskClosure,
  openCloseProjectDialog,
  submitProjectClosure,
  confirmContributionReview,
  confirmContributionSharing,
  confirmContributionProposal,
  setContributionNote,
} = workspace;

const isLiveView = computed(() => ['overview', 'info', 'team', 'tasks', 'discussion', 'activity'].includes(activeView.value));
const activitySlug = computed(() => activeView.value === 'activity' ? String(route.params.slug ?? '') : '');
const workspaceSlug = computed(() => String(route.params.slug ?? ''));
const { user: authenticatedUser } = useAuth();
const { header: workspaceLiveHeader } = useWorkspaceLiveContext();
const workspaceProjectInfo = useWorkspaceProjectInfoQuery(workspaceSlug);
const liveOverviewHeader = computed(() => {
  const candidate = workspaceLiveHeader.value;
  if (!candidate || candidate.project_slug !== String(route.params.slug ?? '') || candidate.account_id !== authenticatedUser.value?.id) return null;
  return candidate;
});
const workspaceProjectTitle = computed(() => {
  const info = workspaceProjectInfo.data.value;
  if (liveOverviewHeader.value) return liveOverviewHeader.value.title;
  return info?.project.slug === workspaceSlug.value ? info.project.title : '';
});
const workspaceViewerRoleLabel = computed(() => {
  const info = workspaceProjectInfo.data.value;
  const scope = liveOverviewHeader.value?.viewer_scope ??
    (info?.project.slug === workspaceSlug.value ? info.viewer.scope : null);
  return scope === 'owner' ? 'Project Owner'
    : scope === 'organization_initiator' ? 'Inisiator Organisasi'
      : scope === 'member' ? 'Anggota Proyek' : 'Profil saya';
});
const liveStatusLabel = computed(() => {
  const status = liveOverviewHeader.value?.status;
  return status ? ({ draft: 'Draft', open: 'Persiapan', awaiting_owner: 'Menunggu Project Lead', in_progress: 'Berjalan', completed: 'Selesai', archived: 'Diarsipkan' })[status] : '';
});
const createTaskFromOverview = () => {
  const slug = String(route.params.slug ?? '');
  if (slug) void navigateTo(`/projects/${encodeURIComponent(slug)}/workspace/tasks?action=create`);
};
const activityInfo = useWorkspaceProjectInfoQuery(activitySlug);
const activityProject = computed(() => activityInfo.data.value?.project ?? null);
const activityInfoError = ref('');
const activityStatusLabel = computed(() => {
  const status = activityProject.value?.status;
  return status ? ({ draft: 'Draft', open: 'Persiapan', awaiting_owner: 'Menunggu Project Lead', in_progress: 'Berjalan', completed: 'Selesai', archived: 'Diarsipkan' })[status] : '';
});
const loadActivityInfo = async () => {
  const slug = activitySlug.value;
  const account = authenticatedUser.value?.id;
  activityInfoError.value = '';
  if (!slug || !account) return;
  try { await activityInfo.getInfo(slug); }
  catch (cause) {
    if (activitySlug.value === slug && authenticatedUser.value?.id === account) activityInfoError.value = getApiErrorMessage(cause, 'Konteks proyek belum dapat dimuat.');
  }
};
watch([activitySlug, () => authenticatedUser.value?.id], () => { void loadActivityInfo(); }, { immediate: true });


const pickContext = <T extends object, const K extends readonly (keyof T)[]>(
  source: T,
  keys: K,
): Pick<T, K[number]> =>
  Object.fromEntries(keys.map((key) => [key, source[key]])) as Pick<
    T,
    K[number]
  >;

const workspaceViewSource = {
  ...workspace,
  currentProject: computed(() => {
    const project = currentProject.value;
    if (!project) {
      throw new Error("A Workspace view cannot render without a project.");
    }
    return project;
  }),
};

const tasksContext: WorkspaceTasksContext = pickContext(workspaceViewSource, [
  "state",
  "canManageTasks",
  "isProjectManager",
  "canDragTask",
  "moveTaskFromBoard",
  "taskFilter",
  "assigneeFilter",
  "searchQuery",
  "currentProject",
  "projectMembers",
  "visibleTaskGroups",
  "shortDate",
  "priorityLabel",
]);
const discussionContext: WorkspaceDiscussionContext = pickContext(workspaceViewSource, [
  "state",
  "currentProject",
  "timeLabel",
]);
const confirmationDialogContext: WorkspaceConfirmationDialogContext =
  pickContext(workspace, ["pendingConfirmation"]);
const taskDialogContext: WorkspaceTaskDialogContext = pickContext(workspace, [
  "state",
  "currentUser",
  "isProjectManager",
  "selectedTask",
  "taskReadOnly",
  "taskIsClosed",
  "canManageTasks",
  "currentProject",
  "taskForm",
  "taskError",
  "assigneeOptions",
  "taskStatuses",
  "timeLabel",
]);
const projectCloseDialogContext: WorkspaceProjectCloseDialogContext =
  pickContext(workspaceViewSource, [
    "completedTaskCount",
    "closedTasks",
    "resultSummary",
    "outcomeError",
  ]);

provide(workspaceRouteContextKey, {
  controller: workspace,
  views: {
    tasks: tasksContext,
    discussion: discussionContext,
  },
});
</script>

<template>
  <div
    class="flex h-dvh flex-col overflow-hidden bg-neutral-50 text-neutral-900"
  >
    <div class="flex min-h-0 flex-1">
      <aside
        class="sticky top-0 hidden h-dvh w-[218px] shrink-0 overflow-y-auto border-r border-neutral-200 bg-white px-3 py-5 lg:flex lg:flex-col"
      >
        <NuxtLink
          to="/home"
          class="mb-8 flex items-center gap-2 px-2.5"
          aria-label="Kolaboria home"
        >
          <img src="~/assets/img/logo.svg" alt="Kolaboria" class="h-7 w-auto" />
        </NuxtLink>

        <p
          class="px-2.5 pb-2 font-label-3 uppercase tracking-[0.12em] text-neutral-500"
        >
          Workspace
        </p>
        <nav class="space-y-1" aria-label="Navigasi workspace">
          <button
            v-for="view in views"
            :key="view.id"
            type="button"
            class="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left font-body-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
            :class="
              activeView === view.id
                ? 'bg-primary-50 font-semibold text-primary-800'
                : 'text-neutral-600 hover:bg-neutral-50 hover:text-secondary-900'
            "
            :aria-current="activeView === view.id ? 'page' : undefined"
            @click="goToView(view.id)"
          >
            <component
              :is="view.icon"
              class="h-[18px] w-[18px] shrink-0"
              aria-hidden="true"
            />
            <span>{{ view.label }}</span>
          </button>
        </nav>

      </aside>

      <div
        class="flex h-full min-h-0 min-w-0 flex-1 flex-col"
        :class="activeView === 'tasks' ? 'overflow-hidden' : 'overflow-y-auto'"
      >
        <WorkspaceNavbar
          :project-slug="workspaceSlug"
          :project-title="workspaceProjectTitle"
          :user-name="authenticatedUser?.name ?? null"
          :viewer-role-label="workspaceViewerRoleLabel"
        />

        <main
          class="mx-auto w-full px-4 pt-5 pb-3 sm:px-6 sm:pt-7 lg:px-8 lg:pb-10"
          :class="
            activeView === 'tasks'
              ? 'flex min-h-0 flex-1 flex-col overflow-hidden pt-3 sm:pt-7'
              : 'flex-none'
          "
        >
          <div
            class="flex flex-wrap items-end justify-between gap-3 sm:mb-6"
            :class="
              activeView === 'tasks' ? 'mb-2 shrink-0 sm:mb-6' : 'mb-5 sm:mb-6'
            "
          >
            <div class="min-w-0">
              <p v-if="activeView === 'activity' && activityProject" class="font-label-3 uppercase tracking-[0.1em] text-primary-700">{{ activityProject.title }}</p>
              <p
              v-if="activeView === 'overview' && liveOverviewHeader"
                class="font-label-3 uppercase tracking-[0.1em] text-primary-700">{{ liveOverviewHeader.title }}</p>
              <p
                v-else-if="currentProject && !isLiveView"
                class="font-label-3 uppercase tracking-[0.1em] text-primary-700"
              >
                {{ currentProject?.title }}
              </p>
              <div class="mt-1.5 flex flex-wrap items-center gap-2">
                <h1 class="font-title-1 text-secondary-900">
                  {{ activeTitle }}
                </h1>
                <AtomicTag v-if="activeView === 'activity' && activityStatusLabel">{{ activityStatusLabel }}</AtomicTag>
                <AtomicTag v-if="activeView === 'overview' && liveStatusLabel">{{ liveStatusLabel }}</AtomicTag>
                <AtomicTag
                  v-if="currentProject && !isLiveView"
                  :variant="
                    currentProject?.status === 'completed'
                      ? 'success'
                      : currentProject?.status === 'preparing'
                        ? 'warning'
                        : 'primary'
                  "
                  >{{ statusLabel }}</AtomicTag
                >
              </div>
              <p
                class="mt-1 font-body-2 text-neutral-500"
                :class="activeView === 'tasks' ? 'hidden sm:block' : ''"
              >
                {{ activeDescription }}
              </p>
            </div>
            <AtomicButton
              v-if="
                liveOverviewHeader?.can_create_task && activeView === 'overview'
              "
              variant="primary"
              size="sm"
              @click="createTaskFromOverview"
            >
              <template #icon-left
                ><Plus class="h-4 w-4" aria-hidden="true"
              /></template>
              Buat tugas
            </AtomicButton>
          </div>

          <p v-if="activeView === 'activity' && activityInfoError" class="mb-4 rounded-lg bg-warning-50 p-3 font-body-3 text-warning-900" role="alert">
            {{ activityInfoError }}
            <AtomicButton variant="text-button" size="sm" @click="loadActivityInfo">Coba lagi</AtomicButton>
          </p>
          <slot v-if="currentProject || isLiveView" />
          <section
            v-else
            class="mx-auto mt-8 w-full max-w-2xl rounded-xl border border-neutral-200 bg-white px-5 py-8 text-center sm:mt-12 sm:px-8 sm:py-10"
            aria-labelledby="workspace-empty-title"
          >
            <h2
              id="workspace-empty-title"
              class="font-title-3 text-secondary-900"
            >
              Data workspace belum tersedia
            </h2>
            <p class="mx-auto mt-2 max-w-lg font-body-2 text-neutral-500">
              Informasi proyek, anggota, tugas, diskusi, dan aktivitas akan
              muncul di sini setelah data proyek tersedia.
            </p>
          </section>
        </main>
      </div>
    </div>

    <nav
      class="relative z-40 shrink-0 border-t border-neutral-200 bg-white/95 px-1 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-1.5 backdrop-blur lg:hidden"
      aria-label="Navigasi workspace mobile"
    >
      <div class="flex items-stretch justify-around">
        <button
          v-for="view in views.slice(0, 4)"
          :key="view.id"
          type="button"
          class="flex min-w-0 flex-1 flex-col items-center gap-1 rounded-lg px-1 py-1.5 font-label-3 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
          :class="
            activeView === view.id ? 'text-primary-700' : 'text-neutral-500'
          "
          :aria-current="activeView === view.id ? 'page' : undefined"
          @click="goToView(view.id)"
        >
          <component :is="view.icon" class="h-5 w-5" aria-hidden="true" /><span
            class="max-w-full truncate"
            >{{ view.id === "tasks" ? "Tugas" : view.label }}</span
          >
        </button>
        <button
          type="button"
          class="flex min-w-0 flex-1 flex-col items-center gap-1 rounded-lg px-1 py-1.5 font-label-3 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
          :class="
            ['activity', 'info'].includes(activeView) || mobileMoreOpen
              ? 'text-primary-700'
              : 'text-neutral-500'
          "
          :aria-expanded="mobileMoreOpen"
          @click="mobileMoreOpen = !mobileMoreOpen"
        >
          <Ellipsis class="h-5 w-5" aria-hidden="true" /><span>Lainnya</span>
        </button>
      </div>
      <div
        v-if="mobileMoreOpen"
        class="absolute inset-x-3 bottom-[calc(100%+0.5rem)] rounded-xl border border-neutral-200 bg-white p-2 shadow-lg"
      >
        <button
          v-for="view in views.slice(4)"
          :key="view.id"
          type="button"
          class="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left font-body-2"
          :class="
            activeView === view.id
              ? 'bg-primary-50 text-primary-800'
              : 'text-neutral-700 hover:bg-neutral-50'
          "
          @click="goToView(view.id)"
        >
          <component :is="view.icon" class="h-4 w-4" aria-hidden="true" />{{
            view.label
          }}
        </button>
      </div>
    </nav>

    <Transition
      enter-active-class="transition duration-200"
      enter-from-class="translate-y-2 opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="notice && !['overview', 'tasks', 'activity', 'info'].includes(activeView)"
        class="fixed bottom-20 left-4 right-4 z-[80] mx-auto max-w-md rounded-xl bg-secondary-800 px-4 py-3 font-body-2 text-white shadow-lg sm:bottom-6 sm:left-auto sm:right-6"
        role="status"
      >
        {{ notice }}
      </div>
    </Transition>

    <OrganismModal
      v-if="!['overview', 'tasks', 'activity', 'info'].includes(activeView)"
      v-model="dialogOpen"
      @close="closeDialog"
      :title="
        dialogKind === 'confirm'
          ? (pendingConfirmation?.title ?? 'Konfirmasi tindakan')
          : dialogKind === 'task'
            ? selectedTask
              ? 'Detail task'
              : 'Buat task baru'
            : 'Tinjau hasil proyek'
      "
      :subtitle="
        dialogKind === 'confirm'
          ? ''
          : dialogKind === 'task'
            ? selectedTask?.title
            : 'Periksa hasil sebelum menutup siklus kerja.'
      "
      :size="dialogKind === 'confirm' ? 'sm' : 'lg'"
      :mobile-fullscreen="dialogKind !== 'confirm'"
      :primary-label="
        dialogKind === 'confirm'
          ? (pendingConfirmation?.confirmLabel ?? 'Konfirmasi')
          : dialogKind === 'task'
            ? selectedTask
              ? taskIsClosed
                ? 'Tutup detail'
                : 'Simpan perubahan'
              : 'Buat task'
            : 'Tutup proyek'
      "
      secondary-label="Batal"
      :primary-variant="
        dialogKind === 'confirm'
          ? (pendingConfirmation?.variant ?? 'primary')
          : 'primary'
      "
      :primary-disabled="
        dialogKind === 'confirm'
          ? !pendingConfirmation
          : dialogKind === 'task'
            ? taskIsClosed ? false : !taskForm.title.trim()
            : !canClose || !resultSummary.trim()
      "
      @on-primary-click="
        dialogKind === 'confirm'
          ? confirmPendingAction()
          : dialogKind === 'task'
            ? saveTask()
            : submitProjectClosure()
      "
      @on-secondary-click="
        dialogKind === 'confirm' ? cancelConfirmation() : closeDialog()
      "
    >
      <WorkspaceConfirmationDialog
        v-if="dialogKind === 'confirm'"
        :context="confirmationDialogContext"
      />
      <WorkspaceTaskDialog
        v-if="dialogKind === 'task'"
        :context="taskDialogContext"
        @comment-submit="submitTaskComment"
        @delete-task="deleteSelectedTask"
        @close-task="submitTaskClosure"
      />
      <WorkspaceProjectCloseDialog
        v-else-if="dialogKind === 'close-project'"
        :context="projectCloseDialogContext"
      />
    </OrganismModal>
  </div>
</template>
