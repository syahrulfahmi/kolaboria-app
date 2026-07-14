---
name: kolaboria-app-dev
description: Triggered when modifying or adding features to the Kolaboria frontend Vue/Nuxt client application.
---

# Kolaboria Frontend Development Guide & Agent Customization

Pedoman instruksi bagi agen kecerdasan buatan (AI agent) saat memodifikasi, memelihara, atau menambahkan fitur baru di dalam workspace **`kolaboria-app`**.

---

## 1. Indeks Dokumen Standarisasi Proyek

Sebelum mulai menulis kode, selalu rujuk dokumen standarisasi detail yang ada di `workspace/docs/` untuk pemahaman arsitektur penuh:

- 📂 **Gambaran Arsitektur Utama:** [TECHNICAL_GUIDELINE.md](/development/workspace/docs/frontend/TECHNICAL_GUIDELINE.md)
- 🎨 **Panduan Visual & CSS:** [STYLE_GUIDE.md](/development/workspace/docs/frontend/STYLE_GUIDE.md)
- 💻 **Konvensi Koding & Skala Fitur:** [CODING_CONVENTION.md](/development/workspace/docs/frontend/CODING_CONVENTION.md)
- ⚙️ **Standardisasi TypeScript:** [TYPESCRIPT_STANDARDIZATION.md](/development/workspace/docs/frontend/TYPESCRIPT_STANDARDIZATION.md)
- 🧪 **Pedoman Unit & E2E Testing:** [TESTING_GUIDELINE.md](/development/workspace/docs/frontend/TESTING_GUIDELINE.md)
- 💾 **State Global & Caching:** [STATE_CACHING_GUIDELINE.md](/development/workspace/docs/frontend/STATE_CACHING_GUIDELINE.md)
- 🌿 **Git Commit & Templat PR:** [GIT_WORKFLOW.md](/development/workspace/docs/common/GIT_WORKFLOW.md)
- 📌 **Lembar Contekan Singkat:** [QUICK_REFERENCE.md](/development/workspace/docs/frontend/QUICK_REFERENCE.md)

---

## 2. Aturan Komponen & Pola Desain (Atomic Design)

Aplikasi klien Nuxt menerapkan **Atomic Design** untuk penulisan komponen UI di dalam direktori `app/components/ui/`:

- **Atoms (`Atomic*`):** Komponen visual murni tanpa logika kompleks (contoh: `<AtomicButton>`, `<AtomicTag>`).
- **Molecules (`Molecule*`):** Gabungan dari beberapa atom yang memproses fungsionalitas input (contoh: `<MoleculeInputField>`, `<MoleculeSearchField>`, `<MoleculeDropdown>`, `<MoleculeTextarea>`).
- **Organisms (`Organism*`):** Blok modul UI kompleks (contoh: `<OrganismDrawer>`, `<OrganismModal>`).

_Wajib:_ Prioritaskan komponen di atas saat membuat form atau aksi visual lainnya. Jangan menulis tag HTML biasa jika alternatif komponen di atas sudah tersedia.

---

## 3. Pemisahan Tanggung Jawab & Caching API

- **Layer Services (`services/`):** Berisi logika panggilan API murni (pure TS). Selalu gunakan `$fetch`. Dilarang menyimpan state reaktif di layer ini.
- **Layer Composables (`composables/`):** Mengelola reaktivitas state (`ref`, `reactive`, `loading`, `error`).
  - _Caching:_ Selalu bungkus panggilan service di dalam composables menggunakan **`useAsyncData`** dengan cache key unik untuk pemuatan awal halaman SSR guna mencegah _double-fetching_.
- **Layer Views/Pages (`pages/`):** Hanya mengikat data reaktif dari composables ke visual render. Dilarang memanggil service secara langsung.

---

## 4. Standar Kode TypeScript (Strict Typing)

- **Larangan `any`:** Penggunaan tipe `any` dilarang keras. Gunakan interface resmi, `unknown`, atau generic parameter `<T>`.
- **Ketat pada Reaktivitas:** Tulis generic parameter secara eksplisit saat menginisialisasi `ref` untuk tipe non-primitif (contoh: `ref<Task | null>(null)`).
- **Casting Elemen DOM:** Penegasan tipe (`as`) hanya diizinkan untuk data murni DOM API (seperti `event.target as HTMLInputElement`).

---

## 5. Standar Styling & CSS (Tailwind CSS v4)

- **Variabel Warna `@theme`:** Gunakan warna semantik dari Tailwind v4 (`primary`, `secondary`, `accent`, `neutral`, `success`, `danger`). Dilarang keras menulis warna Hex manual.
- **Tipografi Semantik:** Gunakan kelas utility tipografi semantik yang ada di `main.css` (seperti `.font-body-2` untuk teks standar, `.font-title-2` untuk sub-judul, `.font-label-2` untuk button/tag) alih-alih merancang ukuran huruf manual.
- **Overrides Komponen:** Gunakan modifier `!` bawaan Tailwind (seperti `!px-4` atau `px-4!`) saat menimpa padding/gaya default komponen visual yang berada di dalam kontainer khusus.
