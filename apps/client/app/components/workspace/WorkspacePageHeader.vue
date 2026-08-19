<script setup lang="ts">
import type { Project } from '~/types/project'
import type { Task, TaskStatus } from '~/types/workspace'

const props = defineProps<{
  project: Project
  tasks: Record<TaskStatus, Task[]>
  isOwner: boolean
  isReadOnly?: boolean
  isSubmitting?: boolean
}>()

const emit = defineEmits<{
  'create-task-click': []
  'search-change': [value: string]
  'collaboration-toggle': []
}>()

const searchQuery = ref('')

const totalTasks = computed(() =>
  Object.values(props.tasks).reduce((sum, list) => sum + list.length, 0)
)

const memberCount = computed(() => props.project.project_members?.filter((member) => member.status !== 'removed').length ?? 0)

const statusMeta = computed(() => {
  switch (props.project.status) {
    case 'completed':
      return { label: 'Completed', variant: 'success' as const }
    case 'archived':
      return { label: 'Archived', variant: 'warning' as const }
    case 'in_progress':
      return { label: 'In Progress', variant: 'primary' as const }
    case 'open':
      return { label: 'Open', variant: 'default' as const }
    default:
      return { label: 'Belum dimulai', variant: 'default' as const }
  }
})

const accessLabel = computed(() => {
  if (props.isReadOnly) return 'Read-only'
  return props.isOwner ? 'Owner' : 'Contributor'
})

watch(searchQuery, (value) => emit('search-change', value))
</script>

<template>
  <header class="shrink-0 border-b border-neutral-200 bg-white">
    <div class="mx-auto flex max-w-[1800px] flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
      <div class="flex min-w-0 items-start justify-between gap-4">
        <div class="min-w-0">
          <div class="flex items-center gap-2 font-body-3 text-neutral-500">
            <NuxtLink
              :to="isOwner ? '/projects/my-projects' : '/projects/my-applications'"
              class="inline-flex shrink-0 items-center gap-1 rounded-md text-primary-700 transition-colors hover:text-primary-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
            >
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
              <span class="hidden sm:inline">Projects</span>
            </NuxtLink>
            <span aria-hidden="true">/</span>
            <span class="truncate">Workspace</span>
          </div>

          <div class="mt-2 flex flex-wrap items-center gap-2">
            <h1 class="truncate font-title-2 text-secondary-900" :title="project.title">
              {{ project.title }}
            </h1>
            <AtomicTag :variant="statusMeta.variant">{{ statusMeta.label }}</AtomicTag>
            <AtomicTag :variant="isReadOnly ? 'warning' : isOwner ? 'success' : 'default'">
              {{ accessLabel }}
            </AtomicTag>
          </div>

          <p class="mt-1 font-body-3 text-neutral-500">
            {{ totalTasks }} task<span v-if="totalTasks !== 1">s</span>
            <span aria-hidden="true">•</span>
            {{ memberCount }} anggota
          </p>
        </div>

        <div class="flex shrink-0 items-center gap-2">
          <AtomicButton
            class="hidden sm:inline-flex"
            variant="ghost-secondary"
            size="sm"
            @click="emit('collaboration-toggle')"
          >
            <template #icon-left>
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M17 20h5v-1a4 4 0 00-4-4h-1m-4 5H3v-1a4 4 0 014-4h4a4 4 0 014 4v1zm-2-9a3 3 0 11-6 0 3 3 0 016 0zm6 1a3 3 0 10-2.83-4" />
              </svg>
            </template>
            Kolaborasi
          </AtomicButton>
          <button
            type="button"
            class="inline-flex h-10 w-10 items-center justify-center rounded-lg text-neutral-600 transition-colors hover:bg-neutral-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 sm:hidden"
            aria-label="Buka kolaborasi"
            @click="emit('collaboration-toggle')"
          >
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M17 20h5v-1a4 4 0 00-4-4h-1m-4 5H3v-1a4 4 0 014-4h4a4 4 0 014 4v1zm-2-9a3 3 0 11-6 0 3 3 0 016 0zm6 1a3 3 0 10-2.83-4" />
            </svg>
          </button>
          <AtomicButton
            v-if="isOwner && !isReadOnly"
            variant="primary"
            size="sm"
            :loading="isSubmitting"
            @click="emit('create-task-click')"
          >
            <template #icon-left>
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
            </template>
            <span class="hidden sm:inline">Tugas Baru</span>
            <span class="sm:hidden">Tambah</span>
          </AtomicButton>
        </div>
      </div>

      <div class="flex flex-col gap-3 border-t border-neutral-100 pt-3 sm:flex-row sm:items-center sm:justify-between">
        <div class="flex items-center gap-2">
          <span class="font-label-1 uppercase tracking-wide text-neutral-500">Board</span>
          <span class="rounded-full bg-neutral-100 px-2 py-0.5 font-label-2 text-neutral-600">{{ totalTasks }} task</span>
        </div>
        <div class="w-full sm:max-w-xs">
          <MoleculeSearchField v-model="searchQuery" placeholder="Cari task..." />
        </div>
      </div>
    </div>
  </header>
</template>
