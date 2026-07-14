<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed, ref } from 'vue'

definePageMeta({
  layout: 'home',
  middleware: ['auth', 'onboarding-guard']
})

const route = useRoute()
const slug = route.params.slug as string

const { getProjectBySlug } = useProjects()
const { getMyWorkHistory } = usePortfolio()

const { data: project, pending: projectPending } = await useAsyncData(
  `project-${slug}`,
  () => getProjectBySlug(slug)
)

const { data: history, pending: historyPending } = await useAsyncData(
  `history-${slug}`,
  async () => {
    if (!project.value) return null
    return getMyWorkHistory(project.value.id)
  },
  { watch: [project] }
)

useHead({
  title: computed(() =>
    project.value ? `${project.value.title} - Portfolio Saya` : 'Portfolio Saya'
  )
})

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const statusConfig = computed(() => {
  if (!project.value) return null
  const status = project.value.status
  switch (status) {
    case 'open':
      return {
        label: 'Mencari Anggota',
        color: 'bg-success-50 text-success-700 border border-success-200'
      }
    case 'in_progress':
      return {
        label: 'Sedang Berjalan',
        color: 'bg-primary-50 text-primary-700 border border-primary-200'
      }
    case 'completed':
      return {
        label: 'Selesai',
        color: 'bg-accent-50 text-accent-700 border border-accent-200'
      }
    case 'draft':
      return {
        label: 'Draf',
        color: 'bg-neutral-50 text-neutral-600 border border-neutral-200'
      }
    default:
      return {
        label: status,
        color: 'bg-neutral-50 text-neutral-600 border border-neutral-200'
      }
  }
})

// Activity pagination, filtering, and grouping
const visibleCount = ref(15)
const selectedFilter = ref('all')

const filterOptions = [
  { value: 'all', label: 'Semua' },
  { value: 'task', label: 'Tugas' },
  { value: 'comment', label: 'Komentar' }
]

const filteredActivities = computed(() => {
  if (!history.value?.activities) return []
  const list = history.value.activities
  if (selectedFilter.value === 'task') {
    return list.filter((act) => act.action.startsWith('task.'))
  } else if (selectedFilter.value === 'comment') {
    return list.filter((act) => act.action.startsWith('comment.'))
  }
  return list
})

const visibleActivities = computed(() => {
  return filteredActivities.value.slice(0, visibleCount.value)
})

const hasMoreActivities = computed(() => {
  return filteredActivities.value.length > visibleCount.value
})

const loadMoreActivities = () => {
  visibleCount.value += 15
}

const groupedActivities = computed(() => {
  const groups: { [key: string]: typeof filteredActivities.value } = {}

  visibleActivities.value.forEach((act) => {
    const date = new Date(act.created_at)
    const monthYear = date.toLocaleDateString('id-ID', {
      month: 'long',
      year: 'numeric'
    })

    if (!groups[monthYear]) {
      groups[monthYear] = []
    }
    groups[monthYear].push(act)
  })

  return Object.entries(groups).map(([month, items]) => ({
    month,
    items
  }))
})
</script>

<template>
  <div class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-16">
    <!-- Back Navigation / Header -->
    <div class="mb-10 flex items-center justify-between">
      <NuxtLink
        to="/portfolio/me"
        class="inline-flex items-center gap-1.5 font-label-2 text-neutral-500 hover:text-neutral-900 transition-colors duration-200"
      >
        <Icon name="heroicons:arrow-left" class="h-3.5 w-3.5" />
        Kembali ke Portfolio
      </NuxtLink>
    </div>

    <!-- Loading State -->
    <div v-if="projectPending" class="animate-pulse space-y-8">
      <div class="h-32 rounded-2xl bg-neutral-200"></div>
      <div class="grid gap-8 lg:grid-cols-3">
        <div class="lg:col-span-2 h-96 bg-neutral-200 rounded-2xl"></div>
        <div class="h-96 bg-neutral-200 rounded-2xl"></div>
      </div>
    </div>

    <!-- Error State -->
    <div
      v-else-if="!project"
      class="rounded-2xl bg-danger-50 border border-danger-200 p-10 text-center"
    >
      <Icon
        name="heroicons:exclamation-circle"
        class="h-12 w-12 mx-auto mb-4 text-danger-500"
      />
      <h2 class="font-title-1 text-danger-700 mb-2">Project tidak ditemukan</h2>
      <p class="font-paragraph-3 text-danger-600">
        Project yang Anda cari tidak ada atau sudah dihapus.
      </p>
    </div>

    <div v-else class="space-y-8">
      <!-- Project Header Card (Solid Card, No Gradient) -->
      <div
        class="bg-white border border-neutral-200 rounded-2xl p-6 sm:p-10 mb-8"
      >
        <div class="mb-4 flex flex-wrap items-center gap-2">
          <span
            :class="[
              'inline-flex items-center rounded-full px-2.5 py-0.5 font-label-3 uppercase tracking-wider',
              statusConfig?.color
            ]"
          >
            {{ statusConfig?.label }}
          </span>
          <AtomicTag
            variant="primary"
            class="font-label-3 uppercase tracking-wider !px-2.5 !py-0.5"
          >
            {{
              project.type
                ?.replace('_', ' ')
                .replace(/\b\w/g, (l) => l.toUpperCase())
            }}
          </AtomicTag>
        </div>

        <span
          class="font-label-3 uppercase tracking-[0.15em] text-primary-600 block mb-2"
        >
          KARYA KONTRIBUSI
        </span>
        <h1
          class="font-title-1 text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 leading-tight mb-4"
        >
          {{ project.title }}
        </h1>
        <p
          class="max-w-3xl font-paragraph-3 text-neutral-600 leading-relaxed mb-6"
        >
          {{ project.summary }}
        </p>

        <!-- Tech Stack (Vibrant Chips) -->
        <div
          v-if="project.tech_stack && project.tech_stack.length > 0"
          class="flex flex-wrap gap-1.5 mb-6"
        >
          <span
            v-for="tech in project.tech_stack"
            :key="tech"
            class="inline-flex items-center rounded text-primary-700 bg-primary-50 border border-primary-100 px-2.5 py-0.5 font-semibold text-[11px]"
          >
            {{ tech }}
          </span>
        </div>

        <!-- Quick stats row -->
        <div
          class="flex flex-wrap items-center gap-6 text-xs text-neutral-500 font-body-3 border-t border-neutral-100 pt-5"
        >
          <div class="flex items-center gap-1.5">
            <Icon name="heroicons:users" class="h-4 w-4 text-neutral-450" />
            <span>{{ project.project_members?.length || 0 }} Anggota Tim</span>
          </div>
          <div class="flex items-center gap-1.5">
            <Icon name="heroicons:calendar" class="h-4 w-4 text-neutral-450" />
            <span>Dibuat: {{ formatDate(project.created_at) }}</span>
          </div>
          <div v-if="project.start_date" class="flex items-center gap-1.5">
            <Icon name="heroicons:play" class="h-4 w-4 text-neutral-450" />
            <span>Mulai: {{ formatDate(project.start_date) }}</span>
          </div>
          <div v-if="project.deadline" class="flex items-center gap-1.5">
            <Icon name="heroicons:flag" class="h-4 w-4 text-neutral-450" />
            <span class="text-danger-600 font-semibold"
              >Tenggat: {{ formatDate(project.deadline) }}</span
            >
          </div>
        </div>
      </div>

      <!-- Work History Grid -->
      <div v-if="historyPending" class="animate-pulse space-y-6">
        <div class="h-8 w-48 bg-neutral-200 rounded-lg"></div>
        <div class="h-32 bg-neutral-100 rounded-2xl"></div>
      </div>

      <div v-else-if="history" class="grid gap-8 lg:grid-cols-3 items-start">
        <!-- Left Column: Completed Tasks Card Container -->
        <div
          class="lg:col-span-2 bg-white border border-neutral-200 rounded-2xl p-6 space-y-6"
        >
          <div>
            <h2 class="font-title-2 text-neutral-900 flex items-center gap-2.5">
              <Icon
                name="heroicons:check-circle"
                class="h-5 w-5 text-success-500"
              />
              Tugas yang Diselesaikan
              <span
                class="inline-flex items-center rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-semibold text-neutral-600 font-label-3"
              >
                {{ history.my_tasks?.length || 0 }}
              </span>
            </h2>
            <p class="font-body-3 text-neutral-500 mt-1">
              Kontribusi pekerjaan dan tugas yang telah Anda selesaikan dalam
              project ini.
            </p>
          </div>

          <div
            v-if="!history.my_tasks || history.my_tasks.length === 0"
            class="py-12 text-center border border-dashed border-neutral-200 rounded-2xl bg-neutral-50/30"
          >
            <Icon
              name="heroicons:inbox"
              class="h-8 w-8 text-neutral-350 mx-auto mb-2"
            />
            <p class="font-body-2 text-neutral-500">
              Belum ada riwayat tugas spesifik yang dikerjakan pada project ini.
            </p>
          </div>

          <div v-else class="space-y-4">
            <div
              v-for="task in history.my_tasks"
              :key="task.id"
              class="border border-neutral-200 rounded-xl p-4 bg-neutral-50/20 hover:border-primary-300 hover:bg-neutral-50/50 transition-all duration-200"
            >
              <div class="flex-1 min-w-0">
                <div
                  class="flex flex-wrap items-start justify-between gap-4 mb-2"
                >
                  <h3 class="font-title-3 font-semibold text-neutral-900">
                    {{ task.title }}
                  </h3>
                  <span
                    class="inline-flex items-center text-[10px] font-semibold text-success-700 bg-success-50 border border-success-100 px-2 py-0.5 rounded-full"
                  >
                    Selesai
                  </span>
                </div>

                <p
                  v-if="task.description"
                  class="font-paragraph-3 text-neutral-500 mb-4"
                >
                  {{ task.description }}
                </p>

                <div
                  class="text-[11px] text-neutral-400 flex items-center gap-1.5"
                >
                  <Icon name="heroicons:clock" class="h-3.5 w-3.5" />
                  <span>Diperbarui pada {{ formatDate(task.updated_at) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column: Activity Log Card Container (Sticky Sidebar) -->
        <div
          class="bg-white border border-neutral-200 rounded-2xl p-6 space-y-6 lg:sticky lg:top-8"
        >
          <div>
            <h2 class="font-title-2 text-neutral-900 flex items-center gap-2">
              <Icon name="heroicons:bolt" class="h-5 w-5 text-accent-500" />
              Riwayat Aktivitas
              <span
                class="inline-flex items-center rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-semibold text-neutral-600 font-label-3"
              >
                {{ filteredActivities.length }}
              </span>
            </h2>
            <p class="font-body-3 text-neutral-500 mt-1">
              Catatan log aktivitas kontribusi Anda.
            </p>
          </div>

          <!-- Activity Filter Buttons -->
          <div
            v-if="history.activities && history.activities.length > 0"
            class="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none"
          >
            <button
              v-for="opt in filterOptions"
              :key="opt.value"
              @click="
                selectedFilter = opt.value
                visibleCount = 15
              "
              :class="[
                'font-label-3 uppercase tracking-wider px-2.5 py-1 rounded-full border transition-all duration-200 cursor-pointer shrink-0 text-[10px]',
                selectedFilter === opt.value
                  ? 'bg-neutral-900 border-neutral-900 text-white'
                  : 'bg-white border-neutral-200 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50'
              ]"
            >
              {{ opt.label }}
            </button>
          </div>

          <div
            v-if="filteredActivities.length === 0"
            class="py-8 text-center text-neutral-400 border border-dashed border-neutral-200 rounded-xl bg-neutral-50/20"
          >
            <p class="font-body-3">Tidak ada aktivitas ditemukan.</p>
          </div>

          <div v-else class="space-y-4">
            <!-- Scrollable Timeline Container -->
            <div
              class="max-h-[460px] overflow-y-auto pr-2 space-y-6 scrollbar-thin"
            >
              <div
                v-for="group in groupedActivities"
                :key="group.month"
                class="space-y-4"
              >
                <!-- Group Header -->
                <div class="flex items-center gap-3 pt-2">
                  <span
                    class="font-label-3 text-[10px] text-primary-600 font-semibold uppercase tracking-widest"
                  >
                    {{ group.month }}
                  </span>
                  <div class="h-[1px] bg-neutral-200 flex-1"></div>
                </div>

                <!-- Group Items Timeline -->
                <div
                  class="relative border-l border-neutral-200 pl-4 space-y-6 ml-1.5"
                >
                  <div
                    v-for="log in group.items"
                    :key="log.id"
                    class="relative"
                  >
                    <!-- Timeline Bullet (Vibrant Ring) -->
                    <div
                      class="absolute -left-[20.5px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-primary-500 bg-white ring-4 ring-primary-50"
                    ></div>

                    <div>
                      <p
                        class="font-label-2 text-neutral-800 text-[12px] leading-tight"
                      >
                        <span
                          v-if="log.action === 'task.deleted'"
                          class="text-danger-600"
                        >
                          Menghapus tugas
                        </span>
                        <span
                          v-else-if="log.action === 'task.created'"
                          class="text-success-700"
                        >
                          Membuat tugas
                        </span>
                        <span
                          v-else-if="log.action === 'task.updated'"
                          class="text-primary-700"
                        >
                          Memperbarui tugas
                        </span>
                        <span
                          v-else-if="log.action === 'comment.added'"
                          class="text-accent-700"
                        >
                          Menambahkan komentar
                        </span>
                        <span
                          v-else-if="log.action === 'task.assigned'"
                          class="text-neutral-700"
                        >
                          Ditugaskan
                        </span>
                        <span
                          v-else-if="log.action === 'task.moved'"
                          class="text-neutral-700"
                        >
                          Memindahkan tugas
                        </span>
                        <span v-else class="text-neutral-700">{{
                          log.action
                        }}</span>
                      </p>

                      <p
                        class="font-body-3 text-neutral-500 mt-1 italic line-clamp-1 text-[11px]"
                      >
                        "{{ log.metadata?.title || 'Item' }}"
                      </p>

                      <p
                        class="font-body-3 text-neutral-400 mt-1 flex items-center gap-1 text-[10px]"
                      >
                        {{ formatDate(log.created_at) }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Load More Trigger -->
            <div
              v-if="hasMoreActivities"
              class="pt-3 border-t border-neutral-100"
            >
              <AtomicButton
                variant="ghost"
                block
                class="!text-[11px] !font-label-2 !text-neutral-500 hover:!text-neutral-900 w-full hover:!bg-neutral-50"
                @click="loadMoreActivities"
              >
                Muat 15 aktivitas lagi... ({{
                  filteredActivities.length - visibleCount
                }}
                tersisa)
              </AtomicButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
