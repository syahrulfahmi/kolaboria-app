# Projects Create Default Editor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make `/projects/create` render the completed five-step editor UI that currently appears in the development preview branch.

**Architecture:** Reduce the create page to route metadata, the existing email-verification gate, and the shared editor entry component. The existing editor composable, fixtures, local draft storage, and simulated actions remain the UI state owner; the page retains its `home` layout and auth/onboarding middleware. The create page no longer selects UI based on development mode or URL query parameters and stops invoking its legacy project/profile/master-data API flow. The edit route is outside this change.

**Tech Stack:** Nuxt 4, Vue 3, TypeScript, existing Kolaboria Atomic/Molecule/Organism components, Node built-in test runner, existing Nuxt build.

**Spec:** This user request supersedes the route-selection section of [`2026-10-07-project-create-edit-ui.md`](2026-10-07-project-create-edit-ui.md): the editor UI already built for preview becomes the default create UI. Prior agreed scope remains UI-first with dummy references and local-only save/publish simulation; no API integration is added by this plan.

## Global Constraints

- Preserve `layout: 'home'`, `auth` middleware, `onboarding-guard`, and page title for `/projects/create`.
- Preserve the existing email-verification gate and its guidance for unverified users; do not let the UI-only editor imply that verification is no longer required.
- Do not add project, profile, contribution-role, or tools API requests to the new create entry route.
- Preserve the shared five-step editor, its responsive layout, existing design-system components, validation, and local-storage draft behavior.
- Keep simulated save/publish language clear that data is saved on this device and publication is not sent to the server.
- Remove the development preview switch from the create route so it always uses the new editor UI for verified users.
- Leave the edit route and its existing behavior unchanged.
- Do not remove legacy step components or change edit/API behavior as unrelated cleanup.
- Do not add dependencies or use `any` in changed frontend code.

## Review Focus

- Direct navigation to `/projects/create` for a verified user renders the five-step editor; the create page has no preview query branch.
- Authenticated navigation still passes through the existing auth/onboarding middleware; the unverified-user guidance remains in place and no public access path is created.
- Create draft and simulated publish remain local-only and visibly do not claim server persistence.
- The existing edit route continues to use the preview helper and its current real-API path when preview mode is absent.
- The new page does not retain dead create-only API loaders, submit handlers, four-step state, or legacy form/action markup.

---

## Kesepakatan fitur, scope, dan acceptance

| Area | Keputusan |
| --- | --- |
| Tujuan | Menghilangkan perbedaan antara halaman create normal dan editor baru yang sebelumnya hanya muncul pada cabang development preview. |
| Scope | Entry route `projects/create` dan regression test yang memastikan editor baru menjadi UI create default. |
| Tetap dipakai | Editor bersama lima tahap, composable state/validasi, fixtures, local storage, header/stepper/footer, email-verification guidance, route middleware, layout, dan metadata. |
| Di luar scope | Integrasi payload baru ke API, penyimpanan/publikasi server, migrasi halaman edit, penghapusan service atau komponen lama yang mungkin masih dipakai, backend/database. |
| Acceptance | Pengguna terverifikasi yang membuka `/projects/create` tanpa query melihat editor baru; query tidak dibutuhkan; lima step dan aksi UI dummy bekerja; pengguna belum terverifikasi mendapat guidance existing; middleware tetap menjaga route; edit preview tetap berfungsi. |
| Verifikasi | Test route-entry yang memastikan page mengarah langsung ke editor default; targeted editor tests; `pnpm --dir apps/client build`; inspeksi manual create desktop/mobile bila runtime lokal tersedia. |

### Dampak dan keputusan data

Source saat ini menunjukkan create route normal melakukan `getProfile`, `MasterService.getContributionRoles`, `loadTools`, `createProject`, dan `publishProject`. Komponen yang saat ini dirender oleh cabang development preview menggunakan fixtures dan `useProjectEditor`, yang menyimpan draft pada perangkat dan hanya mensimulasikan publikasi. Menjadikan komponen tersebut UI default berarti alur API create lama tidak lagi menjadi jalur aktif dari `/projects/create`. Ini sesuai kesepakatan UI dummy sebelumnya; integrasi server harus menjadi pekerjaan terpisah dengan mapping dan kontrak API yang disepakati.

Helper `isProjectEditorPreview` dan alur edit tidak diubah dalam scope ini. Pada halaman create, hapus pemilihan cabang preview; pengguna terverifikasi selalu masuk ke editor baru dan pengguna yang belum terverifikasi tetap melihat guidance existing.

## Peta file

| File | Tanggung jawab perubahan |
| --- | --- |
| `apps/client/app/pages/projects/create.vue` | Pertahankan route metadata/middleware/title serta email-verification gate; pengguna terverifikasi langsung melihat `<ProjectEditorPreview mode="create" />`; hapus setup dan template form legacy serta pemilihan development preview. |
| `apps/client/tests/project-editor-create-entry.test.mjs` | Tambahkan regression test untuk kontrak route: editor create adalah tampilan default dan page tidak bergantung pada `route.query` atau `import.meta.dev`. |
| `apps/client/app/utils/project-editor-preview.ts` | Tidak diubah; perilaku existing di luar create tetap terjaga. |
| `apps/client/tests/project-editor-preview.test.mjs` | Tidak diubah; test helper existing tetap dijalankan sebagai regression check. |
| `apps/client/app/components/project/editor/ProjectEditorPreview.vue` dan `apps/client/app/composables/useProjectEditor.ts` | Tidak diubah kecuali verifikasi menemukan regresi yang langsung menghalangi acceptance create; jika perlu perubahan, perluas scope plan sebelum mengubah perilakunya. |

## Task 1: Kunci kontrak route create langsung ke editor

**Files:**
- Create: `apps/client/tests/project-editor-create-entry.test.mjs`
- Test: `apps/client/tests/project-editor-create-entry.test.mjs`

**Interfaces:**
- Page entry yang diuji: `apps/client/app/pages/projects/create.vue`.
- Kontrak: halaman create mempertahankan `layout: 'home'`, middleware `['auth', 'onboarding-guard']`, dan email-verification gate; untuk pengguna terverifikasi merender `ProjectEditorPreview` dengan `mode="create"` sebagai tampilan default.

- [ ] **Step 1: Tambahkan test kontrak route yang gagal pada source saat ini**

  Gunakan `node:assert/strict`, `node:test`, dan `node:fs/promises` untuk membaca file page. Assert bahwa page mempertahankan `useAuth`/`isVerified`, memiliki cabang guidance untuk email belum terverifikasi dan editor create untuk user terverifikasi, page metadata memuat layout/middleware yang disepakati, serta source page tidak membaca query untuk memilih tampilan, tidak memakai `import.meta.dev` untuk UI selection, dan tidak memuat empat komponen `ProjectCreateStep1Info` sampai `ProjectCreateStep4Review`.

- [ ] **Step 2: Jalankan regression test untuk memastikan kegagalan spesifik**

  Run dari `apps/client`: `node --test tests/project-editor-create-entry.test.mjs`.

  Expected: FAIL karena page masih memilih editor melalui mode development/query dan masih memiliki jalur form lama.

## Task 2: Ganti jalur create lama dengan editor baru sebagai default

**Files:**
- Modify: `apps/client/app/pages/projects/create.vue`

**Interfaces:**
- Route props: tidak ada.
- Child interface: `<ProjectEditorPreview mode="create" />`.
- Route contract yang dipertahankan: `layout: 'home'`, `middleware: ['auth', 'onboarding-guard']`, title `Buat Project — Kolaboria`.

- [ ] **Step 1: Sederhanakan script page**

  Hapus import dan state khusus jalur legacy create (`getApiErrorMessage`, `CreateProjectPayload`, `MasterService`, route/query dan computed untuk preview, service/composable project, profile/roles/tools API loader, form lama, validasi 4 step, popup konfirmasi, dan handler create/publish) yang tidak lagi dipakai. Pertahankan `useAuth` untuk `isVerified`, deklarasi metadata route, dan `useHead`.

- [ ] **Step 2: Jadikan editor baru satu-satunya template page**

  Hapus cabang preview, layout empat step, sidebar lama, footer/actions lama, dan loading submit lama. Pertahankan guidance verifikasi email; pada kondisi terverifikasi render `<ProjectEditorPreview mode="create" />` langsung. Jangan mengubah isi shared editor dalam task ini.

- [ ] **Step 3: Jalankan test route-entry**

  Run: `node --test tests/project-editor-create-entry.test.mjs` dari `apps/client`.

  Expected: PASS; query dan environment build tidak lagi memengaruhi komponen create yang dipilih.

## Task 3: Verifikasi editor dan batas route edit

**Files:**
- Test: `apps/client/tests/project-editor-create-entry.test.mjs`
- Existing tests: `apps/client/tests/project-editor-state.test.mjs`, `apps/client/tests/project-editor-validation.test.mjs`, `apps/client/tests/project-editor-preview.test.mjs`
- Build target: `apps/client`

**Interfaces:**
- Editor UI: lima step dengan navigasi dan action existing.
- Route edit: tidak berubah pada implementasi ini.

- [ ] **Step 1: Jalankan test editor yang terarah**

  Run dari `apps/client`: `node --test tests/project-editor-create-entry.test.mjs tests/project-editor-state.test.mjs tests/project-editor-validation.test.mjs tests/project-editor-preview.test.mjs`.

  Expected: seluruh test yang disebut lulus; state/validasi editor tidak berubah dan regression helper existing tetap lulus.

- [ ] **Step 2: Build client untuk memeriksa auto-import dan compile Nuxt**

  Run dari workspace root: `pnpm --dir apps/client build`.

  Expected: build berhasil tanpa referensi import atau template lama yang tersisa pada halaman create.

- [ ] **Step 3: Periksa interaksi route pada browser bila dev server tersedia**

  Dengan user terverifikasi, buka `/projects/create` langsung. Pastikan shell editor baru muncul tanpa flag preview, lalu periksa navigasi lima step, validasi lanjut, draft lokal, simulasi publish, dan layout desktop/mobile. Ulangi dengan status belum terverifikasi untuk memastikan guidance tampil.

  Expected: create langsung menampilkan UI baru; aksi editor tetap lokal dan copy tidak mengklaim server telah menyimpan/mempublikasikan proyek; middleware tetap berjalan.

## Batas penyelesaian

- Rencana ini tidak mengaktifkan create/publish API. Saat implementasi dijalankan, `/projects/create` beralih dari flow server-backed ke flow UI dummy lokal yang sudah dibangun.
- Project creation server-backed, mapping model `ProjectEditorDraft` ke `CreateProjectPayload`, verifikasi eligibility dari data authoritative, dan navigasi setelah create perlu direncanakan sebagai tahap integrasi tersendiri.
- Test/build membuktikan source dan compile; alur browser desktop/mobile hanya dapat dinyatakan terverifikasi setelah benar-benar dijalankan dengan session yang sesuai.
