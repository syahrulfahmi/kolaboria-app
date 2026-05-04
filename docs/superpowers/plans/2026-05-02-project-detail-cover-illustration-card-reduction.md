# Project Detail Cover Illustration Card Reduction Implementation Plan

> **Untuk agentic workers:** REQUIRED SUB-SKILL: Gunakan `superpowers:executing-plans` untuk mengeksekusi plan ini task-by-task. Step menggunakan checkbox (`- [ ]`) supaya progres mudah dilacak.

**Goal:** Mengubah halaman detail project agar lebih minim penggunaan card, memiliki full-width visual cover di belakang header project, dan tetap sesuai data project/application yang sudah ada.

**Architecture:** Tetap gunakan satu file halaman `apps/client/app/pages/projects/[slug].vue` untuk perubahan layout karena kebutuhan ini masih page-specific. Data fetching tetap melalui `useProjects()`, sementara visual cover dan ilustrasi dibuat dari computed view-model lokal berdasarkan `project.type`, `project.status`, `tech_stack`, `project_skills`, slot, dan metadata creator.

**Tech Stack:** Nuxt 4, Vue 3 `<script setup>`, Tailwind token class Kolaboria, existing UI components (`AtomicButton`, `AtomicTag`, `MoleculeTicker`, `ProjectStatusBadge`, `ApplyModal`).

---

## Prinsip Desain

- Kurangi card besar. Gunakan section terbuka dengan border bawah, whitespace, dan grid editorial.
- Card hanya dipakai untuk panel aksi penting yang butuh containment kuat.
- Header project menggunakan full-width cover visual di belakang konten, bukan card putih.
- Visual illustration harus domain-aware: terasa seperti brief kolaborasi teknologi, bukan dekorasi generik.
- Tidak menambah asset bitmap dulu. Ilustrasi dibuat dengan HTML/CSS token Tailwind agar ringan, reusable, dan tidak butuh dependency baru.
- Tetap tidak hardcode warna hex dan tidak memakai `text-blue-*`, `bg-gray-*`, atau arbitrary color class.

## File Yang Diubah

- Modify: `apps/client/app/pages/projects/[slug].vue`
- Optional update: `docs/superpowers/plans/2026-05-02-project-detail-cover-illustration-card-reduction.md`

---

## Task 1: Tambahkan View Model Untuk Cover Visual

- [ ] Tambahkan computed `coverLabel` untuk mengambil label dari `typeLabel[project.type]`.
- [ ] Tambahkan computed `heroMetrics` yang merangkum `openSlots`, `max_slots`, `filledSlots`, dan `slotProgress`.
- [ ] Tambahkan computed `coverSkillsPreview` yang mengambil maksimal 4 skill dari `project.project_skills`.
- [ ] Tambahkan computed `coverTechPreview` yang mengambil maksimal 3 item dari `project.tech_stack`.
- [ ] Pastikan semua computed aman saat `project.value` null.

Contoh kode yang ditambahkan di `<script setup>`:

```ts
const coverLabel = computed(() =>
  project.value ? typeLabel[project.value.type] : 'Project'
)

const heroMetrics = computed(() => ({
  openSlots: openSlots.value,
  maxSlots: project.value?.max_slots ?? 0,
  filledSlots: filledSlots.value,
  progress: slotProgress.value
}))

const coverSkillsPreview = computed(
  () => project.value?.project_skills?.slice(0, 4) ?? []
)

const coverTechPreview = computed(
  () => project.value?.tech_stack?.slice(0, 3) ?? []
)
```

---

## Task 2: Ganti Header Card Menjadi Full-Width Cover

- [ ] Ubah wrapper utama dari hanya `bg-neutral-50` menjadi struktur page dengan hero section full-width.
- [ ] Letakkan cover di luar grid konten utama agar lebarnya penuh.
- [ ] Gunakan background token `bg-secondary-900` atau kombinasi `bg-secondary-900` + visual layer token-based.
- [ ] Konten header tetap readable: breadcrumb, status badge, type tag, title, summary, creator, start date, deadline.
- [ ] Jangan membungkus header dengan `OrganismCard`.

Struktur target:

```vue
<div class="bg-neutral-50">
  <section class="relative overflow-hidden bg-secondary-900">
    <div class="absolute inset-0">
      <!-- visual illustration layer -->
    </div>

    <div class="relative mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <!-- breadcrumb + project header content -->
    </div>
  </section>

  <div class="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
    <!-- content grid -->
  </div>
</div>
```

---

## Task 3: Tambahkan Visual Illustration Di Cover

- [ ] Buat ilustrasi berbasis layout, bukan gambar eksternal: cluster node, garis penghubung, mini code panel, dan progress motif.
- [ ] Pakai token warna saja: `bg-primary-*`, `bg-secondary-*`, `bg-neutral-*`, `bg-accent-*`, `border-*`.
- [ ] Pastikan ilustrasi tidak mengganggu keterbacaan teks dengan `opacity-*`, `hidden lg:block`, dan posisi absolute.
- [ ] Pada mobile, sederhanakan visual agar tidak memenuhi layar.

Elemen visual yang disarankan:

```vue
<div class="absolute inset-y-0 right-0 hidden w-1/2 lg:block">
  <div class="absolute right-12 top-12 h-40 w-72 rounded-2xl border border-primary-300/30 bg-white/10 p-4">
    <div class="h-2 w-20 rounded-full bg-primary-300" />
    <div class="mt-4 space-y-2">
      <div class="h-2 w-full rounded-full bg-white/20" />
      <div class="h-2 w-3/4 rounded-full bg-white/20" />
      <div class="h-2 w-1/2 rounded-full bg-accent-300" />
    </div>
  </div>

  <div class="absolute bottom-12 right-36 grid grid-cols-3 gap-3">
    <div class="h-12 w-12 rounded-full bg-primary-300/80" />
    <div class="h-12 w-12 rounded-full bg-white/20" />
    <div class="h-12 w-12 rounded-full bg-accent-300/80" />
  </div>
</div>
```

Catatan: jika Tailwind config belum mendukung opacity slash untuk semua token, gunakan class yang sudah ada di repo. Kalau build menolak `bg-white/10` atau `border-primary-300/30`, ganti dengan token solid yang valid seperti `bg-secondary-800`, `border-primary-700`, dan opacity di parent.

---

## Task 4: Kurangi Penggunaan Card Di Body

- [ ] Hapus `OrganismCard` dari section naratif utama: `Deskripsi`, `Alasan Bergabung`, dan `Tech Stack`.
- [ ] Ganti menjadi section terbuka dengan `border-b border-neutral-200 py-8`.
- [ ] Pertahankan `OrganismCard` hanya untuk panel aksi utama jika masih dibutuhkan.
- [ ] Sidebar diubah menjadi panel ringan berbasis `aside` dengan border kiri/top, bukan banyak card bertumpuk.

Struktur target body:

```vue
<div class="grid gap-10 lg:grid-cols-[1.7fr_0.75fr] lg:items-start">
  <main class="bg-white">
    <section v-if="project.description" class="border-b border-neutral-200 py-8">
      ...
    </section>
    <section v-if="project.why_join" class="border-b border-neutral-200 py-8">
      ...
    </section>
    <section v-if="project.tech_stack?.length" class="py-8">
      ...
    </section>
  </main>

  <aside class="space-y-8 border-t border-neutral-200 pt-8 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
    ...
  </aside>
</div>
```

---

## Task 5: Rapikan Sidebar Menjadi Informational Rail

- [ ] Gabungkan kapasitas, skills, creator, dan anggota menjadi rail section, bukan card terpisah.
- [ ] Gunakan label superscript pattern sesuai guideline: `text-caption font-semibold uppercase tracking-wide text-primary-700`.
- [ ] Panel aksi tetap paling atas dan paling jelas.
- [ ] Progress slot tetap dipertahankan karena itu interpretasi data penting.
- [ ] Jika members kosong, tampilkan teks ringan, bukan empty card.

Urutan sidebar:

1. Aksi Project
2. Kapasitas
3. Skill Dibutuhkan
4. Creator
5. Anggota

---

## Task 6: Verifikasi Visual Dan Build

- [ ] Jalankan SFC compile check:

```powershell
node -e "const fs=require('fs'); const { parse, compileScript, compileTemplate }=require('./node_modules/.pnpm/@vue+compiler-sfc@3.5.33/node_modules/@vue/compiler-sfc'); const file='apps/client/app/pages/projects/[slug].vue'; const source=fs.readFileSync(file,'utf8'); const { descriptor, errors }=parse(source,{filename:file}); if(errors.length) throw errors[0]; compileScript(descriptor,{id:'project-slug'}); const tpl=compileTemplate({source:descriptor.template.content, filename:file, id:'project-slug'}); if(tpl.errors.length){ console.error(tpl.errors); process.exit(1); } console.log('SFC script/template compile OK');"
```

Expected: `SFC script/template compile OK`

- [ ] Jalankan scan hardcoded warna:

```powershell
Select-String -LiteralPath apps\client\app\pages\projects\[slug].vue -Pattern '#[0-9A-Fa-f]{3,6}|text-blue|bg-blue|text-gray|bg-gray|text-\[|bg-\['
```

Expected: tidak ada output.

- [ ] Jalankan build jika package manager tersedia:

```powershell
pnpm --filter @kolaboria/client build
```

Expected: build exit code 0.

- [ ] Jika `pnpm` tidak tersedia, jalankan fallback dari folder client:

```powershell
node_modules\.bin\nuxt.CMD build
```

Expected: build exit code 0. Jika gagal karena `spawn EPERM`, catat sebagai sandbox blocker dan jangan klaim build pass.

---

## Self-Review Checklist

- [ ] Header project sudah full-width dan bukan card.
- [ ] Ada visual illustration di belakang/kanan header.
- [ ] Jumlah card berkurang jelas dibanding implementasi sebelumnya.
- [ ] Aksi apply/owner/login/already-applied tetap bekerja.
- [ ] Slot progress, skills, creator, dan members tetap berasal dari data existing.
- [ ] Tidak ada hardcoded warna.
- [ ] SFC compile check berhasil.
