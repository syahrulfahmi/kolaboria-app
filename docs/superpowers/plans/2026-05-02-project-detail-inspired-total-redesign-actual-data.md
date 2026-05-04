# Project Detail Inspired Total Redesign Actual Data Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:executing-plans` untuk mengeksekusi plan ini task-by-task. Step menggunakan checkbox (`- [ ]`) supaya progres mudah dilacak.

**Goal:** Mendesain ulang total `apps/client/app/pages/projects/[slug].vue` mengikuti arah visual dari contoh kode user, tetapi tetap memakai data aktual Kolaboria dari `useProjects()` dan `types/project.ts`.

**Architecture:** Jangan pakai direct Supabase query di page seperti contoh kode. Tetap pakai `useProjects().getProjectBySlug()` dan `getMyApplications()` yang sudah ada. Buat view-model computed di page untuk menerjemahkan data aktual (`summary`, `description`, `type`, `status`, `max_slots`, `start_date`, `deadline`, `tech_stack`, `why_join`, `profiles`, `project_skills`, `project_members`) ke UI seperti hero stats, requirements, timeline, team/member list, dan CTA state.

**Tech Stack:** Nuxt 4, Vue 3 `<script setup>`, Tailwind token classes Kolaboria, existing components `AtomicButton`, `AtomicTag`, `MoleculeTicker`, `ProjectStatusBadge`, `ApplyModal`.

---

## Data Interpretation Yang Wajib Dipakai

Contoh kode user memakai data mock seperti `project.company`, `project.timeline.duration`, `project.requirements.skills`, `project.team`, `project.tags`, `project.spots`, dan `project.applicants`. Field itu tidak ada di `apps/client/app/types/project.ts`, jadi mapping-nya harus seperti ini:

| UI dari contoh | Data aktual Kolaboria | Catatan |
| --- | --- | --- |
| `project.company` | `creatorName` dari `project.profiles.full_name || username` | Label UI diganti menjadi creator/pemilik project, bukan company. |
| `project.description` hero | `project.summary` | Summary cocok untuk hero. |
| `project.fullDescription` | `project.description` | Render sebagai konten panjang. |
| `project.badge` | `ProjectStatusBadge :status="project.status"` | Jangan buat `badgeClass` mock. |
| `project.timeline.type` | `typeLabel[project.type]` | Ini kategori project, bukan work type. |
| `project.timeline.startDate` | `formattedStartDate` dari `project.start_date` | Fallback `Fleksibel`. |
| `project.timeline.duration` | computed `projectDurationLabel` dari `start_date` ke `deadline` | Jika salah satu kosong, tampilkan `Belum ditentukan`. |
| `project.requirements.skills` | `project.project_skills` | Required dan optional dipisah dari `is_required`. |
| `project.requirements.experience` | Tidak ada | Jangan tampilkan, atau ganti dengan `Kategori Project`. |
| `project.requirements.commitment` | Tidak ada | Jangan tampilkan, atau ganti dengan `Kapasitas Tim`. |
| `project.team` | `project.project_members` role `contributor` | Avatar pakai initial jika `avatar` kosong. |
| `project.tags` | gabungan `tech_stack` dan skill tags | Render sebagai link-like chips tanpa navigasi. |
| `project.spots` | `openSlots` | Dihitung dari `max_slots - contributor count`. |
| `project.applicants` | `currentApplication ? 1 : 0` tidak valid untuk global applicants | Jangan klaim jumlah pelamar aktif karena query detail project belum mengambil applicants. |

---

## File Yang Diubah

- Modify: `apps/client/app/pages/projects/[slug].vue`
- Optional update: `docs/superpowers/plans/2026-05-02-project-detail-inspired-total-redesign-actual-data.md`

Tidak membuat composable baru. Tidak menambah direct Supabase query. Tidak membuat route `/projects/:slug/apply` karena flow aktual memakai `ApplyModal`.

---

## Task 1: Bersihkan Dan Lengkapi View Model Data Aktual

**Files:**
- Modify: `apps/client/app/pages/projects/[slug].vue`

- [ ] Pertahankan data fetching existing:
  - `getProjectBySlug(projectSlug)`
  - `getMyApplications()`
  - `ApplyModal`
- [ ] Tambahkan computed `projectDurationLabel` dari `project.start_date` dan `project.deadline`.
- [ ] Tambahkan computed `heroStats` berbasis data aktual:
  - `openSlots`
  - `members.length`
  - `projectDurationLabel`
- [ ] Tambahkan computed `contentTags` dari `tech_stack` dan `project_skills`.
- [ ] Tambahkan computed `timelineStatusLabel` dari `project.status`.
- [ ] Tambahkan computed `descriptionParagraphs` dari `project.description`.
- [ ] Jangan buat `loading`, `project = ref<any>()`, `supabase.from('projects')`, atau `router.push('/projects/:slug/apply')`.

Kode target:

```ts
const projectDurationLabel = computed(() => {
  if (!project.value?.start_date || !project.value?.deadline) {
    return 'Belum ditentukan'
  }

  const start = new Date(project.value.start_date)
  const end = new Date(project.value.deadline)
  const diffInMonths =
    (end.getFullYear() - start.getFullYear()) * 12 +
    (end.getMonth() - start.getMonth())

  return diffInMonths > 0 ? `${diffInMonths} Bulan` : '< 1 Bulan'
})

const heroStats = computed(() => [
  {
    label: 'Slot Tersedia',
    value: openSlots.value,
    icon: 'slots'
  },
  {
    label: 'Kontributor',
    value: members.value.length,
    icon: 'members'
  },
  {
    label: 'Estimasi Waktu',
    value: projectDurationLabel.value,
    icon: 'duration'
  }
])

const contentTags = computed(() => {
  const techTags = project.value?.tech_stack ?? []
  const skillTags =
    project.value?.project_skills?.map((skill) => skill.skill_tags.name) ?? []
  return [...new Set([...techTags, ...skillTags])].slice(0, 12)
})

const timelineStatusLabel = computed(() =>
  project.value?.status === 'open'
    ? 'Pendaftaran Terbuka'
    : project.value?.status === 'in_progress'
      ? 'Sedang Berjalan'
      : project.value?.status === 'completed'
        ? 'Selesai'
        : 'Belum Membuka Lamaran'
)

const descriptionParagraphs = computed(() => {
  const description = project.value?.description?.trim()
  if (!description) return []
  return description
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
})
```

---

## Task 2: Redesign Hero Mengikuti Referensi, Tanpa Hardcoded Style

**Files:**
- Modify: `apps/client/app/pages/projects/[slug].vue`

- [ ] Buat hero full-width gelap dengan `bg-secondary-900`.
- [ ] Jangan memakai inline `style` gradient hex seperti contoh. Pakai token class:
  - `bg-secondary-900`
  - layer `bg-secondary-800`
  - border `border-secondary-700`
  - aksen `bg-primary-500`, `bg-accent-400`
- [ ] Tambahkan visual texture dengan div token-based, bukan radial gradient inline.
- [ ] Hero kiri berisi:
  - breadcrumb pill `Proyek Kolaborasi`
  - `ProjectStatusBadge`
  - `coverLabel`
  - title
  - summary
  - creator row
  - hero stat chips dari `heroStats`
- [ ] Hero kanan berisi visual illustration “project canvas”:
  - panel brief
  - progress bar `slotProgress`
  - node chips dari `contentTags.slice(0, 5)`
  - capacity mini metrics
- [ ] Mobile: hero visual kanan boleh hidden di `lg`, tetapi stat chips tetap terlihat.

Catatan desain:
- Referensi memakai `bg-gray-*`, `text-gray-*`, inline hex, dan opacity arbitrary. Untuk Kolaboria, gunakan `neutral-*`, `secondary-*`, `primary-*`, `accent-*`.
- Hindari emoji untuk not-found visual. Gunakan `OrganismEmptyState` jika sesuai, atau text-only state yang bersih.

---

## Task 3: Redesign Content Column Sesuai Data Aktual

**Files:**
- Modify: `apps/client/app/pages/projects/[slug].vue`

- [ ] Layout body: `max-w-6xl`, `lg:grid-cols-[1.65fr_0.8fr]`, `gap-12`.
- [ ] Content kiri memakai section editorial terbuka, bukan banyak card.
- [ ] Section `Deskripsi Proyek`:
  - Render dari `descriptionParagraphs`.
  - Fallback jika tidak ada description: tampilkan `project.summary`.
- [ ] Section `Persyaratan`:
  - Skills dari `requiredSkills` dan `optionalSkills`.
  - Ganti `Level Kompetensi` contoh dengan `Kategori Project`.
  - Ganti `Komitmen Waktu` contoh dengan `Kapasitas Tim`.
- [ ] Section `Timeline`:
  - Start date dari `formattedStartDate || 'Fleksibel'`.
  - Durasi dari `projectDurationLabel`.
  - Sistem/Kategori dari `coverLabel`.
  - Status dari `timelineStatusLabel`.
- [ ] Section `Tim Proyek`:
  - Render `members`.
  - Jika kosong, tampilkan teks “Belum ada anggota yang bergabung.”
- [ ] Section `Kenapa Bergabung`:
  - Render `project.why_join` jika ada.
  - Pakai aksen amber sebagai semantic signal.

---

## Task 4: Sticky Sidebar CTA Sesuai Flow Aktual

**Files:**
- Modify: `apps/client/app/pages/projects/[slug].vue`

- [ ] Sidebar desktop: `lg:sticky lg:top-20`.
- [ ] CTA card memakai token colors, tidak inline gradient hex.
- [ ] State CTA:
  - `!user`: `MoleculeTicker` login.
  - `isOwner`: tombol `Kelola Pelamar`.
  - `currentApplication`: tombol `Lihat Lamaran Saya` ke `/projects/my-applications`.
  - `canApply`: tombol `Apply Project Ini` membuka `ApplyModal`.
  - `openSlots === 0`: warning slot penuh.
  - project bukan `open`: info belum membuka lamaran.
- [ ] Jangan pakai `navigateToApplication()` ke `/projects/:slug/apply`.
- [ ] Jangan pakai `AtomicButton variant="white"` karena variant itu tidak ada di `AtomicButton` saat ini.
- [ ] Tambahkan ringkasan kecil di CTA:
  - creator
  - open slots
  - deadline

Template target untuk applied state:

```vue
<template v-else-if="currentApplication && applicationMessage">
  <p class="text-caption font-semibold text-primary-800">
    {{ applicationMessage.title }}
  </p>
  <p class="mt-1 text-caption text-primary-700">
    {{ applicationMessage.body }}
  </p>
  <AtomicButton
    to="/projects/my-applications"
    variant="primary"
    class="mt-4 w-full"
  >
    Lihat Lamaran Saya
  </AtomicButton>
</template>
```

---

## Task 5: Sticky Bottom CTA Mobile Tanpa Window Listener Jika Tidak Perlu

**Files:**
- Modify: `apps/client/app/pages/projects/[slug].vue`

- [ ] Tambahkan mobile bottom CTA sederhana dengan CSS responsive, bukan scroll listener kompleks.
- [ ] Render hanya di mobile: `lg:hidden fixed bottom-0 left-0 right-0`.
- [ ] State mengikuti sidebar:
  - Jika already applied: `Lihat Lamaran Saya`.
  - Jika can apply: `Apply Project Ini`.
  - Jika owner: `Kelola Pelamar`.
  - Jika logged out: `Login`.
- [ ] Beri padding bottom pada page body agar CTA mobile tidak menutup konten: `pb-24 lg:pb-0`.
- [ ] Tidak perlu `isMobile`, `showStickyBar`, `window.addEventListener`, atau `onBeforeUnmount`.

---

## Task 6: Project Not Found Dan Error State

**Files:**
- Modify: `apps/client/app/pages/projects/[slug].vue`

- [ ] Pertahankan existing `createError({ statusCode: 404 })` untuk project tidak ditemukan.
- [ ] Error fetch tetap memakai `MoleculeTicker variant="danger"`.
- [ ] Jangan tambah loading state manual karena `await useAsyncData` di page sudah SSR-friendly dan halaman saat ini tidak memakai `pending`.

---

## Task 7: Verifikasi Teknis

**Files:**
- Verify: `apps/client/app/pages/projects/[slug].vue`

- [ ] Jalankan SFC compile check:

```powershell
node -e "const fs=require('fs'); const { parse, compileScript, compileTemplate }=require('./node_modules/.pnpm/@vue+compiler-sfc@3.5.33/node_modules/@vue/compiler-sfc'); const file='apps/client/app/pages/projects/[slug].vue'; const source=fs.readFileSync(file,'utf8'); const { descriptor, errors }=parse(source,{filename:file}); if(errors.length) throw errors[0]; compileScript(descriptor,{id:'project-slug'}); const tpl=compileTemplate({source:descriptor.template.content, filename:file, id:'project-slug'}); if(tpl.errors.length){ console.error(tpl.errors); process.exit(1); } console.log('SFC script/template compile OK');"
```

Expected: `SFC script/template compile OK`

- [ ] Scan hardcoded/invalid design classes:

```powershell
Select-String -LiteralPath apps\client\app\pages\projects\[slug].vue -Pattern '#[0-9A-Fa-f]{3,6}|text-blue|bg-blue|text-gray|bg-gray|border-gray|bg-white/|text-white/|border-white/|style='
```

Expected: tidak ada output, kecuali jika ada alasan eksplisit yang disetujui.

- [ ] Coba build:

```powershell
pnpm --filter @kolaboria/client build
```

Expected: build exit code 0.

- [ ] Jika `pnpm` tidak tersedia, fallback:

```powershell
node_modules\.bin\nuxt.CMD build
```

Expected: build exit code 0. Jika gagal `spawn EPERM`, minta izin eskalasi. Jika ditolak, laporkan build tidak bisa diverifikasi penuh.

---

## Acceptance Criteria

- [ ] Halaman mengikuti arah visual contoh user: hero besar, stat chips, content sections, sticky CTA sidebar, mobile CTA.
- [ ] Semua data berasal dari `Project` dan `Application` aktual, bukan field mock.
- [ ] Tidak ada direct Supabase query di page.
- [ ] Tidak ada `project.company`, `project.timeline`, `project.requirements`, `project.team`, `project.tags`, `project.spots`, atau `project.applicants` kecuali dibuat sebagai computed dari data aktual.
- [ ] Applied state menampilkan `Lihat Lamaran Saya`.
- [ ] Eligible state membuka `ApplyModal`.
- [ ] Owner state menampilkan `Kelola Pelamar`.
- [ ] Tidak memakai `AtomicButton variant="white"`.
- [ ] SFC compile check berhasil.
