# Project Detail Full Redesign Sticky Apply Implementation Plan

> **Untuk agentic workers:** REQUIRED SUB-SKILL: Gunakan `superpowers:executing-plans` untuk mengeksekusi plan ini task-by-task. Step menggunakan checkbox (`- [ ]`) supaya progres mudah dilacak.

**Goal:** Mendesain ulang seluruh halaman `apps/client/app/pages/projects/[slug].vue` agar lebih visual, lebih sesuai dengan konten deskripsi project, dan memiliki sidebar sticky untuk aksi apply dengan state tombol `Lihat Lamaran Saya` ketika user sudah pernah melamar.

**Architecture:** Perubahan tetap scoped ke satu page Vue karena semua UI bersifat project-detail specific. Data fetching tetap memakai `useProjects()` dan existing relation `project`, `project_skills`, `project_members`, `profiles`, serta `myApps`; halaman akan menambahkan computed view-model untuk visual illustration, content summary, sticky action state, dan metadata project.

**Tech Stack:** Nuxt 4, Vue 3 `<script setup>`, Tailwind token class Kolaboria, existing components `AtomicButton`, `AtomicTag`, `MoleculeTicker`, `ProjectStatusBadge`, dan `ApplyModal`.

---

## Prinsip Desain

- Halaman harus terasa seperti project brief profesional, bukan daftar card.
- Visual illustration harus membantu membaca konteks project: type, skill, tech stack, kapasitas, dan progress kolaborasi.
- Konten deskripsi diberi layout editorial yang lebih nyaman: section terbuka, heading jelas, line length dibatasi, dan tidak terlalu banyak box.
- Sidebar apply harus sticky di desktop, mudah ditemukan, dan tetap normal-flow di mobile.
- Jika user sudah apply, CTA utama berubah menjadi `Lihat Lamaran Saya`.
- Tetap mengikuti design system Kolaboria: `max-w-6xl`, grid asimetris, token warna, typography utility, dan section superscript pattern.
- Tidak membuat API call baru dan tidak memindahkan business logic ke komponen UI.

---

## File Yang Diubah

- Modify: `apps/client/app/pages/projects/[slug].vue`
- Optional update: `docs/superpowers/plans/2026-05-02-project-detail-full-redesign-sticky-apply.md`

Tidak perlu membuat komponen baru dulu. Jika setelah implementasi file menjadi terlalu besar, refactor bisa dilakukan di plan lanjutan ke `apps/client/app/components/project/ProjectDetailHero.vue` dan `ProjectApplySidebar.vue`.

---

## Task 1: Rapikan View Model Untuk Konten, Visual, Dan CTA

**Files:**
- Modify: `apps/client/app/pages/projects/[slug].vue`

- [ ] Tambahkan computed `hasApplied` agar pengecekan state applied tidak tersebar di template.
- [ ] Tambahkan computed `primaryActionLabel`.
- [ ] Tambahkan computed `primaryActionVariant` jika perlu membedakan CTA default dan applied.
- [ ] Tambahkan computed `projectDescriptionSections` untuk memecah konten description menjadi paragraf yang lebih enak dibaca.
- [ ] Tambahkan computed `visualNodes` untuk illustration nodes dari skills/tech stack/slot.
- [ ] Pertahankan computed existing: `currentApplication`, `isOwner`, `members`, `openSlots`, `slotProgress`, `canApply`, `applicationMessage`.

Kode target:

```ts
const hasApplied = computed(() => !!currentApplication.value)

const primaryActionLabel = computed(() =>
  hasApplied.value ? 'Lihat Lamaran Saya' : 'Apply Project Ini'
)

const projectDescriptionSections = computed(() => {
  const description = project.value?.description?.trim()
  if (!description) return []
  return description
    .split(/\n{2,}/)
    .map((section) => section.trim())
    .filter(Boolean)
})

const visualNodes = computed(() => {
  const skillNodes =
    project.value?.project_skills?.slice(0, 3).map((skill) => ({
      label: skill.skill_tags.name,
      tone: skill.is_required ? 'primary' : 'neutral'
    })) ?? []

  const techNodes =
    project.value?.tech_stack?.slice(0, 2).map((tech) => ({
      label: tech,
      tone: 'accent'
    })) ?? []

  return [...skillNodes, ...techNodes].slice(0, 5)
})
```

---

## Task 2: Redesign Hero Menjadi Visual Project Canvas

**Files:**
- Modify: `apps/client/app/pages/projects/[slug].vue`

- [ ] Pertahankan full-width cover `bg-secondary-900`, tetapi ubah isi visualnya dari dekoratif menjadi project canvas.
- [ ] Buat dua layer: text brief di kiri dan illustration panel di kanan.
- [ ] Illustration panel menampilkan:
  - mini project board
  - skill/tech nodes dari `visualNodes`
  - progress/capacity ring atau bar
  - metadata kecil: `openSlots`, `slotProgress`, dan `coverLabel`
- [ ] Jangan gunakan image eksternal.
- [ ] Pada mobile, tampilkan visual compact di bawah title atau sembunyikan sebagian agar title tetap prioritas.

Struktur target:

```vue
<section class="relative overflow-hidden bg-secondary-900">
  <div class="relative mx-auto grid max-w-6xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:px-8 lg:py-14">
    <div>
      <!-- breadcrumb, badge, title, summary, meta -->
    </div>

    <div class="hidden lg:block">
      <!-- project canvas illustration -->
    </div>
  </div>
</section>
```

---

## Task 3: Sesuaikan UI Konten Deskripsi

**Files:**
- Modify: `apps/client/app/pages/projects/[slug].vue`

- [ ] Ganti `project.description` raw paragraph menjadi loop `projectDescriptionSections`.
- [ ] Jika hanya ada satu section, tetap render sebagai satu paragraph panjang dengan `max-w-3xl`.
- [ ] Jika ada beberapa section, tampilkan dalam flow editorial dengan spacing `space-y-5`.
- [ ] Tambahkan description side-note kecil untuk metadata project seperti type, deadline, dan start date di area konten utama jika tidak terlalu ramai.
- [ ] `why_join` tetap menjadi section tersendiri dengan accent semantics.

Contoh template:

```vue
<section v-if="projectDescriptionSections.length > 0" class="border-b border-neutral-200 py-9">
  <p class="text-caption font-semibold uppercase tracking-wide text-primary-700">
    Deskripsi
  </p>
  <h2 class="mt-2 text-title text-secondary-900">Apa yang Akan Dibangun</h2>
  <div class="mt-5 max-w-3xl space-y-5">
    <p
      v-for="section in projectDescriptionSections"
      :key="section"
      class="text-body text-neutral-700"
    >
      {{ section }}
    </p>
  </div>
</section>
```

---

## Task 4: Buat Sticky Apply Sidebar

**Files:**
- Modify: `apps/client/app/pages/projects/[slug].vue`

- [ ] Ubah `aside` menjadi sticky desktop: `lg:sticky lg:top-6`.
- [ ] Pastikan parent grid memakai `lg:items-start` agar sticky bekerja.
- [ ] Buat action panel paling atas dengan visual hierarchy lebih kuat dari rail section lain.
- [ ] State CTA:
  - `!user`: ticker login dengan action ke `/login`.
  - `isOwner`: tombol `Kelola Pelamar`.
  - `currentApplication`: tombol utama `Lihat Lamaran Saya`.
  - `canApply`: tombol utama `Apply Project Ini`.
  - `openSlots === 0`: warning slot penuh.
  - status bukan `open`: info project belum membuka lamaran.
- [ ] Jangan tampilkan tombol apply jika user sudah apply.

Template action target:

```vue
<aside class="space-y-8 border-t border-neutral-200 pt-8 lg:sticky lg:top-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
  <section class="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
    <p class="text-caption font-semibold uppercase tracking-wide text-primary-700">
      Aksi Project
    </p>

    <template v-if="currentApplication && applicationMessage">
      <p class="mt-3 text-caption font-semibold text-primary-800">
        {{ applicationMessage.title }}
      </p>
      <p class="mt-1 text-caption text-primary-700">
        {{ applicationMessage.body }}
      </p>
      <AtomicButton to="/projects/my-applications" variant="primary" class="mt-4 w-full">
        Lihat Lamaran Saya
      </AtomicButton>
    </template>

    <template v-else-if="canApply">
      <AtomicButton variant="primary" class="mt-4 w-full" @click="showApplyModal = true">
        Apply Project Ini
      </AtomicButton>
    </template>
  </section>
</aside>
```

---

## Task 5: Rapikan Rail Informasi Project

**Files:**
- Modify: `apps/client/app/pages/projects/[slug].vue`

- [ ] Di bawah action panel, render rail sections tanpa card berlebih:
  - Kapasitas
  - Skill Dibutuhkan
  - Tech Stack singkat jika belum terlalu ramai di main content
  - Creator
  - Anggota
- [ ] Pertahankan progress bar slot.
- [ ] Required skills pakai `AtomicTag variant="primary"`.
- [ ] Optional skills pakai `AtomicTag variant="default"`.
- [ ] Avatar/initial tetap `rounded-full`.

---

## Task 6: Visual QA Manual Dengan Browser Jika Environment Memungkinkan

**Files:**
- Verify: `apps/client/app/pages/projects/[slug].vue`

- [ ] Jalankan dev server jika package manager tersedia:

```powershell
pnpm --filter @kolaboria/client dev
```

Expected: Nuxt dev server berjalan.

- [ ] Jika `pnpm` tidak tersedia, coba fallback dari `apps/client`:

```powershell
node_modules\.bin\nuxt.CMD dev
```

Expected: Nuxt dev server berjalan.

- [ ] Buka halaman project detail di browser lokal dan cek:
  - cover tidak blank
  - illustration tidak menutup title
  - sidebar sticky di desktop
  - mobile tidak overflow horizontal
  - state applied menampilkan `Lihat Lamaran Saya`

Jika server gagal karena sandbox `EPERM`, catat blocker dan lanjut ke compile-level verification.

---

## Task 7: Verifikasi Teknis

**Files:**
- Verify: `apps/client/app/pages/projects/[slug].vue`

- [ ] Jalankan SFC compile check:

```powershell
node -e "const fs=require('fs'); const { parse, compileScript, compileTemplate }=require('./node_modules/.pnpm/@vue+compiler-sfc@3.5.33/node_modules/@vue/compiler-sfc'); const file='apps/client/app/pages/projects/[slug].vue'; const source=fs.readFileSync(file,'utf8'); const { descriptor, errors }=parse(source,{filename:file}); if(errors.length) throw errors[0]; compileScript(descriptor,{id:'project-slug'}); const tpl=compileTemplate({source:descriptor.template.content, filename:file, id:'project-slug'}); if(tpl.errors.length){ console.error(tpl.errors); process.exit(1); } console.log('SFC script/template compile OK');"
```

Expected: `SFC script/template compile OK`

- [ ] Scan hardcoded warna:

```powershell
Select-String -LiteralPath apps\client\app\pages\projects\[slug].vue -Pattern '#[0-9A-Fa-f]{3,6}|text-blue|bg-blue|text-gray|bg-gray|text-\[|bg-\['
```

Expected: tidak ada output.

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

- [ ] Seluruh page terasa redesign, bukan hanya tweak kecil.
- [ ] Ada visual illustration yang relevan dengan project brief.
- [ ] Deskripsi project lebih enak dibaca dan mengikuti konten yang ada.
- [ ] Sidebar apply sticky di desktop.
- [ ] User yang sudah apply melihat tombol `Lihat Lamaran Saya`.
- [ ] User yang belum apply dan eligible melihat tombol `Apply Project Ini`.
- [ ] Owner melihat `Kelola Pelamar`.
- [ ] Logged-out user melihat login CTA.
- [ ] Tidak ada hardcoded warna.
- [ ] SFC compile check berhasil.
