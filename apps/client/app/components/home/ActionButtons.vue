<script setup lang="ts">
import { computed } from 'vue'
import type { Project, Application } from '../../types/project'

const props = defineProps<{
  isVerified: boolean
  completionScore: number
  username: string
  availabilityStatus?: 'available' | 'busy' | 'unavailable' | null
  myProjects?: Project[]
  myApplications?: Application[]
}>()

// Project stats
const activeProjects = computed(
  () =>
    props.myProjects?.filter((p) =>
      ['open', 'in_progress'].includes(p.status)
    ) ?? []
)
const draftProjects = computed(
  () => props.myProjects?.filter((p) => p.status === 'draft') ?? []
)
const totalProjects = computed(() => props.myProjects?.length ?? 0)

// Application stats
const pendingApps = computed(
  () => props.myApplications?.filter((a) => a.status === 'pending') ?? []
)
const acceptedApps = computed(
  () => props.myApplications?.filter((a) => a.status === 'accepted') ?? []
)
const rejectedApps = computed(
  () =>
    props.myApplications?.filter((a) =>
      ['rejected', 'withdrawn'].includes(a.status)
    ) ?? []
)

// Workspaces
const accessibleWorkspaces = computed(() => {
  const workspaces: {
    id: string
    title: string
    slug: string
    role: 'owner' | 'contributor'
  }[] = []

  // Owner workspaces
  props.myProjects?.forEach((p) => {
    if (p.status === 'in_progress') {
      workspaces.push({
        id: p.id,
        title: p.title,
        slug: p.slug,
        role: 'owner'
      })
    }
  })

  // Contributor workspaces
  props.myApplications?.forEach((app) => {
    if (app.status === 'accepted' && app.projects?.status === 'in_progress') {
      if (!workspaces.some((w) => w.id === app.projects?.id)) {
        workspaces.push({
          id: app.projects.id,
          title: app.projects.title,
          slug: app.projects.slug,
          role: 'contributor'
        })
      }
    }
  })

  return workspaces
})
</script>

<template>
  <div
    class="flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm"
  >
    <!-- Header -->
    <div class="px-6 py-5">
      <div class="flex items-center justify-between gap-3">
        <div>
          <h3 class="font-body-1">Aktivitasku</h3>
          <p class="mt-0.5 font-paragraph-3 text-secondary">
            Ringkasan proyek & lamaran terkini.
          </p>
        </div>
      </div>
    </div>

    <div class="flex flex-col flex-1 border-t border-neutral-100">
      <!-- Projects Section -->
      <div class="px-6 pt-5 pb-4">
        <div class="flex items-center justify-between mb-3">
          <p class="font-body-1">Proyek Saya</p>
          <NuxtLink
            to="/projects/my-projects"
            class="font-label-2 text-primary-600 hover:text-primary-700"
          >
            Lihat semua
          </NuxtLink>
        </div>

        <div v-if="totalProjects > 0" class="grid grid-cols-3 gap-2">
          <!-- Active -->
          <div
            class="flex flex-col items-center rounded-xl bg-primary-50 p-3 text-center ring-1 ring-primary-100"
          >
            <p class="font-body-2 font-bold text-primary-700">
              {{ activeProjects.length }}
            </p>
            <p class="mt-0.5 font-body-2 font-medium text-primary-600">Aktif</p>
          </div>
          <!-- Draft -->
          <div
            class="flex flex-col items-center rounded-xl bg-neutral-50 p-3 text-center ring-1 ring-neutral-200"
          >
            <p class="font-body-2 font-bold text-neutral-700">
              {{ draftProjects.length }}
            </p>
            <p class="mt-0.5 font-body-2 font-medium text-neutral-500">Draft</p>
          </div>
          <!-- Total -->
          <div
            class="flex flex-col items-center rounded-xl bg-secondary-50 p-3 text-center ring-1 ring-secondary-100"
          >
            <p class="font-body-2 font-bold text-secondary-700">
              {{ totalProjects }}
            </p>
            <p class="mt-0.5 font-body-2 font-medium text-secondary-500">
              Total
            </p>
          </div>
        </div>
        <!-- Empty state -->
        <div
          v-else
          class="flex flex-col items-center gap-1.5 rounded-xl border border-dashed border-neutral-200 bg-neutral-50 py-4 text-center"
        >
          <p class="font-body-2 font-medium text-neutral-500">
            Belum ada proyek
          </p>
          <NuxtLink to="/projects" class="font-label-2 text-primary-600">
            Jelajahi project
          </NuxtLink>
        </div>
      </div>

      <!-- Applications Section -->
      <div class="border-t border-neutral-100 px-6 pt-4 pb-5">
        <div class="flex items-center justify-between mb-3">
          <p class="font-body-1">Lamaran Saya</p>
          <NuxtLink
            to="/projects/my-applications"
            class="font-label-2 text-primary-600 hover:text-primary-700"
          >
            Lihat semua
          </NuxtLink>
        </div>

        <div v-if="(myApplications?.length ?? 0) > 0" class="space-y-2">
          <!-- Pending -->
          <div
            class="flex items-center justify-between rounded-lg border border-accent-100 bg-accent-50 px-3 py-2"
          >
            <div class="flex items-center gap-2">
              <span class="h-2 w-2 rounded-full bg-accent-500" />
              <span class="font-body-1 font-medium text-accent-700"
                >Menunggu Keputusan</span
              >
            </div>
            <span class="font-body-2 font-bold text-accent-700">{{
              pendingApps.length
            }}</span>
          </div>
          <!-- Accepted -->
          <div
            class="flex items-center justify-between rounded-lg border border-success-100 bg-success-50 px-3 py-2"
          >
            <div class="flex items-center gap-2">
              <span class="h-2 w-2 rounded-full bg-success-500" />
              <span class="font-body-1 font-medium text-success-700"
                >Diterima</span
              >
            </div>
            <span class="font-body-2 font-bold text-success-700">{{
              acceptedApps.length
            }}</span>
          </div>
          <!-- Rejected -->
          <div
            class="flex items-center justify-between rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2"
          >
            <div class="flex items-center gap-2">
              <span class="h-2 w-2 rounded-full bg-neutral-400" />
              <span class="font-body-1 font-medium text-neutral-600"
                >Ditolak / Ditarik</span
              >
            </div>
            <span class="font-body-2 font-bold text-neutral-600">{{
              rejectedApps.length
            }}</span>
          </div>
        </div>
        <!-- Empty state -->
        <div
          v-else
          class="flex flex-col items-center gap-1.5 rounded-xl border border-dashed border-neutral-200 bg-neutral-50 py-4 text-center"
        >
          <p class="font-body-2">Belum ada lamaran</p>
          <NuxtLink
            to="/projects"
            class="font-label-2 text-primary-600 hover:text-primary-700"
          >
            Lamar projek sekarang
          </NuxtLink>
        </div>
      </div>

      <!-- Active Workspaces Section -->
      <div class="border-t border-neutral-100 px-6 pt-4 pb-5">
        <div class="flex items-center justify-between mb-3">
          <p class="font-body-1">Workspace Aktif</p>
        </div>

        <div v-if="accessibleWorkspaces.length > 0" class="space-y-2">
          <NuxtLink
            v-for="ws in accessibleWorkspaces"
            :key="ws.id"
            :to="`/projects/${ws.slug}/workspace`"
            class="group flex items-center justify-between rounded-xl border border-neutral-200 bg-white p-3 hover:border-primary-300 hover:bg-primary-50/20 transition-all duration-200 shadow-2xs"
          >
            <div class="min-w-0 flex-1 pr-3">
              <p
                class="font-body-2 text-secondary-900 truncate group-hover:text-primary-700 transition-colors"
              >
                {{ ws.title }}
              </p>
              <p class="mt-0.5 font-label-2 text-secondary capitalize">
                Sebagai {{ ws.role === 'owner' ? 'Pemilik' : 'Kolaborator' }}
              </p>
            </div>
            <div class="flex items-center gap-1.5 shrink-0">
              <AtomicTag variant="primary"> Buka </AtomicTag>
              <svg
                class="h-3 w-3 text-neutral-400 group-hover:text-primary-600 group-hover:translate-x-0.5 transition-all"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </NuxtLink>
        </div>

        <!-- Empty state -->
        <div
          v-else
          class="flex flex-col items-center gap-1.5 rounded-xl border border-dashed border-neutral-200 bg-neutral-50 py-4 text-center"
        >
          <p class="font-body-2">Belum ada workspace aktif</p>
          <p class="font-paragraph-3 text-secondary px-4">
            Workspace terbuka setelah project masuk tahap pengerjaan.
          </p>
        </div>
      </div>

      <!-- Quick Links -->
      <div class="mt-auto border-t border-neutral-100 bg-neutral-50/30">
        <!-- Jelajahi Project -->
        <NuxtLink
          to="/projects"
          class="group flex items-center gap-4 border-b border-neutral-100 px-6 py-3.5 transition-colors hover:bg-neutral-50"
        >
          <div
            class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600 ring-1 ring-inset ring-primary-200/50"
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
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <div class="flex-1">
            <p
              class="font-body-1 transition-colors group-hover:text-primary-700"
            >
              Jelajahi Project Open
            </p>
            <p class="font-body-2 text-secondary">
              Temukan kolaborasi yang tepat
            </p>
          </div>
          <svg
            class="h-4 w-4 text-neutral-400 opacity-0 transition-all group-hover:text-primary-600 group-hover:opacity-100"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </NuxtLink>

        <!-- Lihat Profil Publik -->
        <NuxtLink
          :to="`/profile/${username}`"
          class="group flex items-center gap-4 px-6 py-3.5 transition-colors hover:bg-neutral-50"
        >
          <div
            class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-success-50 text-success-600 ring-1 ring-inset ring-success-200/50"
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
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <div class="flex-1">
            <p
              class="font-body-1 transition-colors group-hover:text-primary-700"
            >
              Lihat Profil Publik
            </p>
            <p class="font-body-2 text-secondary">
              Cek tampilan profilmu di mata orang lain
            </p>
          </div>
          <svg
            class="h-4 w-4 text-neutral-400 opacity-0 transition-all group-hover:text-primary-600 group-hover:opacity-100"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
