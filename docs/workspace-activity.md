# Workspace Activity

Halaman `/projects/:slug/workspace/activity` memakai endpoint `GET /v1/workspaces/:slug/activities` pada backend aktif. LocalStorage tidak digunakan untuk feed, identitas, count, atau permission Activity.

## Alur data

`activity.vue → useWorkspaceActivity → WorkspaceActivityService → endpoint activities`

`WorkspaceActivityView` hanya merender state controller. Layout memakai konteks proyek nyata melalui cache info bersama dan akun autentikasi; pemilih demo tidak ditampilkan untuk Activity. Overview dan area prototype lain mengikuti scope existing.

## State dan pemanggilan API

- Pagination standar, 50 item per halaman. Desktop memakai pagination; mobile memakai load more dengan deduplikasi ID.
- Cache Nuxt di memori terisolasi account/project/page/limit, TTL 15 detik, maksimal 20 halaman. Logout membersihkan cache dan revision markers.
- Pergantian akun/proyek membatalkan request dan menolak response terlambat.
- Mutation yang berhasil menandai feed proyek dirty, tanpa mengambil aktivitas ketika halaman tidak aktif.
- Pagination hanya mengambil aktivitas; tidak mengambil roster, board, diskusi atau info ulang.
- Initial load, refresh dan load more memiliki pending/error terpisah. Akses 401/404 membersihkan feed privat; kegagalan refresh biasa mempertahankan data terakhir dengan indikator stale.
- Mobile menyimpan maksimal satu window 500 item. Sesudah batas, tombol eksplisit membuka window aktivitas yang lebih lama. Pergantian breakpoint kembali ke halaman pertama untuk menghindari pencampuran halaman.
- Offset pagination pada feed aktif dapat bergeser; deduplikasi dan refresh ke halaman pertama digunakan. Tidak ada cursor atau jaminan snapshot lintas request.

Tanggal/jam memakai locale Indonesia dan zona browser sesudah mount, dengan atribut `datetime` sumber. Invalid timestamp tidak diberi label “Baru saja”. Loading menggunakan design system `MoleculeLoading`.

Tidak menambahkan deep link task sebelum route mendukung pembukaan modal berdasarkan ID. Timeline tetap read-only, tanpa raw evidence inspector, skor kontribusi, atau publikasi portfolio.

Pengujian controller terdapat pada `apps/client/tests/workspace-activity.test.mjs`; fixture diskusi diperbarui untuk Nuxt state. Test/build/typecheck belum dijalankan pada sesi ini sesuai preferensi pengguna.
