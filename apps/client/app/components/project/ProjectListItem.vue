<template>
  <article
    class="group relative rounded-2xl border border-neutral-200 bg-white p-6 transition-all hover:border-neutral-300"
  >
    <!-- Top Row: Badges & Bookmark -->
    <div class="flex items-start justify-between gap-4">
      <div class="flex flex-wrap items-center gap-2">
        <span
          v-if="project.acceptsContributors"
          class="inline-flex items-center rounded-full bg-success-50 px-2.5 py-0.5 text-xs font-semibold text-success-700"
        >
          Menerima kontributor
        </span>
        <span
          v-if="project.context"
          :class="contextBadgeClass"
          class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold"
        >
          {{ project.context }}
        </span>
      </div>

      <!-- Bookmark Button -->
      <button
        type="button"
        @click.stop.prevent="toggleBookmark"
        class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-neutral-200 transition-colors focus:outline-none"
        :class="[
          isBookmarked
            ? 'border-danger-200 bg-danger-50 text-danger-500'
            : 'text-neutral-400 hover:border-danger-200 hover:bg-neutral-50 hover:text-danger-500'
        ]"
        :aria-label="isBookmarked ? 'Hapus dari simpanan' : 'Simpan proyek'"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.75"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="h-4 w-4 transition-transform active:scale-90"
          :class="isBookmarked ? 'fill-danger-500 stroke-danger-500' : 'stroke-current'"
          aria-hidden="true"
        >
          <path
            d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"
          />
        </svg>
      </button>
    </div>

    <!-- Title -->
    <NuxtLink :to="`/projects/${project.slug}`" class="block mt-3">
      <h3
        class="font-title-2 font-bold text-neutral-900 transition-colors group-hover:text-primary-600 line-clamp-1"
      >
        {{ project.title }}
      </h3>
    </NuxtLink>

    <!-- Description -->
    <p class="mt-2 font-body-2 text-neutral-600 line-clamp-2 leading-relaxed">
      {{ project.description || project.summary }}
    </p>

    <!-- Author Row -->
    <div class="mt-4 flex items-center gap-2 font-body-2">
      <!-- Fallback Initials / Avatar -->
      <AtomicAvatar
        v-if="project.author?.avatar"
        :src="project.author.avatar"
        :name="project.author.name"
        size="xs"
      />
      <div
        v-else
        class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-700 font-semibold text-[11px]"
      >
        {{ project.author?.initials || getInitials(project.author?.name) }}
      </div>

      <span class="font-label-2 font-medium text-neutral-700">
        {{ project.author?.name }}
      </span>
      <span class="text-neutral-400 select-none">·</span>
      <span class="font-body-3 text-neutral-500">
        {{ project.author?.status || 'Pemilik terverifikasi' }}
      </span>
    </div>

    <!-- Tech Stack / Skills Chips -->
    <div
      v-if="project.skills && project.skills.length > 0"
      class="mt-4 flex flex-wrap gap-2"
    >
      <span
        v-for="skill in project.skills"
        :key="skill"
        class="rounded-md bg-neutral-100 px-2.5 py-1 font-body-3 text-xs font-medium text-neutral-700"
      >
        {{ skill }}
      </span>
    </div>

    <!-- Footer Meta -->
    <div
      class="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-neutral-100 pt-4 font-body-3 text-neutral-500"
    >
      <div class="flex flex-wrap items-center gap-x-4 gap-y-1">
        <span>
          <strong class="font-semibold text-neutral-800">{{ project.memberCount }}</strong>
          anggota
        </span>
        <span v-if="project.commitmentHours">
          ± {{ project.commitmentHours }} jam/minggu
        </span>
        <span v-if="project.deadline">
          {{ project.deadline }}
        </span>
      </div>

      <div
        v-if="project.categoryLabel"
        class="font-label-2 font-semibold text-neutral-700"
      >
        {{ project.categoryLabel }}
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

export interface ProjectItemAuthor {
  name: string
  initials?: string
  status?: string
  avatar?: string | null
}

export interface ProjectItem {
  id: string
  title: string
  slug: string
  summary?: string
  description?: string
  acceptsContributors?: boolean
  context?: string
  type?: string
  author: ProjectItemAuthor
  skills: string[]
  memberCount: string
  commitmentHours?: number | string
  deadline?: string
  categoryLabel?: string
  isBookmarked?: boolean
}

const props = defineProps<{
  project: ProjectItem
}>()

const emit = defineEmits<{
  bookmark: [id: string, isBookmarked: boolean]
}>()

const isBookmarked = ref(props.project.isBookmarked ?? false)

const toggleBookmark = () => {
  isBookmarked.value = !isBookmarked.value
  emit('bookmark', props.project.id, isBookmarked.value)
}

const getInitials = (name?: string) => {
  if (!name) return '?'
  return name
    .trim()
    .split(' ')
    .slice(0, 2)
    .map((w) => w.charAt(0))
    .join('')
    .toUpperCase()
}

const contextBadgeClass = computed(() => {
  switch (props.project.context) {
    case 'Proyek pribadi':
      return 'bg-primary-50 text-primary-700'
    case 'Komunitas':
      return 'bg-emerald-50 text-emerald-700'
    case 'Eksperimen':
      return 'bg-accent-50 text-accent-700'
    case 'Proyek client':
      return 'bg-neutral-100 text-neutral-700'
    default:
      return 'bg-neutral-100 text-neutral-700'
  }
})
</script>
