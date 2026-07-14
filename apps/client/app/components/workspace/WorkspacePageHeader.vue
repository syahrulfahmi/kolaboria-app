<script setup lang="ts">
import type { Project } from '~/types/project'
import type { Task, TaskStatus } from '~/types/workspace'

const props = defineProps<{
  project: Project
  tasks: Record<TaskStatus, Task[]>
  isOwner: boolean
  isSubmitting?: boolean
}>()

const emit = defineEmits<{
  'create-task-click': []
  'search-change': [value: string]
}>()

const searchQuery = ref('')
const activeView = ref<'board' | 'list' | 'timeline'>('board')

const totalTasks = computed(() => {
  return Object.values(props.tasks).reduce((sum, list) => sum + list.length, 0)
})

const todoCount = computed(() => props.tasks.todo?.length ?? 0)
const inProgressCount = computed(() => props.tasks.in_progress?.length ?? 0)
const reviewCount = computed(() => props.tasks.review?.length ?? 0)
const doneCount = computed(() => props.tasks.done?.length ?? 0)

watch(searchQuery, (val) => {
  emit('search-change', val)
})
</script>

<template>
  <div
    class="bg-white border-b border-neutral-200 shadow-sm shrink-0 flex flex-col font-sans"
  >
    <!-- Top Row: Project Title & Breadcrumbs -->
    <div
      class="px-4 py-4 sm:px-6 border-b border-neutral-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
    >
      <!-- Breadcrumbs and Title -->
      <div class="flex flex-col gap-1.5 min-w-0">
        <!-- Breadcrumbs Navigation -->
        <div
          class="flex items-center gap-1.5 font-body-3 text-neutral-500 font-medium min-w-0"
        >
          <!-- Desktop Breadcrumbs -->
          <div class="hidden md:flex items-center gap-1.5 min-w-0">
            <span
              class="truncate max-w-[200px] font-body-2"
              :title="project.title"
            >
              {{ project.title }}
            </span>
            <svg
              class="h-3 w-3 text-neutral-300 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2.5"
                d="M9 5l7 7-7 7"
              />
            </svg>
            <span class="text-secondary font-body-2">Workspace</span>
          </div>

          <!-- Mobile Back Link -->
          <div class="md:hidden flex items-center gap-1.5 min-w-0">
            <NuxtLink
              :to="
                isOwner ? '/projects/my-projects' : '/projects/my-applications'
              "
              class="inline-flex items-center gap-1 text-primary-600 hover:text-primary-700 transition-colors shrink-0"
            >
              <svg
                class="h-3.5 w-3.5 stroke-[2.5]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              <span class="font-body-2">Kembali</span>
            </NuxtLink>
            <span class="text-neutral-200">|</span>
            <span class="text-secondary font-body-2">Workspace</span>
          </div>
        </div>

        <!-- Project Title Header -->
        <h1
          class="text-secondary text-lg md:text-xl font-bold tracking-tight truncate"
          :title="project.title"
        >
          {{ project.title }}
        </h1>
      </div>

      <!-- Action Button (Tugas Baru) -->
      <div class="flex items-center gap-3 self-end sm:self-center shrink-0">
        <AtomicButton
          v-if="isOwner"
          variant="primary"
          class="shadow-xs"
          :disabled="isSubmitting"
          @click="$emit('create-task-click')"
        >
          <!-- Desktop View (Teks + Ikon) -->
          <span class="hidden sm:flex items-center gap-2 font-label-2">
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2.5"
                d="M12 4v16m8-8H4"
              />
            </svg>
            Tugas Baru
          </span>

          <!-- Mobile View (Ikon Saja) -->
          <span class="flex sm:hidden items-center justify-center p-0.5">
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2.5"
                d="M12 4v16m8-8H4"
              />
            </svg>
          </span>
        </AtomicButton>
      </div>
    </div>

    <!-- Bottom Row: View Toggle, Search & Mini Stats -->
    <div
      class="px-4 py-3 sm:px-6 flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between bg-neutral-50/50"
    >
      <!-- View Controls -->
      <div
        class="flex items-center gap-1 bg-neutral-100/80 p-1 rounded-xl self-start shrink-0"
      >
        <button
          class="px-3.5 py-1.5 font-label-2 rounded-lg transition-all duration-200"
          :class="
            activeView === 'board'
              ? 'bg-white text-secondary-900 shadow-sm border border-neutral-200/20'
              : 'text-neutral-500 hover:text-secondary-700'
          "
          @click="activeView = 'board'"
        >
          Board
        </button>
        <button
          class="px-3.5 py-1.5 font-label-2 rounded-lg transition-all duration-200"
          :class="
            activeView === 'list'
              ? 'bg-white text-secondary-900 shadow-sm border border-neutral-200/20'
              : 'text-neutral-500 hover:text-secondary-700'
          "
          @click="activeView = 'list'"
        >
          List
        </button>
        <button
          class="px-3.5 py-1.5 font-label-2 rounded-lg transition-all duration-200"
          :class="
            activeView === 'timeline'
              ? 'bg-white text-secondary-900 shadow-sm border border-neutral-200/20'
              : 'text-neutral-500 hover:text-secondary-700'
          "
          @click="activeView = 'timeline'"
        >
          Timeline
        </button>
      </div>

      <!-- Search & Mini Stats Group -->
      <div
        class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1 lg:justify-end min-w-0"
      >
        <!-- Search Input Field -->
        <div class="min-w-0 w-full sm:max-w-xs">
          <MoleculeSearchField
            v-model="searchQuery"
            placeholder="Cari tugas..."
          />
        </div>

        <!-- Mini Stats (Horizontally Scrollable) -->
        <div
          class="flex items-center gap-2 overflow-x-auto whitespace-nowrap scrollbar-none py-0.5 -my-0.5 shrink-0"
        >
          <div
            class="flex items-center gap-2 bg-white border border-neutral-200/80 px-3 py-1 rounded-full font-body-3"
          >
            Total:
            <span class="font-label-2">{{ totalTasks }}</span>
          </div>
          <div
            class="flex items-center gap-1.5 bg-white border border-neutral-200/80 px-3 py-1 rounded-full font-body-3"
          >
            <span class="w-2 h-2 bg-neutral-400 rounded-full"></span>
            Todo:
            <span class="font-label-2">{{ todoCount }}</span>
          </div>
          <div
            class="flex items-center gap-1.5 bg-white border border-neutral-200/80 px-3 py-1 rounded-full font-body-3"
          >
            <span class="w-2 h-2 bg-primary-400 rounded-full"></span>
            In Progress:
            <span class="font-label-2">{{ inProgressCount }}</span>
          </div>
          <div
            class="flex items-center gap-1.5 bg-white border border-neutral-200/80 px-3 py-1 rounded-full font-body-3"
          >
            <span class="w-2 h-2 bg-accent-400 rounded-full"></span>
            Review:
            <span class="font-label-2">{{ reviewCount }}</span>
          </div>
          <div
            class="flex items-center gap-1.5 bg-white border border-neutral-200/80 px-3 py-1 rounded-full font-body-3"
          >
            <span class="w-2 h-2 bg-success-500 rounded-full"></span>
            Done:
            <span class="font-label-2">{{ doneCount }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Sembunyikan scrollbar untuk Chrome, Safari, dan Opera */
.scrollbar-none::-webkit-scrollbar {
  display: none;
}
/* Sembunyikan scrollbar untuk IE, Edge, dan Firefox */
.scrollbar-none {
  -ms-overflow-style: none; /* IE dan Edge */
  scrollbar-width: none; /* Firefox */
}
</style>
