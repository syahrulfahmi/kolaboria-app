# Create & Edit Project UI — Implementation Plan

> **For agentic workers:** Gunakan `superpowers:executing-plans` untuk menjalankan task berurutan setelah rencana disetujui. Langkah menggunakan checkbox untuk melacak pekerjaan. Rencana ini tidak mengotorisasi commit, push, atau perubahan backend.

**Goal:** Mengadaptasi prototype HTML/CSS/JavaScript menjadi editor create dan edit project lima tahap yang mengikuti design system Kolaboria, menggunakan data dummy dan interaksi UI yang dapat dicoba.

**Architecture:** Kedua halaman menjadi entry point untuk editor bersama pada preview development. Draft, navigasi, validasi, dirty state, dan simulasi penyimpanan dikelola oleh composable; section menerima model bertipe dan reference data melalui props. Jalur API existing tetap tersedia di luar preview sampai ada keputusan integrasi berikutnya.

**Tech Stack:** Nuxt/Vue, TypeScript, Tailwind CSS v4, komponen Atomic/Molecule/Organism existing, Zod yang sudah tersedia, serta Node test runner existing. Tidak menambah dependency.

**Spec:** Permintaan pengguna dan prototype `C:/Users/Fahmi/.codex/attachments/56f7a47a-f3d4-4f94-8782-1b3849e57c47/Pasted text.txt`; keputusan desain untuk implementasi ada di bagian 3–8 dokumen ini.

**Status:** Implementasi UI preview selesai, 7 Oktober 2026. Ini belum mengintegrasikan field prototype dengan API atau persistensi server.

**Hasil verifikasi implementasi:** 14/14 targeted test lulus; production build berhasil; typecheck masih gagal pada 8 isu di file project/profile/layout yang sudah ada atau telah berubah di luar implementasi editor; suite client 30/32 dengan dua kegagalan baseline yang sudah ditemukan sebelum implementasi (`error.test.mjs` dan `verification-cooldown.test.mjs`). Browser visual check tidak berjalan karena CUA gagal memulai proses Windows. Graphify diperbarui setelah perubahan.

## 1. Kesepakatan, scope, dan acceptance utama

| Aspek | Keputusan rencana |
| --- | --- |
| Aktor | Inisiator yang membuat proyek atau memperbarui brief proyek miliknya. |
| Tujuan UI | Menjelaskan proyek, komposisi tim, nilai kolaborasi, dan ekspektasi waktu secara bertahap. |
| Sumber struktur | Lima tahap dan interaksi pada prototype pengguna. |
| Sumber visual | Token CSS, komponen UI, serta shell halaman Kolaboria pada checkout saat ini. |
| Scope | Create/edit preview, data dummy, validasi, navigation, role editor, review, local draft, simulasi submit, responsive layout, accessibility. |
| Di luar scope | Endpoint/payload baru, migrasi, persistensi server, perubahan lifecycle proyek, pembayaran, undangan, unggahan, refactor katalog/detail/workspace. |
| Acceptance utama | Kedua mode memakai struktur yang konsisten; seluruh input sampai review tetap tersinkron; aksi UI memberi feedback yang benar; draft dapat dipulihkan lokal; tidak ada project/master/workspace request dari jalur preview. |
| Batas pembuktian | Preview membuktikan perilaku UI. Keberhasilan API, database, publikasi nyata, dan authorization server memerlukan tahap terpisah. |

Asumsi yang menjadi bagian proposal: preview hanya development, draft memakai localStorage, field baru prototype disimpan pada view model UI, dan kategori proyek tetap mengikuti enum existing. Ini pilihan implementasi untuk ditinjau, bukan keputusan produk/backend yang sudah disahkan.

## 2. Temuan source dan perbedaan prototype

### Keadaan saat ini — confirmed secara statis

- `apps/client/app/pages/projects/create.vue` memakai empat tahap, menginisialisasi satu role kosong, memuat profil/roles/tools saat mount, dan menjalankan create/publish API saat submit.
- `apps/client/app/pages/projects/[slug]/edit.vue` adalah halaman edit yang sebenarnya. Halaman ini memakai empat tab, hydrate dari `Project`, cek owner pada UI, serta punya aksi status/publikasi.
- `components/project/create/RoleRequirementsEditor.vue` sudah menangani contribution role/custom role, deskripsi, capacity, tools per role, peran profesional owner, dan total kapasitas turunan.
- Tools proyek saat ini ada di tahap timeline; tanggung jawab role sudah ada, tetapi create step 1 belum menampilkan field deskripsi lengkap.
- `CreateProjectPayload` memakai `project_category`, `tool_ids`, `roles`, dan owner role. Role input saat ini tidak memiliki skill per role.
- Source CSS aktif memakai Geist, bukan Inter pada prototype atau DM Sans yang masih disebut panduan lama. Skala aktual: title 24/20/18 px; body 16/14/12 px; label 16/14/12 px.
- Komponen UI dapat dipakai lewat prefix `Atomic`, `Molecule`, dan `Organism`. `OrganismContentList` mendukung `mode="stepper"` dan `mode="free"`.
- `useFormGuard` tersedia, tetapi create/edit yang diperiksa belum menggunakannya. Tidak perlu memperluas API guard untuk proposal ini.
- `MoleculeDatePicker` terkini sudah mendukung picker mobile dengan drawer. Gunakan kemampuan ini; jangan membangun kalender lain dari prototype.
- Layout `home.vue` mengatur navbar dan lebar content, saat ini `lg:max-w-4/6`. Lebar editor efektif dibatasi shell tersebut, bukan hanya `max-w-7xl` di page.
- Test runner nyata adalah `node --test tests/*.test.mjs`, dengan helper runtime TypeScript/Vue. Vitest/Playwright yang disebut guideline bukan dependency runner terpasang pada package yang diperiksa.

### Pemetaan prototype → target

| Prototype | Penyesuaian |
| --- | --- |
| Lima tahap | Dipertahankan pada editor bersama. |
| Navbar, identitas pengguna, icon sprite | Pakai shell/ikon existing; jangan menyalin navbar dan data akun hardcoded. |
| Inter dan hex CSS sendiri | Ganti dengan Geist, typography utilities, semantic text colors, dan palette existing. |
| `type: web_app/mobile_app/...` | Field utama menjadi **Kategori Proyek**, memakai `PROJECT_CATEGORY_OPTIONS`. Jangan mengonversi diam-diam nilai legacy menjadi kategori. |
| Nama role bebas | Dropdown contribution role + opsi role khusus existing. |
| Skill per role berupa chips | Tetap ada sebagai `skill_tags` pada model UI dummy; tools per role tetap merupakan field berbeda. |
| Tech stack bebas | Multi-select searchable dari fixture tools, memakai `tool_ids` di model UI. |
| Total posisi `maxSlots` | Computed dari capacity role; tidak ada field jumlah kontributor manual. Inisiator tidak ikut dihitung. |
| Asal, alasan kolaborasi, hasil kontributor, komitmen owner | Section baru; jangan menumpangkan beberapa field pada `why_join` agar tampak terintegrasi. |
| `PAGE_MODE` konstan | Prop mode dari entry point create/edit. |
| `innerHTML`, DOM selectors, `onclick` | Vue binding, computed, typed emits, dan composable. Semua teks pengguna dirender sebagai teks, bukan HTML. |
| Toast + console log saja | Simulasi dengan state submitting/result dan penyimpanan lokal yang nyata. |
| Klik sidebar bebas | Create sequential dengan validasi; edit boleh mengunjungi setiap section, save memvalidasi seluruh brief. |

## 3. Pilihan pendekatan

| Pendekatan | Dampak |
| --- | --- |
| **Editor bersama dalam preview development — direkomendasikan** | Create/edit memiliki visual dan state yang sama; field dummy tidak masuk request existing; bisa direview pada rute asli. |
| Mengganti create dan edit langsung menjadi dummy | Lebih singkat, tetapi menonaktifkan alur API yang sudah ada dan menyulitkan perbandingan. |
| Halaman prototype terpisah | Terisolasi, tetapi kurang membuktikan penyesuaian dengan entry point dan shell yang diminta. |

Preview diaktifkan hanya oleh `import.meta.dev && route.query.preview === '1'`:

- Create: `/projects/create?preview=1`.
- Edit fixture: `/projects/platform-portofolio-talenta-digital/edit?preview=1`.
- Production mengabaikan query preview dan memakai alur existing.
- Entry point memilih cabang sebelum setup/lifecycle pemuat data dijalankan. Jangan hanya menyembunyikan template sementara `onMounted` existing tetap fetch.
- `auth` dan `onboarding-guard` tetap berlaku. Preview tidak menjadi bypass login atau onboarding. Request auth/navbar existing dapat tetap terjadi; larangan request pada acceptance khusus data dan command project/master/workspace dari editor preview.
- Preview diberi satu informasi singkat: **“Pratinjau proyek — perubahan disimpan di perangkat ini.”** Tidak ada mock-success fallback pada error dari jalur live.
- URL edit yang tidak cocok fixture atau record lokal menampilkan empty/not-found preview dengan tautan kembali. Jangan memakai satu fixture untuk semua slug tanpa penjelasan.

Pemisahan jalur live merupakan mekanisme sementara untuk review UI. Integrasi editor ini ke jalur production membutuhkan plan lanjutan untuk mapping field dan kebijakan server; tidak ada adapter ke endpoint yang diarang pada tahap ini.

## 4. Desain halaman dan tiap tahap

### 4.1 Shell dan hierarchy

- Reuse layout `home`; header halaman menampilkan breadcrumb, judul mode, dan deskripsi singkat.
- Desktop lebar: sidebar sekitar 224–256 px + content fleksibel `min-w-0`; gap 24–32 px. Sidebar sticky mengikuti tinggi navbar.
- Gunakan dua kolom hanya jika lebar content aktual cukup untuk panel form minimal sekitar 560 px. Dengan shell `lg:max-w-4/6`, gunakan ambang container sekitar 840 px, bukan mengandalkan viewport `lg` saja.
- Tablet/laptop sempit: navigation ringkas di atas form; satu kolom, tanpa sidebar yang membuat form terjepit.
- Mobile: heading ringkas, “Langkah n dari 5”, progress lima segmen, satu kolom. Tidak menambahkan navbar sticky kedua di bawah navbar layout.
- Satu `OrganismCard` outlined sebagai panel utama: header section, content, dan action footer. Role card memakai pembatas/tint ringan untuk grouping; hindari beberapa lapis card elevated.
- Footer sticky memiliki border dan shadow standar yang ringan; sediakan ruang scroll di bawah dan safe-area inset. Tidak menyalin shadow RGB arbitrary prototype/halaman lama.
- Tombol tidak berupa `NuxtLink` yang membungkus button; pakai `AtomicButton :to` untuk tautan, atau event navigation saat perlu guard.

### 4.2 Informasi Dasar

Urutan: catatan “Ceritakan proyek, bukan lowongan” → judul → ringkasan → deskripsi → kategori/visibilitas → tautan proyek.

- Judul dan ringkasan memiliki penghitung karakter; batas UI usulan mengikuti prototype: 80 dan 180 karakter.
- Deskripsi lengkap ditampilkan dan wajib sebelum lanjut/publish preview.
- Kategori memakai enum existing; visibility `public` / `invite_only`, label “Publik” / “Hanya melalui undangan”. Jangan menjanjikan alur undangan sudah tersedia.
- Slug existing tetap dipertahankan sebagai informasi sekunder. Create mengikuti judul sampai pengguna mengubah manual; edit tidak mengubah slug otomatis saat judul berubah.
- Edit slug adalah aksi eksplisit dengan warning dan cancel yang mengembalikan nilai awal. Preview perubahan slug memperbarui lokasi record lokal secara atomik setelah save berhasil; tidak melakukan redirect ke detail server.
- Validasi panjang tersebut adalah aturan UI preview. Batas/minimum server perlu dicocokkan ulang saat integrasi; historical product doc tidak menjadi kontrak backend terkini.

### 4.3 Kebutuhan Tim

- Ringkasan total posisi dan jumlah role berada di atas daftar, dihitung secara reaktif.
- Awal create mempunyai satu role kosong dengan capacity 1.
- Tiap role: header nama + jumlah posisi, role master/custom title, jumlah orang, tanggung jawab, skill chips, dan tools per role opsional.
- Nama role dipilih dari fixture contribution roles existing; opsi “Lainnya” menampilkan input nama custom.
- Skill chips: input + tombol tambah dan Enter, trim, deduplicate case-insensitive, tombol hapus berlabel, wrap untuk teks panjang. Enter menambah chip dan tidak melakukan submit form.
- Pilihan tools memakai multi-select searchable; maksimal 8 tools per role sesuai editor existing. Project toolchain berada setelah role list dan merupakan selection berbeda.
- Role baru memakai stable `client_key`; persisted role menyimpan `id` terpisah. Penghapusan role tengah tidak memindahkan nilai/focus ke role lain akibat index key.
- Minimal satu role. Role terakhir tidak dapat dihapus; tampilkan alasan yang bisa dibaca.
- Capacity integer 1–20; total seluruh role maksimal 20. Angka 0, pecahan, kosong, negatif, atau total berlebih menampilkan error; jangan diam-diam mengubah input menjadi angka lain.
- Peran profesional inisiator existing tetap tersedia sebagai pilihan opsional, tidak dihitung sebagai posisi kontributor.
- Fixture edit dengan anggota aktif menampilkan posisi terisi/tersisa. Capacity tidak boleh di bawah `filled_capacity`; role berisi anggota tidak bisa dihapus. Ini simulasi guard UI, bukan bukti enforcement server.

### 4.4 Konteks Kolaborasi

- Empat pilihan asal: pribadi, komunitas, eksperimen, klien. Dua kolom pada ruang cukup, satu kolom pada mobile.
- Gunakan `AtomicRadio` dalam fieldset; seluruh pilihan dapat dipahami lewat label dan deskripsi, state terpilih tidak hanya dibedakan warna.
- Tiga textarea wajib: alasan kolaborasi, hasil yang diharapkan kontributor, dan keterlibatan inisiator.
- Pilihan klien menampilkan penjelasan transparansi dan checkbox tanggung jawab inisiator.
- Ketika berpindah dari klien ke asal lain, acknowledgement klien direset. Tiga jawaban tetap tersimpan. Memilih klien lagi membutuhkan acknowledgement baru.
- Copy konsisten: “proyek”, “inisiator”, “kontributor”, “peran”, “Publikasikan”. Hindari mengganti nama route/type hanya untuk menyesuaikan bahasa UI.
- Jangan menambahkan janji pendapatan, sertifikat, exposure, atau Experience Record otomatis. Jawaban berisi ekspektasi inisiator, bukan jaminan platform.

### 4.5 Waktu & Komitmen

- Tanggal mulai dan target selesai menggunakan `MoleculeDatePicker`, tetap opsional untuk brief preview.
- Jika keduanya terisi, target selesai harus sama atau sesudah tanggal mulai. Jangan menolak tanggal historis pada edit hanya karena tanggal itu sudah lewat.
- Pertahankan format date-only `YYYY-MM-DD`; parse/format lewat kalender lokal, tanpa pergeseran hari dari konversi UTC.
- Pilihan ketersediaan: fleksibel, paruh waktu, akhir pekan, intensif; default fleksibel.
- Estimasi jam: 5, 10, 15, 20 per minggu; default 10, mengikuti prototype.
- Checkbox prinsip kolaborasi wajib untuk lanjut/publish/save penuh. Gunakan `AtomicCheckbox`, label yang jelas, dan deskripsi yang tidak dianggap kontrak legal.
- Tampilan waktu tanpa tanggal di review berbunyi “Belum ditentukan”, bukan tanda yang menyiratkan error.

### 4.6 Review

- Ringkasan judul/deskripsi, kategori, visibility, slug, role/tanggung jawab/skill/tools, total posisi, project toolchain, konteks, inisiator, serta waktu/komitmen.
- Empat group sesuai section input, masing-masing memiliki aksi “Ubah” menuju section terkait. Review selalu membaca draft reaktif, bukan snapshot stale yang dibuat sekali saat masuk tahap.
- Teks panjang memakai wrap dan mempertahankan newline; semua chips dapat membungkus.
- Edit menampilkan status fixture dengan `ProjectStatusBadge`. “Simpan Perubahan” menyimpan brief dan mempertahankan status saat ini.
- Aksi lifecycle existing tetap berada di jalur live. Preview tidak menambahkan start/complete/archive, dan tidak menganggap save edit sebagai publish.

## 5. Design system dan kebutuhan komponen

### 5.1 Typography dan warna teks

| Elemen | Utility |
| --- | --- |
| Judul halaman desktop | `font-title-1 text-primary` — 24 px pada source saat ini. |
| Judul tahap | `font-title-2 text-primary` — 20 px. |
| Judul role/subsection | `font-title-3 text-primary` — 18 px. |
| Label field | Default molecule existing; label custom `font-label-1 text-primary`. |
| Tombol, navigation, chip | `font-label-2`, sesuai component existing. |
| Nilai input / metadata | `font-body-2 text-primary` — 14 px. |
| Deskripsi multi-line | `font-paragraph-3 text-secondary` — 14 px. |
| Hint dan counter | `font-body-3 text-secondary`; teks penting tidak dibuat tertiary yang pucat. |
| Disabled | `text-tertiary` dengan disabled state yang nyata. |
| Aksi aktif / tautan | `text-brand`; untuk teks kecil di tint terang gunakan token `text-primary-700` bila diperlukan agar terbaca. |
| Error / warning | `text-danger-700` / `text-accent-700`, ditambah ikon atau copy; bukan warna saja. |

`text-primary` adalah semantic foreground neutral-900, sedangkan `text-primary-600` adalah aksen brand. Jangan menukar keduanya. Semua ukuran mengambil utility source, bukan angka dari tabel guideline historis.

Surface: `bg-white`, `bg-neutral-50`; border `border-neutral-200`; aktif `bg-primary-50`; informasi menggunakan variant existing. Radius `rounded-lg/xl/2xl` sesuai komponen dan kepadatan. Tidak menambah font, palette, gradients, atau global theme baru.

### 5.2 Pemetaan komponen

| Kebutuhan | Komponen |
| --- | --- |
| Navigation desktop | `OrganismContentList`: stepper untuk create, free untuk edit. |
| Panel utama | `OrganismCard` outlined, satu owner padding. |
| Teks / jumlah | `MoleculeInputField`; jumlah dinormalisasi bertipe saat event, bukan mempercayai `.number` saja. |
| Ringkasan / deskripsi / konteks | `MoleculeTextarea`, counter sesuai dukungan API komponennya. |
| Role, kategori, tools, komitmen | `MoleculeDropdown`, searchable/multiple sesuai field. |
| Asal / persetujuan | `AtomicRadio`, `AtomicCheckbox`. |
| Skill chips | `AtomicTag` closable + input/tombol existing. |
| Tombol / ikon | `AtomicButton`, `AtomicIconButton`; ikon `lucide:*` dengan nama statis. |
| Info / error / kelayakan publish | `MoleculeTicker`. |
| Konfirmasi / toast | `usePopup`, `useToast`; tidak membuat overlay/toast baru. |
| Tanggal | `MoleculeDatePicker` existing termasuk drawer mobile. |
| Status edit | `ProjectStatusBadge` existing. |

### 5.3 Koreksi primitive yang dibatasi scope

Source `InputField`/`Textarea` memiliki label tanpa association eksplisit dan beberapa kelas `text-body`/error nonsemantic. Rencana mencakup perbaikan kecil yang backward-compatible:

- `InputField.vue` dan `Textarea.vue`: prop `id?: string`, fallback `useId`, `label for`, control id, hint/error id, `aria-describedby`, `aria-invalid`, body typography semantik, danger tokens existing. Tidak mengubah event model.
- `Radio.vue`: prop `name?: string` diteruskan ke input asli supaya fieldset asal proyek memakai satu native radio group; gunakan typography semantik untuk label. Tidak mengubah value union atau emits.
- Komponen lain mengikuti API existing. Keyboard dropdown/date picker dan nama tombol hapus chips diverifikasi di browser; perbaikan tambahan hanya jika acceptance nyata gagal, tanpa redesign primitive lintas aplikasi.
- Jalankan regression pada contoh field/auth/profile dan radio Storybook setelah perubahan primitive. Jangan merombak global CSS untuk mengatasi satu form.

## 6. Model UI, fixtures, dan penyimpanan

### 6.1 Tipe baru terpisah dari DTO backend

Tambahkan `types/project-editor.ts`. Semua field data memakai snake_case; property runtime/composable boleh mengikuti convention TypeScript existing. Tidak menggunakan `any`.

- `ProjectEditorMode = 'create' | 'edit'`.
- `ProjectEditorStep = 0 | 1 | 2 | 3 | 4`.
- `ProjectOrigin = 'personal' | 'community' | 'experiment' | 'client'`.
- `ProjectEditorAvailability = 'flexible' | 'part_time' | 'weekends_only' | 'full_time'`.
- `ProjectEditorRole`: `client_key`, `id?`, `contribution_role_id?`, `custom_title?`, `description`, `capacity`, `filled_capacity`, `tool_ids: string[]`, `skill_tags: string[]`.
- `ProjectEditorDraft`: `title`, `summary`, `description`, `slug`, `project_category: ProjectCategory`, `visibility: ProjectVisibility`, `roles`, `tool_ids`, `owner_contribution_role_id?`, `owner_custom_role_title?`, `origin`, `why_collaborative`, `contributor_outcome`, `owner_commitment`, `client_acknowledgement`, `start_date: string | null`, `deadline: string | null`, `availability`, `hours_per_week: 5 | 10 | 15 | 20`, `collaboration_agreement`.
- `ProjectEditorReferences`: contribution roles dan tools memakai tipe existing; skill suggestions berupa string untuk preview.
- `ProjectEditorRecord`: `id`, `slug`, `status: ProjectStatus`, `draft`, `saved_at`, `version: 1`; status berada di record, bukan input brief.
- `ProjectEditorErrors`: error form dan map field/per-role memakai stable `client_key`, bukan index.
- `ProjectEditorSaveOutcome`: union sukses dengan record atau gagal dengan pesan lokal yang aman; tidak menyerupai response API.

Tidak menambahkan `skill_tags`, origin, acknowledgement, availability, atau hours ke `CreateProjectPayload`. Tidak menghidupkan kembali `tech_stack`/`project_role_skills` atau membuat `max_slots` editable.

### 6.2 Fixture dan state yang harus tersedia

Fixture edit utama mengikuti isi prototype: **Platform Portofolio untuk Talenta Digital**, kategori `product`, Frontend 2 + Backend 2 + UI/UX 1, total 5 posisi; tanggal 15 Oktober–15 Desember 2026, paruh waktu, 10 jam/minggu. Roles/tools memakai ID fixture yang konsisten; skill competency dan tools tetap berbeda.

Fixture berisi boolean acknowledgement/prinsip yang eksplisit agar hidrasi tidak bergantung default tersembunyi. Setiap factory mengembalikan deep copy; mengedit satu session tidak mengubah fixture atau session lain.

Skenario test tambahan: draft parsial, asal klien belum diakui, role custom, total 20/21, role terisi, invite-only, tanggal parsial/terbalik, teks panjang, profile publish di bawah 50%, owner mismatch, serta storage rusak/tidak tersedia. Scenario dipilih melalui test/Storybook input, bukan kontrol debug yang masuk alur utama pengguna.

Kelayakan publish meniru affordance existing: email verified dan completion score minimal 50%. Kebijakan ini hanya untuk state UI preview dan harus diberi label sebagai fixture pada bukti pengujian; auth/owner enforcement nyata tidak diklaim.

### 6.3 Local draft dan outcome

- Storage key: `kolaboria:project-editor-preview:v1:<current_user_id>:create` atau `...:<current_user_id>:edit:<slug>`; namespace akun/mode/proyek mencegah draft pengguna berbeda tertukar.
- `create` memulihkan draft lokal jika tersedia; selain itu blank factory. `edit` memulihkan record lokal slug yang cocok, lalu fixture sebagai initial fallback yang eksplisit untuk preview.
- Parse record dengan schema versi 1. JSON rusak, versi tidak didukung, atau referensi invalid menghasilkan warning dan initial state bersih; jangan mengeksekusi command terhadap ID tersebut.
- Tidak ada autosave pada tahap ini. “Simpan Draft” menulis snapshot lokal parsial setelah pemeriksaan struktur dasar. Caption setelah sukses menunjukkan waktu penyimpanan lokal.
- Save draft tidak mengharuskan field wajib publication lengkap, tetapi data angka/tanggal malformed tetap ditolak agar record dapat dipulihkan.
- Publish mensyaratkan seluruh validasi, mengubah status record lokal menjadi `open`, dan memberi feedback **“Simulasi publikasi berhasil. Proyek belum diterbitkan ke server.”**
- Edit save mempertahankan status record, menulis seluruh brief yang valid, memperbarui baseline, dan memberi feedback **“Perubahan tersimpan di perangkat ini.”**
- Setelah submit sukses, tetap pada preview dengan result ringkas dan akses kembali ke review/edit. Tidak redirect ke detail server dengan slug dummy.
- Storage denied/quota error menghasilkan error yang dapat ditindaklanjuti, draft tetap di layar, baseline tetap dirty. Jangan mengirim toast sukses jika persistensi lokal gagal.
- Commit perubahan slug lokal menulis key baru dulu; hapus key lama hanya setelah berhasil. Jika gagal, lokasi dan baseline sebelumnya tetap berlaku.
- Simulasi memiliki status `idle → submitting → success/error`, delay pendek yang deterministik, serta lock semua mutation selama submit. Timer dibersihkan saat unmount; tidak ada double-save/double-publish.

## 7. Navigation, validasi, dan perubahan belum disimpan

| Tahap | Syarat lanjut / save penuh |
| --- | --- |
| Dasar | title trim nonempty ≤80, summary nonempty ≤180, description nonempty, kategori/visibility valid, slug valid bila diubah. |
| Tim | Minimal 1 role; master role atau custom title; tanggung jawab nonempty; minimal 1 skill chip; capacity integer 1–20; total ≤20; capacity ≥filled; selections ada pada fixture. |
| Konteks | Tiga jawaban nonempty; origin valid; acknowledgement true khusus klien. |
| Waktu | Tanggal kosong atau valid date-only; urutan benar jika keduanya ada; availability/jam sesuai enum; prinsip disetujui. |
| Review | Validasi ulang semua tahap dan publish eligibility jika aksi publish. |

- “Lanjut” menjalankan validasi dan menampilkan inline errors; field pertama yang invalid memperoleh focus. Tombol tetap dapat ditekan untuk mengetahui kesalahan, lalu disabled hanya saat submitting atau read-only.
- Create tidak bisa melompati tahap belum tervalidasi lewat sidebar. Kembali tidak memvalidasi dan tidak menghapus nilai. Completion indicator berasal dari validitas section, bukan semata index lebih kecil.
- Edit boleh berpindah section tanpa kehilangan perubahan. Save penuh menampilkan error dan membuka tahap pertama yang invalid. “Simpan Draft” hanya untuk create; draft edit tetap disimpan melalui “Simpan Perubahan” sesuai mode existing, tidak mengubah status.
- Tombol “Ubah” dari review dapat kembali ke input; tombol “Kembali ke Review” memvalidasi seluruh section yang dilalui dan tidak mem-bypass invalid state.
- Snapshot awal diambil setelah hydrate/recovery selesai. `isDirty` membandingkan data brief yang tersimpan, bukan current step atau error state.
- Daftarkan `onBeforeRouteLeave` dan `onBeforeRouteUpdate` blocker yang mengembalikan `false` ketika submitting, sebelum memanggil `useFormGuard(() => isDirty.value || isSubmitting.value)`. Dengan urutan ini, busy navigation dibatalkan tanpa membuka popup lain; guard existing tetap menangani draft dirty dan beforeunload. Perpindahan internal tahap bukan perubahan route dan tidak memicu popup.
- Cancel/back ke luar editor memakai `triggerCancel` dengan fallback `/projects/my-projects` untuk create atau detail project untuk edit. Back dari tahap berikutnya mundur satu tahap.
- Tutup popup konfirmasi submit sebelum menjalankan simulasi async, lalu nonaktifkan aksi leave UI selama submitting. `usePopup` existing tidak menyediakan prop tombol disabled; jangan mengarang dukungan itu. Route blocker mencegah konfirmasi leave baru selama submit; sebelumunload tetap memiliki guard. Cleanup mencegah update setelah unmount jika browser tetap meninggalkan halaman.
- Baseline baru diambil hanya setelah persistensi lokal sukses. Save gagal tidak menghilangkan status dirty.

## 8. Accessibility dan responsive acceptance

- Semua control memiliki accessible name; error/hint terkait dengan control. Required status terbaca oleh teknologi bantu, tidak hanya asterisk.
- Asal proyek memiliki fieldset/legend dan native radio name; keyboard arrows, Space, dan Tab bekerja.
- Role remove/chip remove memiliki label dengan nama role/skill; focus pindah ke role berikutnya atau tombol tambah setelah item dihapus.
- Setelah pergantian tahap, focus ke heading/control yang sesuai dan scroll menggunakan offset navbar. Pengguna reduced-motion tidak diberi smooth-scroll wajib.
- Navigation menyampaikan current step, total, dan section completed/invalid; progress mobile memiliki label teks, tidak bergantung warna.
- Toast tidak menjadi satu-satunya tempat error; error persisten tersedia dekat field/action.
- Target interaksi mobile sekitar 44 px, chips mudah dihapus, icon-only action memiliki nama.
- Dropdown/date picker tidak terpotong panel/overflow dan mengikuti overlay behavior existing. Popup mengembalikan focus ke trigger.
- Lebar yang diverifikasi: 360, 390, 768, 1024, 1280, dan 1440 px; zoom browser 200%. Tidak ada horizontal overflow, footer menutupi field, atau sidebar mengecilkan content.
- Tidak mengubah lebar/navbar global layout pengguna sebagai bagian styling page. Jika shell menghambat, container breakpoint/editor layout yang beradaptasi.

## 9. Peta file dan tanggung jawab

Semua path di tabel berikut relatif terhadap repo `C:/Users/Fahmi/Documents/development/workspace/kolaboria-app`.

| File | Aksi / tanggung jawab |
| --- | --- |
| `apps/client/app/pages/projects/create.vue` | Entry point: pilih preview/live sebelum lifecycle; metadata dan mode create. |
| `apps/client/app/pages/projects/[slug]/edit.vue` | Entry point: mode edit, slug, preview/live. |
| `apps/client/app/components/project/create/CreateProjectLive.vue` | Pindahkan isi create existing untuk menjaga jalur live selama preview; perilaku existing dipertahankan. |
| `apps/client/app/components/project/edit/EditProjectLive.vue` | Pindahkan isi edit existing termasuk load, owner check, save, dan status actions. |
| `apps/client/app/types/project-editor.ts` | Model UI dan typed interfaces. |
| `apps/client/app/data/project-editor-fixtures.ts` | Factory draft/reference/record dummy dan scenario test. |
| `apps/client/app/data/project-editor-validation.ts` | Schema storage dan fungsi validasi field/step/all. |
| `apps/client/app/utils/project-editor.ts` | Pure helpers: role capacity, normalize tags, slug/date display, snapshot comparison. |
| `apps/client/app/composables/useProjectEditor.ts` | Draft controller, navigation, local storage, dirty baseline, submit simulation. |
| `apps/client/app/components/project/editor/ProjectEditor.vue` | Shared preview container, load/result/error states, guard/popup/toast wiring. |
| `apps/client/app/components/project/editor/ProjectEditorNavigation.vue` | Desktop ContentList + mobile step/progress, focus/navigation events. |
| `apps/client/app/components/project/editor/ProjectEditorActions.vue` | Sticky mode-aware CTA/footer; events tanpa persistensi. |
| `apps/client/app/components/project/editor/ProjectEditorInfo.vue` | Section 1, termasuk slug existing. |
| `apps/client/app/components/project/editor/ProjectEditorTeam.vue` | Section 2, total, roles, project tools, owner role. |
| `apps/client/app/components/project/editor/ProjectEditorRoleCard.vue` | Satu role dengan stable key, errors, chips, selection/capacity. |
| `apps/client/app/components/project/editor/ProjectEditorContext.vue` | Section 3, origin dan transparansi klien. |
| `apps/client/app/components/project/editor/ProjectEditorTimeline.vue` | Section 4, date conversion dan komitmen. |
| `apps/client/app/components/project/editor/ProjectEditorReview.vue` | Section 5, ringkasan reaktif dan edit-section events. |
| `apps/client/app/components/ui/molecules/InputField.vue`, `Textarea.vue` | Perbaikan association/error/semantic body sesuai bagian 5.3. |
| `apps/client/app/components/ui/atoms/Radio.vue` | Native radio group name dan label semantic. |
| `apps/client/tests/project-editor-validation.test.mjs` | Validation/capacity/date/normalization regressions. |
| `apps/client/tests/project-editor-state.test.mjs` | Factory isolation, navigation, recovery, dirty baseline, submit outcome. |
| `apps/client/tests/project-editor-preview.test.mjs` | Route preview gate dan isolasi command/data live. |

Tidak mengubah service project, DTO `project.ts`, category constants, global CSS, middleware, runtime config, maupun komponen create/edit existing yang tetap digunakan jalur live. Pada pemindahan live, import relatif harus disesuaikan menjadi alias dan `definePageMeta` tinggal pada page; `useHead` hanya dijalankan container aktif.

Working tree awal sudah memiliki perubahan pengguna pada `layouts/home.vue`, `pages/home.vue`, `pages/profile/me/index.vue`, `nuxt.config.ts`, client `package.json`, dan lockfile. Pertahankan seluruh perubahan tersebut; jangan melakukan revert/staging massal.

## 10. Global constraints

- Prototype menentukan struktur; source CSS/komponen existing menentukan typography, color, dan control behavior.
- UI dummy mempunyai namespace/mode yang eksplisit; tidak menjadi fallback pada jalur data nyata.
- Tidak ada dependency baru, `any` baru, direct API call dari section, atau perubahan wire contract.
- Data model UI tidak dikirim mentah sebagai `CreateProjectPayload`.
- ID role server dan stable key UI merupakan identitas berbeda.
- Nilai draft tidak hilang saat berpindah section, gagal save, atau memilih role lain.
- Koreksi primitive backward-compatible; regression consumer existing wajib diperiksa.
- Selesai implementasi harus menjalankan update Graphify sesuai aturan repo. Dokumen plan saja tidak memerlukan graph update kode.

## 11. Review focus

Lima kondisi yang paling berisiko dan task pemiliknya:

1. Preview tetap menjalankan mount/API live karena conditional hanya di template — Task 1 dan test isolasi.
2. Hapus role tengah/kapasitas terisi menghasilkan state salah atau capacity negatif — Task 2/4 dan state+validation tests.
3. Save gagal/storage rusak/akun berganti menghilangkan draft atau memberi sukses palsu — Task 2/7 dan recovery tests.
4. UTC/date-only dan kembali dari review menyebabkan hari/data berubah — Task 2/6 dan round-trip tests.
5. Shell laptop/mobile, focus, radio keyboard, dan footer sticky menghambat form — Task 3/8 dan browser acceptance.

## 12. Urutan implementasi dan verifikasi per task

### Task 1 — Entry point preview yang terisolasi

**Files:** create/edit pages; `CreateProjectLive.vue`, `EditProjectLive.vue`; preview test.

**Interfaces:** `isProjectEditorPreview(is_dev: boolean, preview: unknown): boolean` pada util; active branch menerima mode dan slug dari route, live container tetap memakai API existing.

- [ ] Catat baseline diff dan jalur request existing sebelum pemindahan.
- [ ] Tulis test: gate true hanya untuk dev+string `'1'`; false untuk production, array query, nilai absent, atau nilai lain.
- [ ] Pindahkan create/edit existing ke live container tanpa mengubah flow; page mempertahankan middleware/layout/meta.
- [ ] Pilih preview/live sebelum container mount; jangan instantiate composable live pada preview page.
- [ ] Pada test, instrument pemuat/command live dan pastikan tidak dipanggil saat preview aktif; jangan hanya menguji string markup source.
- [ ] Verifikasi route biasa masih memilih live dan semua relative imports berhasil resolve.

**Output:** preview mempunyai jalur render sendiri, dengan live flow tetap tersedia. Final browser network proof diselesaikan Task 8.

### Task 2 — Tipe, fixture, validation, dan state controller

**Files:** model, fixtures, validation, utils, `useProjectEditor`, validation/state tests.

**Interfaces:** `createBlankProjectEditorDraft(): ProjectEditorDraft`; `createProjectEditorFixture(slug: string): ProjectEditorRecord | null`; `validateProjectEditorStep(step, draft, references): ProjectEditorErrors`; `validateProjectEditorDraft(draft, references): ProjectEditorErrors`; `getProjectEditorCapacity(roles): number`; `normalizeProjectEditorTag(value): string`; `useProjectEditor({mode, slug, currentUserId, references, initialRecord, eligibility, storage?, delayMs?})`.

Controller menghasilkan `draft`, `record`, `currentStep`, `errors`, `isDirty`, `isSubmitting`, `submitError`, `saveResult`, `totalCapacity`; commands `goToStep`, `next`, `back`, `addRole`, `removeRole`, `saveDraft`, `publish`, `saveChanges`. Options/types semua didefinisikan di model; storage/timer dapat diinjeksi untuk test deterministik.

- [ ] Tulis behavioral tests sebelum state logic: factory independent; role 2+2+1 =5; role/owner tools terpisah; normalized chips dedup; role terakhir tidak terhapus.
- [ ] Uji integer capacity 0/1/20/21/pecahan, total 20/21, capacity kurang dari filled, dan stable keys setelah remove role tengah.
- [ ] Uji required per tahap, client acknowledgement, tanggal tidak valid/terbalik/parsial, serta date-only round-trip tanpa UTC shift.
- [ ] Buat model/fixture/schema/helpers, kemudian controller dengan state per instance dan deep-copy baseline.
- [ ] Uji create sequential/edit free; kembali tidak reset; review membaca perubahan terkini; invalid save membuka section pertama yang error.
- [ ] Uji namespace akun+slug, recovery version/corrupt storage, failure menjaga baseline dirty, sukses mengubah baseline, rename storage atomik, dan duplicate-submit lock; browser guard harus menolak route change selama submitting tanpa mengganti popup konfirmasi aktif.

**Output:** state/form behavior dapat diuji tanpa backend dan tanpa merender keseluruhan halaman.

### Task 3 — Editor shell, navigation, dan fondasi form accessible

**Files:** ProjectEditor, Navigation, Actions; InputField/Textarea/Radio corrections.

**Interfaces:** container menerima `mode: ProjectEditorMode`, `slug?: string`; section memakai `v-model:form: ProjectEditorDraft`, `errors: ProjectEditorErrors`, `disabled: boolean`; navigation emits step target, actions emits next/back/cancel/save-draft/publish/save-changes sesuai mode.

- [ ] Bangun panel tunggal dan header memakai skala/token pada bagian 5, tanpa menyalin CSS prototype.
- [ ] Navigation memanfaatkan ContentList; mode dan completion mengikuti controller.
- [ ] Terapkan layout berdasar lebar content, mobile progress, dan footer safe-area.
- [ ] Hubungkan guard unsaved, popup existing, submit locks, focus heading, dan reduced-motion scroll.
- [ ] Perbaiki tiga primitive sesuai batas bagian 5.3; cek label associations, radio group keyboard, serta consumer existing.

**Output:** create/edit mempunyai shell konsisten dengan field semantics yang bisa diakses keyboard.

### Task 4 — Informasi dasar dan editor tim

**Files:** Info, Team, RoleCard; state/validation tests bila ada branch baru.

- [ ] Implement field informasi lengkap termasuk deskripsi, counter 80/180, kategori/visibility, slug preview/edit cancel.
- [ ] Implement role master/custom, responsibilities, capacity errors, skill chip Enter/add/remove, dan tools per role.
- [ ] Implement total summary dan project toolchain terpisah; owner role tetap opsional.
- [ ] Tambah role dengan focus ke field pertama; hapus role dengan stable identity/focus fallback.
- [ ] Verifikasi constraint role terisi, jumlah maksimum, label delete, teks panjang, serta preservation setelah next/back.

**Output:** dua tahap pertama bisa digunakan dari kondisi kosong sampai tim lengkap; total 5 pada fixture sama di editor dan review berikutnya.

### Task 5 — Konteks kolaborasi

**Files:** Context; tests acknowledgement/required fields.

- [ ] Implement origin fieldset, pilihan radio, tiga jawaban, dan client transparency conditional.
- [ ] Implement reset acknowledgement saat keluar dari klien dengan preservation jawaban.
- [ ] Sambungkan inline errors dan focus; hindari toast sebagai satu-satunya validation feedback.
- [ ] Verifikasi keyboard, satu pilihan aktif, dan edit hydration dari fixture termasuk boolean.

**Output:** konteks kolaborasi menjadi tahap terpisah yang mengikuti prototype dan vocabulary Kolaboria.

### Task 6 — Waktu, komitmen, dan review reaktif

**Files:** Timeline, Review; date/review regressions.

- [ ] Implement date pickers, availability, hours, prinsip kolaborasi, dan date-only local conversion.
- [ ] Implement review semua section dan tombol Ubah/Kembali ke Review.
- [ ] Tampilkan status edit dan eligibility warning tanpa lifecycle command baru.
- [ ] Verifikasi tanggal historis edit, urutan invalid, blank dates, skill/tool scopes, dan perubahan setelah balik dari review.

**Output:** lima tahap lengkap, review merupakan representasi draft terkini.

### Task 7 — Local draft dan simulasi submit yang jelas

**Files:** controller, container, Actions, preview/state tests.

- [ ] Hubungkan save draft partial, publish full, edit save full, confirmation popup, dan result state.
- [ ] Simulasikan submitting dengan delay deterministik; semua mutation/final CTA terkunci sampai selesai.
- [ ] Tampilkan feedback lokal yang telah ditetapkan; hasil publish tidak mengarah ke detail proyek server.
- [ ] Verifikasi reload recovery, save error dengan storage unavailable, slug rename, double click, serta cleanup saat unmount.
- [ ] Pastikan live commands tetap tidak pernah dipanggil oleh preview, termasuk tombol di result dan popup.

**Output:** pengguna dapat mencoba alur dari input sampai hasil dan melanjutkan draft tanpa persistensi server.

### Task 8 — Acceptance, regression, dan penyerahan

**Files:** hanya perbaikan hasil verifikasi dalam scope; graph output setelah code update.

- [ ] Jalankan targeted tests baru lalu suite client existing sekali setelah seluruh perubahan selesai.
- [ ] Jalankan typecheck dan production build; pisahkan kegagalan existing dari perubahan task berdasarkan evidence, bukan asumsi.
- [ ] Review browser create/edit pada seluruh viewport/zoom bagian 8; batch screenshot desktop/mobile semua tahap dan input panjang.
- [ ] Browser Network: hanya aktivitas shell/auth yang existing bila terjadi; tidak ada create/update/publish/load project/master/workspace pada preview.
- [ ] Browser production: `?preview=1` tidak mengaktifkan dummy editor. Jangan menjalankan mutasi project nyata untuk membuktikan UI dummy.
- [ ] Regression live: route create/edit, metadata, gate/profile message, status panel, imports, dan pemilihan komponen tetap terhubung. UI-only verification tidak membuktikan API mutations masih sukses runtime.
- [ ] Periksa `git diff --check`, scope diff, serta koreksi primitive pada consumer form existing.
- [ ] Jalankan `graphify update .` setelah perubahan kode, dan tinjau output/error. Laporkan bila pembaruan gagal, jangan mengklaim graph sudah diperbarui.
- [ ] Serahkan screenshots, hasil commands, matriks acceptance UI, limitation dummy/backend, dan file yang berubah. Tidak commit/push tanpa instruksi pengguna.

**Commands yang direncanakan, belum dijalankan:**

```powershell
pnpm --filter @kolaboria/client exec node --test tests/project-editor-validation.test.mjs tests/project-editor-state.test.mjs tests/project-editor-preview.test.mjs
pnpm --filter @kolaboria/client test
pnpm --filter @kolaboria/client exec nuxt typecheck
pnpm build
git diff --check
graphify update .
```

Jika CLI typecheck/helper memerlukan tooling yang belum tersedia, laporkan batasnya; jangan memasang dependency tanpa kebutuhan dan jangan menyebut pemeriksaan sukses hanya karena build lulus.

## 13. Matriks acceptance UI

| ID | Kondisi dan aksi | Hasil yang harus terlihat | Bukti |
| --- | --- | --- | --- |
| UI-01 | Buka create preview | Blank brief + satu role capacity 1; lima tahap; typography/token existing. | Browser/screenshot |
| UI-02 | Klik lanjut dengan data kosong | Inline required errors; focus field pertama; step tidak maju. | State test + browser |
| UI-03 | Isi brief, tambah role 2+2+1 | Total posisi 5, inisiator tidak dihitung; tidak ada max slots input. | Unit + browser |
| UI-04 | Tambah/hapus skill, tools, role tengah | Data item lain tetap, duplikasi chip dicegah, selection scopes tidak tercampur. | State + browser |
| UI-05 | Ubah capacity menjadi pecahan/21 atau total >20 | Error yang jelas; tidak dapat lanjut/publish. | Unit + browser |
| UI-06 | Pilih klien tanpa acknowledgement | Panel transparansi muncul, tahap tidak bisa lolos; pindah asal tidak menghapus jawaban. | State + browser |
| UI-07 | Pilih tanggal lalu kembali/reload | Hari tidak bergeser; urutan invalid ditolak; tanggal opsional diterima. | Unit + browser |
| UI-08 | Review → Ubah → kembali review | Seluruh nilai, total, tags, dan konteks mencerminkan perubahan. | State + browser |
| UI-09 | Simpan draft parsial dan reload | Draft lokal pulih pada akun/mode yang sama; info tersimpan lokal. | Storage test + browser |
| UI-10 | Publish lengkap, klik ganda | Satu proses; status lokal berubah; pesan simulasi; tidak ada HTTP project mutation. | State + Network |
| UI-11 | Edit fixture atau draft recovered | Form terisi, role ID stable, save mempertahankan status, tidak auto-publish. | State + browser |
| UI-12 | Edit role berisi anggota | Tidak bisa hapus atau capacity di bawah filled; data lain masih dapat diedit. | Unit + browser |
| UI-13 | Batal/leave sesudah perubahan | Popup guard; cancel tetap di form; sukses save mereset dirty baseline. | State + browser |
| UI-14 | Storage gagal / JSON rusak | Error/warning yang jelas, input tidak hilang, tidak ada toast sukses palsu. | Unit + browser |
| UI-15 | Akun atau slug berbeda | Tidak memulihkan draft akun/proyek lain; unknown edit tampil not-found preview. | Unit + browser |
| UI-16 | 360–1440 px, 200% zoom, keyboard | Form terbaca, controls accessible, overlay/footer tidak menutupi input, tanpa overflow horizontal. | Browser |
| UI-17 | Preview production / route live | Gate dummy tidak aktif pada production; jalur live tidak berubah menjadi fixture. | Gate test + build/browser |
| UI-18 | Email unverified / profile <50 fixture | State kelayakan tampil; publish blocked sesuai fixture; partial draft tetap bisa disimpan bila editor diizinkan. | State + browser |

## 14. Batas dan keputusan yang perlu dibawa ke tahap integrasi

Plan ini cukup untuk memulai implementasi UI setelah ditinjau. Tidak ada keputusan endpoint yang harus menghambat preview dummy.

Tahap integrasi berikutnya harus menyepakati penyimpanan origin/kolaborasi/jam/prinsip, status skill per role dibanding model tools existing, mapping kategori versus tipe legacy, batas validasi server, kebijakan edit role yang telah terisi, serta draft lokal versus draft server. Lakukan source/contract audit baru pada saat itu; jangan menggunakan snapshot historis sebagai kontrak yang dipastikan berlaku.

Kriteria selesai tahap ini adalah UI dummy dan acceptance di atas, dengan evidence terpisah untuk static check, unit/state tests, build/typecheck, dan browser. Rencana selesai disusun tidak berarti fitur sudah diimplementasikan.
