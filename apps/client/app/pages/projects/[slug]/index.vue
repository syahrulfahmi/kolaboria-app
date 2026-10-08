<template>
  <div class="min-h-screen bg-[#f8fafc] text-neutral-900 pb-24 lg:pb-16" ref="pageRoot">
    <!-- Loading State -->
    <div
      v-if="pending"
      class="flex flex-col items-center justify-center min-h-[60vh]"
    >
      <div
        class="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mb-4"
      ></div>
      <p class="text-neutral-500 font-medium text-center">
        Memuat detail proyek...
      </p>
    </div>

    <!-- Error / Not Found -->
    <div
      v-else-if="error || !project"
      class="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center"
    >
      <div class="text-5xl mb-4">🔍</div>
      <h1 class="text-2xl font-bold text-neutral-900 mb-2">
        Proyek Tidak Ditemukan
      </h1>
      <p class="text-neutral-600 mb-6 max-w-md">
        Proyek yang kamu cari tidak ada atau terjadi kesalahan saat memuat data.
      </p>
      <AtomicButton variant="primary" to="/projects">
        Kembali ke Proyek
      </AtomicButton>
    </div>

    <!-- Project Detail -->
    <div v-else>
      <!-- Draft Banner -->
      <div
        v-if="project.status === 'draft' && isOwner"
        class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4"
      >
        <MoleculeTicker
          variant="warning"
          message="Proyek ini masih berupa draf. Publikasikan proyek untuk membuatnya dapat dilihat oleh publik."
          :closable="false"
          @action-click="navigateTo(`/projects/${project.slug}/edit`)"
          action-label="Edit & Publikasikan"
        />
      </div>

      <!-- Main Container -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <!-- Breadcrumb Navigation -->
        <nav aria-label="Breadcrumb" class="mb-6 flex items-center text-xs text-neutral-500">
          <NuxtLink to="/projects" class="hover:text-neutral-800 transition-colors">
            Proyek
          </NuxtLink>
          <span class="mx-2 text-neutral-400">/</span>
          <span class="text-neutral-700 font-medium truncate max-w-xs sm:max-w-md">
            {{ project.title }}
          </span>
        </nav>

        <!-- Two-column Layout -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <!-- LEFT COLUMN: Main Project Details -->
          <div class="lg:col-span-8 flex flex-col gap-6" ref="heroSection">
            <!-- Card 1: Header / Overview Card -->
            <article class="rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8 space-y-4 shadow-xs">
              <!-- Top Tags -->
              <div class="flex flex-wrap items-center gap-2.5">
                <span
                  class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold"
                  :class="statusBadgeClass"
                >
                  {{ statusBadgeText }}
                </span>
                <span
                  class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200"
                >
                  {{ projectOriginLabel }}
                </span>
              </div>

              <!-- Main Title -->
              <h1 class="font-title-1 font-bold text-neutral-900 text-2xl sm:text-3xl tracking-tight leading-snug">
                {{ project.title }}
              </h1>

              <!-- Summary -->
              <p class="text-neutral-600 font-paragraph-2 leading-relaxed">
                {{ project.summary }}
              </p>

              <!-- Creator Info -->
              <div class="flex items-center gap-3 pt-2">
                <img
                  v-if="creatorAvatar"
                  :src="creatorAvatar"
                  :alt="creatorName"
                  class="w-10 h-10 rounded-full object-cover border border-neutral-200"
                />
                <div
                  v-else
                  class="w-10 h-10 rounded-full bg-[#e0e7ff] text-[#4338ca] font-bold flex items-center justify-center text-sm shrink-0 uppercase"
                >
                  {{ creatorInitial }}
                </div>
                <div>
                  <NuxtLink
                    v-if="creatorUsername"
                    :to="`/profile/${creatorUsername}`"
                    class="font-label-1 font-bold text-neutral-900 hover:text-primary-600 transition-colors block leading-tight"
                  >
                    {{ creatorName }}
                  </NuxtLink>
                  <span v-else class="font-label-1 font-bold text-neutral-900 block leading-tight">
                    {{ creatorName }}
                  </span>
                  <p class="text-xs text-neutral-500 mt-0.5">
                    Pemilik proyek · Profil {{ isCreatorVerified ? 'terverifikasi' : 'belum terverifikasi' }}
                  </p>
                </div>
              </div>
            </article>

            <!-- Card 2: Tentang Proyek -->
            <article class="rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8 space-y-4 shadow-xs">
              <h2 class="font-title-3 font-bold text-neutral-900">Tentang proyek</h2>
              <div class="space-y-4 text-neutral-600 font-paragraph-2 leading-relaxed">
                <p v-for="(paragraph, idx) in descriptionParagraphs" :key="idx">
                  {{ paragraph }}
                </p>
                <p v-if="descriptionParagraphs.length === 0">
                  {{ project.summary }}
                </p>
              </div>
            </article>

            <!-- Card 3: Kenapa Proyek Ini Dibuka Untuk Kolaborasi? -->
            <article class="rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8 space-y-5 shadow-xs">
              <h2 class="font-title-3 font-bold text-neutral-900">
                Kenapa proyek ini dibuka untuk kolaborasi?
              </h2>
              <p class="text-neutral-600 font-paragraph-2 leading-relaxed">
                {{ collaborativeReason }}
              </p>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div class="rounded-xl border border-neutral-200 bg-neutral-50/50 p-4">
                  <p class="text-xs text-neutral-500 font-medium mb-1">Konteks proyek</p>
                  <p class="text-sm font-semibold text-neutral-900">{{ projectOriginLabel }}</p>
                </div>
                <div class="rounded-xl border border-neutral-200 bg-neutral-50/50 p-4">
                  <p class="text-xs text-neutral-500 font-medium mb-1">Bentuk kolaborasi</p>
                  <p class="text-sm font-semibold text-neutral-900">{{ collaborationFormatLabel }}</p>
                </div>
              </div>
            </article>

            <!-- Card 4: Kontributor yang Dibutuhkan -->
            <article class="rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8 space-y-4 shadow-xs">
              <div>
                <h2 class="font-title-3 font-bold text-neutral-900">Kontributor yang dibutuhkan</h2>
                <p class="text-sm text-neutral-500 mt-1">
                  Cari peran yang paling sesuai dengan kemampuan dan pengalaman yang ingin kamu bangun.
                </p>
              </div>

              <div v-if="visibleRoles.length > 0" class="space-y-4 mt-2">
                <div
                  v-for="role in visibleRoles"
                  :key="role.id"
                  class="rounded-xl border border-neutral-200 bg-white p-5 space-y-3"
                >
                  <div class="flex items-center justify-between gap-3 flex-wrap">
                    <h3 class="font-label-1 font-bold text-neutral-900">
                      {{ role.custom_title || role.contribution_role?.name || 'Project Role' }}
                    </h3>
                    <span
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold"
                      :class="(role.remaining_capacity ?? role.capacity) > 0 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-neutral-100 text-neutral-600 border border-neutral-200'"
                    >
                      {{ (role.remaining_capacity ?? role.capacity) > 0 ? `${role.remaining_capacity ?? role.capacity} slot tersedia` : 'Slot penuh' }}
                    </span>
                  </div>
                  <p v-if="role.description" class="text-sm text-neutral-600 leading-relaxed">
                    {{ role.description }}
                  </p>
                  <div v-if="getRoleTags(role).length > 0" class="flex flex-wrap items-center gap-2 pt-1">
                    <span
                      v-for="tag in getRoleTags(role)"
                      :key="tag"
                      class="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-neutral-50 text-neutral-700 border border-neutral-200"
                    >
                      {{ tag }}
                    </span>
                  </div>
                </div>
              </div>
              <div v-else class="rounded-xl border border-neutral-200 bg-neutral-50/50 p-6 text-center text-sm text-neutral-500">
                Belum ada peran kontributor yang didefinisikan secara spesifik.
              </div>
            </article>

            <!-- Card 5: Yang Bisa Kamu Dapatkan -->
            <article class="rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8 space-y-4 shadow-xs">
              <h2 class="font-title-3 font-bold text-neutral-900">Yang bisa kamu dapatkan</h2>
              <p v-if="project.contributor_outcome" class="text-neutral-600 font-paragraph-2 leading-relaxed">
                {{ project.contributor_outcome }}
              </p>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                <div
                  v-for="item in contributorBenefits"
                  :key="item.title"
                  class="rounded-xl border border-neutral-200 bg-neutral-50/50 p-4 space-y-1"
                >
                  <h3 class="font-label-2 font-bold text-neutral-900">{{ item.title }}</h3>
                  <p class="text-xs text-neutral-600 leading-relaxed">{{ item.description }}</p>
                </div>
              </div>
            </article>

            <!-- Card 6: Komitmen Pemilik Proyek -->
            <article class="rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8 space-y-3 shadow-xs">
              <h2 class="font-title-3 font-bold text-neutral-900">Komitmen pemilik proyek</h2>
              <p class="text-neutral-600 font-paragraph-2 leading-relaxed">
                {{ ownerCommitmentText }}
              </p>
            </article>
          </div>

          <!-- RIGHT COLUMN / SIDEBAR: Summary & Actions -->
          <div class="lg:col-span-4 flex flex-col gap-6 lg:sticky lg:top-6">
            <!-- Card 1: Ringkasan Proyek -->
            <article class="rounded-2xl border border-neutral-200 bg-white p-6 sm:p-7 space-y-6 shadow-xs">
              <h2 class="font-title-3 font-bold text-neutral-900">Ringkasan proyek</h2>

              <div class="space-y-3.5 divide-y divide-neutral-100">
                <div class="flex items-center justify-between text-sm pt-1 first:pt-0">
                  <span class="text-neutral-500">Status</span>
                  <span class="font-semibold text-neutral-900">{{ statusLabel }}</span>
                </div>
                <div class="flex items-center justify-between text-sm pt-3">
                  <span class="text-neutral-500">Mulai</span>
                  <span class="font-semibold text-neutral-900">{{ formattedStartDate || 'Fleksibel' }}</span>
                </div>
                <div class="flex items-center justify-between text-sm pt-3">
                  <span class="text-neutral-500">Target selesai</span>
                  <span class="font-semibold text-neutral-900">{{ formattedDeadline || 'Fleksibel' }}</span>
                </div>
                <div class="flex items-center justify-between text-sm pt-3">
                  <span class="text-neutral-500">Komitmen</span>
                  <span class="font-semibold text-neutral-900">{{ commitmentLabel }}</span>
                </div>
                <div class="flex items-center justify-between text-sm pt-3">
                  <span class="text-neutral-500">Tim</span>
                  <span class="font-semibold text-neutral-900">{{ teamCountLabel }}</span>
                </div>
              </div>

              <!-- CTA Actions -->
              <div class="space-y-2.5 pt-2">
                <template v-if="!user">
                  <AtomicButton
                    to="/login"
                    variant="primary"
                    block
                    class="!py-3 !rounded-xl !bg-[#4f46e5] hover:!bg-[#4338ca] text-white font-semibold !text-sm shadow-xs"
                  >
                    Login untuk Melamar
                  </AtomicButton>
                </template>

                <template v-else-if="isOwner">
                  <div class="flex flex-col gap-2.5">
                    <AtomicButton
                      v-if="project.status === 'in_progress'"
                      :to="`/projects/${project.slug}/workspace`"
                      variant="primary"
                      block
                      class="!py-3 !rounded-xl !bg-[#4f46e5] hover:!bg-[#4338ca] text-white font-semibold !text-sm shadow-xs"
                    >
                      Buka Workspace
                    </AtomicButton>
                    <AtomicButton
                      :to="`/projects/${project.slug}/applicants`"
                      :variant="project.status === 'in_progress' ? 'secondary' : 'primary'"
                      block
                      class="!py-3 !rounded-xl !bg-[#4f46e5] hover:!bg-[#4338ca] text-white font-semibold !text-sm shadow-xs"
                    >
                      Kelola Pelamar
                    </AtomicButton>
                    <AtomicButton
                      :to="`/projects/${project.slug}/edit`"
                      variant="outline"
                      block
                      class="!py-3 !rounded-xl font-semibold !text-sm"
                    >
                      Edit Proyek
                    </AtomicButton>
                  </div>
                </template>

                <template v-else-if="hasActiveApplication && applicationMessage">
                  <div class="rounded-xl border border-primary-200 bg-primary-50 p-4 mb-2">
                    <p class="font-label-2 text-primary-900">{{ applicationMessage.title }}</p>
                    <p class="mt-1 text-xs text-primary-700 leading-relaxed">{{ applicationMessage.body }}</p>
                  </div>
                  <div class="flex flex-col gap-2.5">
                    <AtomicButton
                      v-if="currentApplication?.status === 'accepted' && project.status === 'in_progress'"
                      :to="`/projects/${project.slug}/workspace`"
                      variant="primary"
                      block
                      class="!py-3 !rounded-xl !bg-[#4f46e5] hover:!bg-[#4338ca] text-white font-semibold !text-sm shadow-xs"
                    >
                      Buka Workspace
                    </AtomicButton>
                    <AtomicButton
                      to="/projects/my-applications"
                      variant="primary"
                      block
                      class="!py-3 !rounded-xl !bg-[#4f46e5] hover:!bg-[#4338ca] text-white font-semibold !text-sm shadow-xs"
                    >
                      Lihat Lamaran Saya
                    </AtomicButton>
                  </div>
                </template>

                <template v-else-if="canApply">
                  <button
                    type="button"
                    class="w-full py-3 px-4 rounded-xl font-semibold text-sm text-white bg-[#4f46e5] hover:bg-[#4338ca] active:bg-[#3730a3] transition-colors shadow-xs disabled:bg-neutral-300 disabled:text-neutral-500 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center"
                    :disabled="!isVerified"
                    @click="isVerified ? (showApplyModal = true) : null"
                  >
                    Ajukan Kontribusi
                  </button>
                </template>

                <template v-else>
                  <div class="rounded-xl border border-neutral-200 bg-neutral-50 p-4 text-center text-sm font-medium text-neutral-600">
                    {{ openSlots === 0 ? 'Slot untuk proyek ini sudah penuh.' : 'Proyek ini belum membuka lamaran baru.' }}
                  </div>
                </template>

                <p class="text-xs text-neutral-500 text-center leading-relaxed">
                  Pastikan profil dan ketersediaanmu sudah sesuai sebelum mengajukan kontribusi.
                </p>
                <p v-if="user && !isOwner && !isVerified" class="text-xs text-danger-600 text-center font-medium">
                  Verifikasi email Anda terlebih dahulu untuk melamar.
                </p>
              </div>
            </article>

            <!-- Card 2: Transparansi Proyek -->
            <article class="rounded-2xl border border-neutral-200 bg-white p-6 sm:p-7 space-y-4 shadow-xs">
              <h2 class="font-title-3 font-bold text-neutral-900">Transparansi proyek</h2>
              <ul class="space-y-3">
                <li
                  v-for="item in transparencyItems"
                  :key="item"
                  class="flex items-center gap-2.5 text-sm text-neutral-700"
                >
                  <svg class="w-4 h-4 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{{ item }}</span>
                </li>
              </ul>
            </article>
          </div>
        </div>
      </div>

      <!-- Mobile Sticky Bottom CTA Bar -->
      <div
        class="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-neutral-200 px-4 py-3 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] transition-all duration-300 lg:hidden"
        :class="showStickyBar ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'"
      >
        <div class="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div class="min-w-0 flex-1">
            <p class="font-label-2 text-neutral-900 truncate">{{ project.title }}</p>
            <p class="text-xs text-neutral-500 mt-0.5">
              <span class="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1"></span>
              {{ openSlots }} slot tersedia
            </p>
          </div>
          <div class="shrink-0">
            <template v-if="!user">
              <AtomicButton to="/login" variant="primary" size="sm" class="!rounded-xl font-semibold">
                Login
              </AtomicButton>
            </template>
            <template v-else-if="isOwner">
              <AtomicButton :to="`/projects/${project.slug}/applicants`" variant="primary" size="sm" class="!rounded-xl font-semibold">
                Kelola Pelamar
              </AtomicButton>
            </template>
            <template v-else-if="hasActiveApplication">
              <AtomicButton to="/projects/my-applications" variant="primary" size="sm" class="!rounded-xl font-semibold">
                Lamaran Saya
              </AtomicButton>
            </template>
            <template v-else-if="canApply">
              <button
                type="button"
                class="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#4f46e5] hover:bg-[#4338ca] transition-colors disabled:bg-neutral-300 cursor-pointer"
                :disabled="!isVerified"
                @click="isVerified ? (showApplyModal = true) : null"
              >
                Ajukan Kontribusi
              </button>
            </template>
          </div>
        </div>
      </div>
    </div>

    <!-- Apply Modal -->
    <ProjectApplyModal
      v-if="project"
      :project-id="project.id"
      :roles="availableRoles"
      :show="showApplyModal"
      @close="showApplyModal = false"
      @applied="handleApplied"
    />
  </div>
</template>

<script setup lang="ts">
import type { Application, Project, ProjectRole, ProjectStatus } from '~/types/project'
import type { ProjectEditorRecord } from '~/types/project-editor'
import { getProjectCategoryLabel } from '~/constants/projectCategory'
import { createProjectEditorFixture } from '~/data/project-editor-fixtures'
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'

definePageMeta({
  layout: 'home',
  homeNavbar: {
    mainHorizontalPadding: 'none',
    mainWidth: 'wide'
  }
})

const route = useRoute()
const { getProjectBySlug, getMyApplications } = useProjects()
const { user, isVerified, currentUserId } = useAuth()

const projectSlug = route.params.slug as string

// Transformer to adapt fixture into Project format for development preview
const transformFixtureToProject = (fixture: ProjectEditorRecord): Project => {
  const draft = fixture.draft
  return {
    id: fixture.id,
    creator_id: 'user-syahrul-fahmi',
    title: draft.title,
    slug: draft.slug,
    summary: draft.summary,
    description:
      draft.description ||
      'Proyek ini berangkat dari kebutuhan untuk membantu talent menunjukkan pengalaman nyata, bukan hanya daftar skill. Tim akan mengeksplorasi struktur portfolio, experience record, serta bagaimana kontribusi dalam sebuah proyek dapat ditampilkan secara kredibel.',
    project_category: draft.project_category,
    visibility: draft.visibility,
    status: fixture.status as ProjectStatus,
    max_slots: 4,
    start_date: draft.start_date || '2026-10-12',
    deadline: draft.deadline || '2026-11-30',
    why_join: draft.why_collaborative,
    why_collaborative:
      draft.why_collaborative ||
      'Proyek membutuhkan perspektif frontend, desain, dan product thinking. Owner tetap terlibat dalam discovery, pengambilan keputusan, serta review implementasi.',
    contributor_outcome: draft.contributor_outcome,
    owner_commitment:
      draft.owner_commitment ||
      'Pemilik proyek akan terlibat dalam perencanaan, diskusi kebutuhan, review hasil, dan pengambilan keputusan. Proyek ini tidak ditujukan sebagai ruang untuk sekadar mendelegasikan pekerjaan kepada kontributor.',
    hours_per_week: draft.hours_per_week || 10,
    origin: draft.origin || 'personal',
    created_at: fixture.saved_at,
    published_at: fixture.saved_at,
    profiles: {
      username: 'syahrulfahmi',
      full_name: 'Syahrul Fahmi',
      avatar: null,
      is_verified: true
    },
    creator: {
      username: 'syahrulfahmi',
      full_name: 'Syahrul Fahmi',
      avatar: null,
      is_verified: true
    },
    project_roles: [
      {
        id: 'role-frontend-1',
        contribution_role_id: 'role-frontend',
        contribution_role: {
          id: 'role-frontend',
          name: 'Frontend Developer',
          slug: 'frontend',
          category: 'Contribution Role'
        },
        custom_title: 'Frontend Developer',
        description:
          'Membantu implementasi antarmuka, integrasi API, dan memastikan pengalaman pengguna tetap konsisten.',
        capacity: 2,
        filled_capacity: 0,
        remaining_capacity: 2,
        status: 'open',
        tools: [
          { id: 'tool-nuxt', name: 'Nuxt.js', slug: 'nuxt', category: 'Framework' },
          { id: 'tool-vue', name: 'Vue.js', slug: 'vue', category: 'Framework' },
          { id: 'tool-ts', name: 'TypeScript', slug: 'typescript', category: 'Language' },
          { id: 'tool-design', name: 'UI/UX Design', slug: 'ui-ux-design', category: 'Design' }
        ],
        skill_tags: ['Nuxt.js', 'Vue.js', 'TypeScript', 'UI/UX Design']
      }
    ],
    project_skills: [],
    project_technologies: [],
    project_members: [
      {
        id: 'member-1',
        project_id: fixture.id,
        profile_id: 'user-member-1',
        role: 'contributor',
        joined_at: fixture.saved_at,
        profiles: {
          username: 'member1',
          full_name: 'Member 1',
          avatar: null
        }
      },
      {
        id: 'member-2',
        project_id: fixture.id,
        profile_id: 'user-member-2',
        role: 'contributor',
        joined_at: fixture.saved_at,
        profiles: {
          username: 'member2',
          full_name: 'Member 2',
          avatar: null
        }
      }
    ]
  }
}

const {
  data: project,
  error,
  pending,
  refresh: refreshProject
} = await useAsyncData<Project | null>(`project-${projectSlug}`, async () => {
  const result = await getProjectBySlug(projectSlug)
  if (!result && import.meta.dev) {
    const fixture = createProjectEditorFixture(projectSlug)
    if (fixture) {
      return transformFixtureToProject(fixture)
    }
  }
  return result
})

useHead({
  title: project.value
    ? `${project.value.title} - Kolaboria`
    : 'Project - Kolaboria'
})

const { data: myApps, refresh: refreshApps } = await useAsyncData<Application[]>(
  `my-apps-${projectSlug}`,
  () => (user.value ? getMyApplications() : Promise.resolve([])),
  { server: false }
)

const currentApplication = computed(() => {
  const projectApps =
    myApps.value?.filter((app) => app.project_id === project.value?.id) ?? []
  return projectApps[0] || null
})

const hasApplied = computed(() => !!currentApplication.value)

const isOwner = computed(
  () =>
    !!currentUserId.value && currentUserId.value === project.value?.creator_id
)

const members = computed(
  () =>
    project.value?.project_members?.filter(
      (member) => member.role === 'contributor'
    ) ?? []
)

const totalRoleCapacity = computed(() => {
  const total =
    project.value?.project_roles?.reduce(
      (acc, role) => (role.status === 'archived' ? acc : acc + role.capacity),
      0
    ) ?? 0
  return total > 0 ? total : 4
})

const openSlots = computed(() => {
  return (
    project.value?.project_roles?.reduce(
      (total, role) =>
        role.status === 'archived'
          ? total
          : total + Math.max(role.remaining_capacity, 0),
      0
    ) ?? 2
  )
})

const availableRoles = computed(
  () =>
    project.value?.project_roles?.filter(
      (role) => role.status === 'open' && role.remaining_capacity > 0
    ) ?? []
)

const visibleRoles = computed(
  () =>
    project.value?.project_roles?.filter(
      (role) => role.status !== 'archived'
    ) ?? []
)

const canReapply = computed(() => {
  if (!currentApplication.value) return false
  const status = currentApplication.value.status
  if (status === 'withdrawn') return true
  if (status === 'rejected') {
    const appliedDate = new Date(currentApplication.value.applied_at)
    const threeDaysInMs = 3 * 24 * 60 * 60 * 1000
    return Date.now() - appliedDate.getTime() >= threeDaysInMs
  }
  return false
})

const hasActiveApplication = computed(() => {
  if (!currentApplication.value) return false
  return !canReapply.value
})

const canApply = computed(() => {
  if (!user.value) return false
  if (isOwner.value) return false
  const alreadyMember = members.value.some(
    (member) =>
      member.profile_id === currentUserId.value && member.status === 'active'
  )
  if (alreadyMember) return false
  if (project.value?.status !== 'open' || availableRoles.value.length === 0)
    return false
  return !hasApplied.value || canReapply.value
})

const formatDate = (date: string | null | undefined) => {
  if (!date) return null
  const d = new Date(date)
  if (isNaN(d.getTime())) return null
  return d.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

const formattedDeadline = computed(() => formatDate(project.value?.deadline))
const formattedStartDate = computed(() => formatDate(project.value?.start_date))

const creatorName = computed(
  () =>
    project.value?.profiles?.full_name ||
    project.value?.profiles?.username ||
    'Syahrul Fahmi'
)

const creatorUsername = computed(() => project.value?.profiles?.username)
const creatorInitial = computed(() => {
  const parts = creatorName.value.trim().split(/\s+/)
  const first = parts[0]
  const second = parts[1]
  if (parts.length >= 2 && first && second) {
    return (first.charAt(0) + second.charAt(0)).toUpperCase()
  }
  return creatorName.value.slice(0, 2).toUpperCase()
})
const creatorAvatar = computed(
  () => project.value?.profiles?.avatar || project.value?.creator?.avatar || null
)
const isCreatorVerified = computed(
  () => project.value?.profiles?.is_verified ?? project.value?.creator?.is_verified ?? true
)

const originLabels: Record<string, string> = {
  personal: 'Proyek pribadi',
  community: 'Komunitas',
  experiment: 'Eksperimen',
  client: 'Proyek klien'
}

const projectOriginLabel = computed(() => {
  if (project.value?.origin && originLabels[project.value.origin]) {
    return originLabels[project.value.origin]
  }
  return 'Proyek pribadi'
})

const collaborationFormatLabel = computed(() => {
  if (project.value?.project_category === 'product') {
    return 'Portfolio & product exploration'
  }
  if (project.value?.project_category === 'community') {
    return 'Community initiative & open collaboration'
  }
  if (project.value?.project_category === 'open_source') {
    return 'Open source & public contribution'
  }
  return 'Portfolio & product exploration'
})

const statusBadgeText = computed(() => {
  if (project.value?.status === 'open') return 'Menerima kontributor'
  if (project.value?.status === 'in_progress') return 'Sedang berjalan'
  if (project.value?.status === 'completed') return 'Selesai'
  if (project.value?.status === 'draft') return 'Draf'
  return 'Diarsipkan'
})

const statusBadgeClass = computed(() => {
  switch (project.value?.status) {
    case 'open':
      return 'bg-emerald-50 text-emerald-700 border border-emerald-200'
    case 'in_progress':
      return 'bg-amber-50 text-amber-700 border border-amber-200'
    case 'completed':
      return 'bg-blue-50 text-blue-700 border border-blue-200'
    case 'draft':
      return 'bg-neutral-100 text-neutral-700 border border-neutral-200'
    default:
      return 'bg-neutral-100 text-neutral-600 border border-neutral-200'
  }
})

const statusLabel = computed(() => {
  switch (project.value?.status) {
    case 'open':
      return 'Terbuka'
    case 'in_progress':
      return 'Sedang Berjalan'
    case 'completed':
      return 'Selesai'
    case 'draft':
      return 'Draf'
    default:
      return 'Diarsipkan'
  }
})

const commitmentLabel = computed(() => {
  if (project.value?.hours_per_week) {
    return `± ${project.value.hours_per_week} jam/minggu`
  }
  return '± 10 jam/minggu'
})

const teamCountLabel = computed(() => {
  const currentCount = members.value.length > 0 ? members.value.length : 2
  return `${currentCount} / ${totalRoleCapacity.value} orang`
})

const collaborativeReason = computed(() => {
  return (
    project.value?.why_collaborative ||
    project.value?.why_join ||
    'Proyek membutuhkan perspektif frontend, desain, dan product thinking. Owner tetap terlibat dalam discovery, pengambilan keputusan, serta review implementasi.'
  )
})

const ownerCommitmentText = computed(() => {
  return (
    project.value?.owner_commitment ||
    'Pemilik proyek akan terlibat dalam perencanaan, diskusi kebutuhan, review hasil, dan pengambilan keputusan. Proyek ini tidak ditujukan sebagai ruang untuk sekadar mendelegasikan pekerjaan kepada kontributor.'
  )
})

const descriptionParagraphs = computed(() => {
  const description =
    project.value?.description?.trim() ||
    'Proyek ini berangkat dari kebutuhan untuk membantu talent menunjukkan pengalaman nyata, bukan hanya daftar skill. Tim akan mengeksplorasi struktur portfolio, experience record, serta bagaimana kontribusi dalam sebuah proyek dapat ditampilkan secara kredibel.'
  return description
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
})

const getRoleTags = (role: ProjectRole): string[] => {
  const toolNames = role.tools?.map((tool) => tool.name) || []
  const skillNames = Array.isArray(role.skill_tags) ? role.skill_tags : []
  const tags = [...new Set([...toolNames, ...skillNames])]
  if (tags.length > 0) return tags
  if (project.value?.project_technologies?.length) {
    return project.value.project_technologies.map((t) => t.tool.name).slice(0, 4)
  }
  return ['Nuxt.js', 'Vue.js', 'TypeScript', 'UI/UX Design']
}

const contributorBenefits = [
  {
    title: 'Pengalaman proyek nyata',
    description: 'Terlibat langsung dari proses implementasi hingga evaluasi.'
  },
  {
    title: 'Bukti kontribusi',
    description: 'Proyek dapat menjadi bagian dari rekam pengalaman di Kolaboria.'
  },
  {
    title: 'Ownership yang jelas',
    description: 'Kontribusimu tercatat sebagai bagian dari hasil proyek.'
  },
  {
    title: 'Kolaborasi lintas skill',
    description: 'Bekerja bersama talent lain dengan kemampuan berbeda.'
  }
]

const transparencyItems = [
  'Pemilik proyek terverifikasi',
  'Tujuan kolaborasi dijelaskan',
  'Peran kontributor jelas',
  'Hasil kontribusi dapat dicatat'
]

const applicationMessage = computed(() => {
  if (!currentApplication.value) return null

  switch (currentApplication.value.status) {
    case 'pending':
      return {
        title: 'Lamaranmu sedang ditinjau',
        body: 'Pemilik project akan meninjau motivasi dan kontribusimu.'
      }
    case 'accepted':
      return {
        title: 'Lamaranmu diterima',
        body: 'Kamu sudah masuk ke alur kolaborasi project ini.'
      }
    case 'rejected': {
      const appliedDate = new Date(currentApplication.value.applied_at)
      const waitingPeriod = 3 * 24 * 60 * 60 * 1000
      const timePassed = Date.now() - appliedDate.getTime()
      if (timePassed < waitingPeriod) {
        const timeLeft = waitingPeriod - timePassed
        const days = Math.floor(timeLeft / (24 * 60 * 60 * 1000))
        const hours = Math.floor(
          (timeLeft % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000)
        )
        const minutes = Math.floor((timeLeft % (60 * 60 * 1000)) / (60 * 1000))

        let timeLeftText = ''
        if (days > 0) {
          timeLeftText = `${days} hari ${hours} jam`
        } else if (hours > 0) {
          timeLeftText = `${hours} jam ${minutes} menit`
        } else {
          timeLeftText = `${minutes} menit`
        }

        return {
          title: 'Lamaranmu belum diterima',
          body: `Kamu dapat melamar kembali setelah masa tunggu berakhir (sisa waktu: ${timeLeftText}).`
        }
      }
      return {
        title: 'Lamaranmu belum diterima',
        body: 'Kamu tetap bisa mengeksplor project lain yang lebih cocok.'
      }
    }
    case 'withdrawn':
      return {
        title: 'Lamaran ditarik kembali',
        body: 'Status lamaran ini sudah tidak aktif.'
      }
    default:
      return null
  }
})

const showApplyModal = ref(false)

const handleApplied = async () => {
  await refreshApps()
  await refreshProject()
}

// Mobile scroll listener for sticky bottom bar
const heroSection = ref<HTMLElement | null>(null)
const showStickyBar = ref(false)
let scrollHandler: () => void

const isMobile = ref(false)
const updateIsMobile = () => {
  if (typeof window !== 'undefined') {
    isMobile.value = window.innerWidth < 1024
  }
}

const setupScrollListener = () => {
  updateIsMobile()
  scrollHandler = () => {
    const heroBottom = heroSection.value?.getBoundingClientRect().bottom ?? 0
    showStickyBar.value = isMobile.value && heroBottom <= 40
  }
  window.addEventListener('scroll', scrollHandler, { passive: true })
  window.addEventListener(
    'resize',
    () => {
      updateIsMobile()
      const heroBottom = heroSection.value?.getBoundingClientRect().bottom ?? 0
      showStickyBar.value = isMobile.value && heroBottom <= 40
    },
    { passive: true }
  )
}

onMounted(() => {
  setupScrollListener()
  if (scrollHandler) scrollHandler()
})

onBeforeUnmount(() => {
  if (typeof window !== 'undefined' && scrollHandler) {
    window.removeEventListener('scroll', scrollHandler)
  }
})
</script>
