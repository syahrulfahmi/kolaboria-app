# Penutupan proyek di Info Workspace

- Card penutupan menggunakan `info.closure` dari API. Tidak membaca hitungan prototype/localStorage atau jumlah item pada kolom board yang sedang dipaginasi.
- Layout informasi dan kesiapan peran di kiri serta penutupan di kanan dipertahankan. Card dan modal dipisahkan agar view tetap ringkas.
- Klik **Tinjau penutupan** mengambil Info terbaru sebelum membuka modal. Hanya owner pada proyek berjalan dengan seluruh task memenuhi syarat mendapat aksi tersebut.
- Modal design system meminta ringkasan hasil; dasar review dan keterbatasan wajib untuk proyek tanpa task. Task dihapus dan task dikeluarkan dari scope tidak diklaim sebagai hasil selesai.
- Command mengirim versi proyek dan task yang ditinjau. Konflik tidak dikirim ulang otomatis: input dipertahankan, Info dimuat ulang, dan owner harus mengonfirmasi kembali. Kegagalan memuat ulang menonaktifkan konfirmasi serta menyediakan retry.
- Response command menjadi sumber keputusan/status completed. Cache Info diperbarui menggunakan fakta tersebut tanpa GET tambahan, request lama ditandai invalid, dan cache Activity ditandai usang. Task board pada kunjungan berikutnya membaca status serta izin server yang baru.
- Mutasi task menginvalidasi Info agar hitungan penutupan tidak memakai cache sebelum perubahan. Tidak menambah request Info pada setiap perubahan filter board.
- Pergantian proyek/akun dan unmount membatalkan penerapan response yang terlambat pada controller penutupan. Waktu penutupan memakai locale Indonesia dan zona waktu browser setelah mounted.
- Halaman Info tidak lagi menerima context prototype dari layout. Modal/toast prototype disembunyikan pada Info agar tidak mengganggu command nyata.
- Task board completed memberi keterangan hanya baca dan tautan kembali ke rincian penutupan. API tetap menegakkan larangan mutasi.

API dan migration baru harus tersedia untuk menggunakan alur penutupan proyek. Detail kontrak: `kolaboria-api/docs/workspace-project-completion.md`.

Kompatibilitas Info: response API lama tanpa `closure` atau `can_complete_project` tetap dapat menampilkan informasi proyek dan kesiapan peran. Mapper mempertahankan `closure: null`, card menampilkan data penutupan belum tersedia, dan aksi penutupan dinonaktifkan. Tidak membuat hitungan nol atau mengambil data localStorage sebagai pengganti. Kontrak penutupan yang disertakan tetap divalidasi konsistensinya; backend terbaru beserta migration diperlukan untuk mengaktifkan alur penutupan.

Pengujian controller mencakup fresh review, versi terbaru, hasil command, tanpa task, konflik, retry refresh gagal, larangan member, dan response lintas akun/proyek. Test/build/typecheck belum dijalankan sesuai preferensi sesi.
