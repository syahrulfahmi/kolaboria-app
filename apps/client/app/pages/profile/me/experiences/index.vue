<script setup lang="ts">
import type { ExperienceCard } from '../../../../types/experience'

definePageMeta({ layout: 'home', middleware: ['auth', 'onboarding-guard'] })

const DUMMY_EXPERIENCES: ExperienceCard[] = [
  {
    id: 'a8f8e8dd-4f91-4b70-9a43-6c5d3e9a1001',
    slug: 'platform-belajar-kolaboratif',
    project_id: 'b7c7d7cc-3e80-4a61-8932-5b4c2d8b2001',
    project_title: 'Platform Belajar Kolaboratif',
    project_slug: 'platform-belajar-kolaboratif',
    project_summary:
      'Membangun ruang belajar online yang membantu mentor dan peserta berkolaborasi dalam project nyata.',
    contribution_role: 'Frontend Developer',
    membership_role: 'contributor',
    joined_at: '2026-02-10T08:00:00Z',
    left_at: '2026-04-25T17:00:00Z',
    project_started_at: '2026-02-01T08:00:00Z',
    project_ended_at: '2026-04-30T17:00:00Z',
    outcome:
      'MVP berhasil dirilis dan digunakan oleh 120 peserta pada batch pertama.',
    record_status: 'finalized',
    record_status_label: 'Rekam kontribusi siap dibagikan',
    integrity_status: 'valid',
    visibility: 'public',
    visibility_label: 'Publik',
    snapshot_version: 2,
    generated_at: '2026-05-01T09:30:00Z',
    metrics: {
      assigned_tasks: 12,
      completed_tasks: 11,
      discussions: 28,
      activity_events: 64,
      deliverables: 4,
      team_size: 5
    },
    highlight_count: 3,
    username: 'fahmi',
    full_name: 'Fahmi Syahrul'
  },
  {
    id: 'c9a9f9ee-5fa2-4c81-ab54-7d6e4f0b3002',
    slug: 'dashboard-dampak-sosial',
    project_id: 'd8b8e8dd-4e91-4b72-9a43-6c5d3e9a4002',
    project_title: 'Dashboard Dampak Sosial',
    project_slug: 'dashboard-dampak-sosial',
    project_summary:
      'Dashboard internal untuk merangkum perkembangan program sosial dan aktivitas relawan.',
    contribution_role: 'Product Designer',
    membership_role: 'contributor',
    joined_at: '2026-06-03T08:00:00Z',
    left_at: null,
    project_started_at: '2026-06-01T08:00:00Z',
    project_ended_at: null,
    outcome: null,
    record_status: 'collecting',
    record_status_label: 'Sedang mengumpulkan kontribusi',
    integrity_status: 'under_review',
    visibility: 'private',
    visibility_label: 'Privat',
    snapshot_version: 1,
    generated_at: null,
    metrics: {
      assigned_tasks: 7,
      completed_tasks: 4,
      discussions: 16,
      activity_events: 31,
      deliverables: 2,
      team_size: 4
    },
    highlight_count: 1,
    username: 'fahmi',
    full_name: 'Fahmi Syahrul'
  }
]

const { experiences, listMine, loading, error } = useExperiences()
await useAsyncData('my-experiences', async () => {
  const result = await listMine()

  if (!result.length) experiences.value = DUMMY_EXPERIENCES

  return experiences.value
})
</script>
<template>
  <div class="mx-auto max-w-5xl space-y-6 px-4 py-8">
    <header>
      <p class="text-xs font-semibold uppercase tracking-wide text-primary-700">
        Personal branding
      </p>
      <h1 class="mt-1 text-3xl font-semibold text-secondary-900">
        Rekam Kontribusi Saya
      </h1>
      <p class="mt-2 text-sm text-neutral-600">
        Tinjau fakta kontribusi project, tambahkan konteks personal, dan pilih
        apakah rekam akan dibagikan.
      </p>
    </header>
    <MoleculeLoading v-if="loading" label="Memuat rekam kontribusi..." />
    <p
      v-else-if="error"
      class="rounded-xl bg-danger-50 p-4 text-sm text-danger-700"
    >
      {{ error }}
    </p>
    <div v-else-if="experiences.length" class="space-y-4">
      <ExperienceCard
        v-for="experience in experiences"
        :key="experience.id"
        :experience="experience"
        :owner="true"
      />
    </div>
    <div
      v-else
      class="rounded-2xl border border-dashed border-neutral-300 bg-white p-8 text-center text-sm text-neutral-600"
    >
      Belum ada project selesai yang menghasilkan rekam kontribusi.
    </div>
  </div>
</template>
