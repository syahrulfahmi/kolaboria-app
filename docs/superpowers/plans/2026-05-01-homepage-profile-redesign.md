# Homepage & Profile Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Meningkatkan desain Homepage dan Profile Kolaboria agar terasa lebih premium, jelas secara UX, dan selaras dengan kondisi data aktual Supabase.

**Architecture:** UI halaman tetap tipis dan feature-specific components berada di `app/components/home` serta `app/components/profile`. Semua akses Supabase tetap lewat composables/services; komponen UI atomic/molecule/organism tidak boleh memanggil Supabase langsung. Data yang dipakai mengikuti kondisi aktual: `profiles`, `talent_profiles`, `skills`, `tools`, `user_skills`, `user_tools`, dan `completion_score` yang dihitung trigger database.

**Tech Stack:** Nuxt 4, Vue 3 `<script setup>`, TypeScript, Tailwind CSS v4 design tokens, Supabase, Storybook.

---

## Catatan Kondisi Data Saat Ini

- `profiles` sudah punya `username`, `full_name`, `avatar`, `headline`, `bio`, `location`, `completion_score`, `is_verified`, `availability_status`, `rating`, `review_count`, dan `external_links`.
- `talent_profiles` menyimpan `experience_level`, `goal`, `project_count`, `completed_projects`, dan `contribution_score`.
- `skills` dan `tools` sudah menjadi tabel referensi dengan `category`.
- `user_skills` punya `is_primary` dan constraint satu primary skill per user.
- `user_tools` menyimpan tools milik user.
- Completion score sudah dihitung oleh trigger dari skill, bio, tools, headline, dan location.
- Halaman aktual memakai route `/home`, public profile `/:username`, dan edit profile `/:username/edit`, namun sebagian link layout masih mengarah ke `/profile/:username`.

## File Structure

- Modify: `apps/client/app/layouts/home.vue`
  - Rapikan navbar agar memakai token design system, route profile konsisten ke `/${username}`, dan tidak memakai raw Tailwind gray/red classes.
- Modify: `apps/client/app/pages/home.vue`
  - Ubah komposisi dashboard menjadi layout editorial SaaS: greeting/status, completion summary, next actions, dan profile readiness.
- Modify: `apps/client/app/components/home/Greeting.vue`
  - Buat hero dashboard yang lebih tenang, data-aware, dan tanpa emoji sebagai struktur visual utama.
- Modify: `apps/client/app/components/home/VerificationBanner.vue`
  - Ubah warning unverified menjadi banner yang jelas, compact, dan token-based.
- Modify: `apps/client/app/components/home/CompletionWidget.vue`
  - Jadikan widget sebagai progress/readiness panel dengan checklist sesuai trigger completion aktual.
- Modify: `apps/client/app/components/home/ActionButtons.vue`
  - Tampilkan action berdasarkan `isVerified` dan completion state, bukan tombol generik saja.
- Modify: `apps/client/app/components/profile/ProfileView.vue`
  - Ubah layout profile menjadi portfolio-first: header besar, primary skill signal, bio/goal, skills/tools, stats.
- Modify: `apps/client/app/components/profile/ProfileHeader.vue`
  - Tampilkan identity, headline, location, verified state, availability, rating/review bila data ada.
- Modify: `apps/client/app/components/profile/BioSection.vue`
  - Tampilkan bio dan fallback empty-state yang actionable untuk owner.
- Modify: `apps/client/app/components/profile/SkillSection.vue`
  - Pisahkan primary skill dan secondary skills secara visual.
- Modify: `apps/client/app/components/profile/ToolSection.vue`
  - Kelompokkan tools dengan gaya chip yang token-based dan readable.
- Modify: `apps/client/app/components/profile/ContributionStats.vue`
  - Jadikan stats lebih editorial dan tidak bergantung pada card bertumpuk.
- Modify: `apps/client/app/components/profile/ProfileEditForm.vue`
  - Perluas edit form agar bisa mengelola basic info, skills, primary skill, tools, dan goal sesuai data aktual.
- Modify: `apps/client/app/pages/profile/[username]/edit.vue`
  - Fetch skills/tools/talent profile untuk edit form dan simpan perubahan melalui composables.
- Modify: `apps/client/app/composables/useProfile.ts`
  - Tambahkan method update talent profile goal bila belum ada.
- Modify: `apps/client/app/composables/useSkill.ts`
  - Pastikan operasi add/remove/set primary mengembalikan error yang bisa ditampilkan toast dan reload state setelah update.
- Modify: `apps/client/app/composables/useTool.ts`
  - Pastikan operasi add/remove tool konsisten dengan skill composable.
- Optional create: `apps/client/app/utils/profileCompletion.ts`
  - Bila duplikasi logic checklist mulai besar, pindahkan mapping checklist ke util murni tanpa Supabase.
- Optional create: `apps/client/stories/...`
  - Hanya buat story baru jika ada komponen reusable baru di `ui/`; feature components tidak wajib masuk Storybook.

---

### Task 1: Audit Route, Token, dan Data Mismatch

**Files:**

- Modify: `apps/client/app/layouts/home.vue`
- Modify: `apps/client/app/pages/profile/[username]/edit.vue`

- [ ] Step 1: Perbaiki route profile di dropdown desktop dari `/${username}` menjadi `/profile/${username}`.
- [ ] Step 2: Ganti class raw color seperti `bg-gray-50`, `text-gray-600`, `border-gray-100`, `text-red-600`, dan `bg-red-50` menjadi token `neutral`, `primary`, dan `danger`.
- [ ] Step 3: Pastikan semua link profile di desktop dan mobile konsisten memakai `/profile/${userProfile.username}`.
- [ ] Step 4: Jalankan `pnpm build`.
- [ ] Step 5: Expected result: build berhasil atau hanya gagal karena environment Supabase/env lokal, bukan karena template/type error.

### Task 2: Redesign Homepage Container dan State Loading

**Files:**

- Modify: `apps/client/app/pages/home.vue`

- [ ] Step 1: Ubah wrapper menjadi dashboard layout yang lebih lebar dan tidak double-padding dengan `home.vue`; gunakan `max-w-6xl`, grid desktop, dan spacing konsisten.
- [ ] Step 2: Tambahkan fallback empty/error ringan jika `profile` null setelah loading selesai.
- [ ] Step 3: Tetap fetch data melalui `useProfile`, `useSkill`, dan `useTool`; jangan pindahkan Supabase call ke component.
- [ ] Step 4: Pass data yang relevan ke home components: profile, skills, tools, checklist, dan verification state.
- [ ] Step 5: Jalankan `pnpm build`.

### Task 3: Redesign Greeting Sebagai Dashboard Header

**Files:**

- Modify: `apps/client/app/components/home/Greeting.vue`

- [ ] Step 1: Ubah props dari `name` dan `isVerified` menjadi tetap sederhana, tetapi tambahkan optional `headline`, `completionScore`, dan `primarySkillName` jika diperlukan oleh tampilan.
- [ ] Step 2: Tampilkan copy yang data-aware: verified user diarahkan ke kontribusi, unverified user diarahkan ke verifikasi dan portfolio readiness.
- [ ] Step 3: Gunakan `.text-heading`, `.text-title`, `.text-body`, `.text-caption` dan token colors saja.
- [ ] Step 4: Hindari emoji sebagai label struktural; gunakan badge/tag dan hierarchy visual.

### Task 4: Redesign Verification Banner

**Files:**

- Modify: `apps/client/app/components/home/VerificationBanner.vue`

- [ ] Step 1: Pertahankan behavior dismiss dan emit `resend`.
- [ ] Step 2: Gunakan `MoleculeTicker` atau layout inline token-based tanpa raw colors.
- [ ] Step 3: CTA tetap `Kirim ulang email`, namun tampil sebagai action sekunder yang jelas.
- [ ] Step 4: Pastikan banner hanya muncul saat `isVerified === false`.

### Task 5: Redesign Completion Widget Berdasarkan Trigger Aktual

**Files:**

- Modify: `apps/client/app/components/home/CompletionWidget.vue`
- Optional create: `apps/client/app/utils/profileCompletion.ts`

- [ ] Step 1: Checklist harus tetap mengikuti sumber skor aktual: skill 30, bio 20, tools 20, headline 15, location 15.
- [ ] Step 2: Bedakan completed dan missing items dengan visual yang tenang: label, bobot persen, dan status.
- [ ] Step 3: Progress bar harus clamp di 0-100 agar UI tidak rusak jika data tidak ideal.
- [ ] Step 4: CTA ke `/${username}/edit` tetap ada, copy berubah sesuai state: `Lengkapi profil` atau `Perbarui profil`.
- [ ] Step 5: Jangan hitung ulang `completion_score` sebagai sumber kebenaran utama jika profile sudah membawa nilai dari database; helper hanya untuk checklist display.

### Task 6: Redesign Action Buttons agar Data-Aware

**Files:**

- Modify: `apps/client/app/components/home/ActionButtons.vue`
- Modify: `apps/client/app/pages/home.vue`

- [ ] Step 1: Tambahkan props `isVerified`, `completionScore`, dan `username`.
- [ ] Step 2: Jika unverified, tampilkan disabled join-project reason di tempat yang sama, bukan card terpisah yang terasa seperti error.
- [ ] Step 3: Jika verified tetapi completion rendah, prioritas CTA adalah `Lengkapi Profil`; jika cukup tinggi, prioritas CTA adalah `Jelajahi Project`.
- [ ] Step 4: Biarkan `Buat Project` disabled/coming soon bila belum ada route implementasi.

### Task 7: Redesign Public Profile Menjadi Portfolio-First

**Files:**

- Modify: `apps/client/app/components/profile/ProfileView.vue`
- Modify: `apps/client/app/components/profile/ProfileHeader.vue`
- Modify: `apps/client/app/components/profile/BioSection.vue`
- Modify: `apps/client/app/components/profile/SkillSection.vue`
- Modify: `apps/client/app/components/profile/ToolSection.vue`
- Modify: `apps/client/app/components/profile/ContributionStats.vue`

- [ ] Step 1: Gunakan layout dua kolom desktop: main content untuk identity/bio/goal, sidebar untuk readiness/stats/tools.
- [ ] Step 2: Header menampilkan avatar, nama, headline, location, verified badge, availability, rating/review jika ada.
- [ ] Step 3: Skill section harus menonjolkan primary skill sebagai signal utama, lalu secondary skills.
- [ ] Step 4: Tools section tampil sebagai chip list, fallback empty state tetap informatif.
- [ ] Step 5: Contribution stats memakai data `talent_profiles`: project joined, completed, contribution score.
- [ ] Step 6: Owner mendapat CTA edit yang mudah ditemukan, public viewer tidak melihat CTA internal.

### Task 8: Perluas Edit Profile Sesuai Kondisi Data

**Files:**

- Modify: `apps/client/app/pages/profile/[username]/edit.vue`
- Modify: `apps/client/app/components/profile/ProfileEditForm.vue`
- Modify: `apps/client/app/composables/useProfile.ts`
- Modify: `apps/client/app/composables/useSkill.ts`
- Modify: `apps/client/app/composables/useTool.ts`

- [ ] Step 1: Fetch `profile`, `talentProfile`, `allSkills`, `userSkills`, `allTools`, dan `userTools` pada edit page.
- [ ] Step 2: Edit form tetap menyimpan basic profile: `full_name`, `headline`, `location`, `bio`.
- [ ] Step 3: Tambahkan field `goal` yang menyimpan ke `talent_profiles.goal`.
- [ ] Step 4: Tambahkan UI select/add untuk skills dari tabel `skills`; primary skill bisa dipilih dengan radio/toggle.
- [ ] Step 5: Tambahkan UI select/add/remove untuk tools dari tabel `tools`.
- [ ] Step 6: Setelah add/remove/set primary, reload user skills/tools agar completion score yang dipicu DB bisa terlihat setelah profile refetch.
- [ ] Step 7: Gunakan toast untuk success/error.

### Task 9: Konsistensi Design System

**Files:**

- Modify: all touched Vue files

- [ ] Step 1: Scan file yang disentuh untuk raw color class `gray`, `red`, `blue`, arbitrary text size, inline hex, dan gradient yang tidak perlu.
- [ ] Step 2: Ganti dengan token `neutral`, `primary`, `secondary`, `accent`, `success`, `danger`.
- [ ] Step 3: Pastikan typography content memakai class semantic `.text-display`, `.text-heading`, `.text-title`, `.text-body`, atau `.text-caption`.
- [ ] Step 4: Hindari card bertumpuk; pakai section/full-width grouping atau satu `OrganismCard` per blok data yang memang berdiri sendiri.

### Task 10: Verification

**Files:**

- All touched files

- [ ] Step 1: Jalankan `pnpm build`.
- [ ] Step 2: Jalankan `pnpm storybook` atau `pnpm --filter @kolaboria/client build-storybook` jika perubahan menyentuh komponen UI reusable.
- [ ] Step 3: Jalankan dev server `pnpm dev` dan cek manual:
  - `/home` untuk user unverified.
  - `/home` untuk user verified.
  - `/:username` untuk public profile.
  - `/:username/edit` untuk owner.
- [ ] Step 4: Cek responsive mobile dan desktop: tidak ada text overflow, card nesting berlebihan, atau CTA yang tidak jelas.
- [ ] Step 5: Cek data operations: add skill, set primary, remove skill, add tool, remove tool, update bio/headline/location/goal.

## Self-Review

- Spec coverage: Homepage verified/unverified, profile public/editable, completion logic, verification behavior, and business rules are covered.
- Architecture coverage: Supabase access stays in composables/services; UI components remain presentation-oriented.
- Data alignment: Plan uses actual current tables and fields instead of introducing Pinia stores from the spec because the current codebase uses composables/services.
- Design system coverage: Plan explicitly replaces raw Tailwind colors and keeps token/semantic typography rules.
- Main risk: Edit form expansion touches several composables and can be split further if implementation becomes too large.
