<template>
  <div class="k-root overflow-x-clip bg-white">
    <!-- Navbar -->
    <LandingNavbar />

    <!-- Hero Section (Landing Page Style) -->
    <section class="relative bg-primary-500 overflow-hidden pt-28 pb-24 lg:pt-36 lg:pb-32">
      <!-- Dot Texture -->
      <div
        class="k-dot-texture absolute inset-0 pointer-events-none opacity-[.06]"
        aria-hidden="true"
      ></div>

      <!-- Auroras & Ambient Glow -->
      <div
        class="absolute inset-0 pointer-events-none overflow-hidden"
        aria-hidden="true"
      >
        <div class="hidden lg:block k-aurora-1"></div>
        <div class="hidden lg:block k-aurora-2"></div>
        <div
          class="absolute -left-[10%] top-[20%] w-96 h-96 bg-primary-400/20 rounded-full blur-[80px] animate-float-strong"
        ></div>
        <div
          class="absolute right-[10%] bottom-[15%] w-80 h-80 bg-accent-400/15 rounded-full blur-[100px] animate-float-strong"
          style="animation-delay: -4s"
        ></div>
      </div>

      <!-- Animated Particle Canvas SVG -->
      <svg
        class="k-particles absolute inset-0 w-full h-full pointer-events-none"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle class="k-particle" cx="12%" cy="25%" r="2" fill="white" opacity="0.25" />
        <circle
          class="k-particle"
          cx="88%"
          cy="18%"
          r="1.5"
          fill="white"
          opacity="0.2"
          style="animation-delay: 1.2s"
        />
        <circle
          class="k-particle"
          cx="60%"
          cy="75%"
          r="2.5"
          fill="#FFB020"
          opacity="0.35"
          style="animation-delay: 2.4s"
        />
        <circle
          class="k-particle"
          cx="20%"
          cy="65%"
          r="1.5"
          fill="white"
          opacity="0.2"
          style="animation-delay: 0.8s"
        />
        <circle
          class="k-particle"
          cx="75%"
          cy="45%"
          r="1.5"
          fill="#FFB020"
          opacity="0.2"
          style="animation-delay: 3.5s"
        />
        <line
          class="k-particle-line"
          x1="12%"
          y1="25%"
          x2="20%"
          y2="65%"
          stroke="white"
          stroke-width="0.5"
          opacity="0.08"
        />
        <line
          class="k-particle-line"
          x1="60%"
          y1="75%"
          x2="75%"
          y2="45%"
          stroke="white"
          stroke-width="0.5"
          opacity="0.08"
        />
      </svg>

      <!-- Hero Header Content -->
      <div class="k-container relative z-10 w-full text-center max-w-4xl mx-auto">
        <!-- Eyebrow Badge -->
        <div
          class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 border border-white/25 mb-6 backdrop-blur-md shadow-sm"
        >
          <span class="w-2 h-2 rounded-full bg-accent-400 animate-pulse"></span>
          <span class="text-white/95 text-xs font-semibold tracking-wide">
            Pembaruan Terakhir: 1 Oktober 2026
          </span>
        </div>

        <!-- Main Title -->
        <h1 class="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.12] mb-6">
          Transparansi & Keamanan Data<br />
          <span class="text-accent-300">di Kolaboria</span>
        </h1>

        <!-- Subtitle -->
        <p class="text-white/80 font-paragraph-base max-w-2xl mx-auto text-base sm:text-lg leading-relaxed mb-10">
          Privasi Anda adalah fondasi ekosistem kami. Dokumen ini merinci bagaimana informasi Anda
          dikelola dengan aman, bertanggung jawab, dan tanpa kompromi.
        </p>

        <!-- Quick Highlights Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left max-w-3xl mx-auto">
          <div class="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 transition-all duration-300 hover:bg-white/15">
            <div class="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center mb-3">
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 class="text-white font-bold text-sm mb-1">Perlindungan Data Berlapis</h2>
            <p class="text-white/70 text-xs leading-relaxed">Koneksi dienkripsi dan akses data dibatasi.</p>
          </div>

          <div class="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 transition-all duration-300 hover:bg-white/15">
            <div class="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center mb-3">
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h2 class="text-white font-bold text-sm mb-1">Workspace Tetap Privat</h2>
            <p class="text-white/70 text-xs leading-relaxed">Percakapan dan dokumen workspace privat tidak tampil untuk umum.</p>
          </div>

          <div class="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 transition-all duration-300 hover:bg-white/15">
            <div class="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center mb-3">
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h2 class="text-white font-bold text-sm mb-1">Cookie Esensial</h2>
            <p class="text-white/70 text-xs leading-relaxed">Cookie menjaga sesi login dan membantu mencegah penyalahgunaan.</p>
          </div>
        </div>
      </div>

      <!-- Wave Bottom Transition (Smooth Curve into Content) -->
      <div
        class="absolute bottom-[-1px] left-0 right-0 overflow-hidden leading-none z-10 w-full h-[10vh] min-h-[70px]"
      >
        <svg
          class="k-wave k-wave-1 absolute bottom-0 w-[200%] h-full opacity-30 text-white fill-current"
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,60L48,56C96,52,192,44,288,52C384,60,480,84,576,88C672,92,768,76,864,68C960,60,1056,60,1152,64C1248,68,1344,76,1392,80L1440,84L1440,120L0,120Z"
          ></path>
          <path
            d="M1440,60L1488,56C1536,52,1632,44,1728,52C1824,60,1920,84,2016,88C2112,92,2208,76,2304,68C2400,60,2496,60,2592,64C2688,68,2784,76,2832,80L2880,84L2880,120L1440,120Z"
          ></path>
        </svg>

        <svg
          class="k-wave k-wave-2 absolute bottom-0 w-[200%] h-full opacity-60 text-white fill-current"
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,80L48,76C96,72,192,64,288,56C384,48,480,40,576,44C672,48,768,64,864,72C960,80,1056,80,1152,72C1248,64,1344,48,1392,40L1440,32L1440,120L0,120Z"
          ></path>
          <path
            d="M1440,80L1488,76C1536,72,1632,64,1728,56C1824,48,1920,40,2016,44C2112,48,2208,64,2304,72C2400,80,2496,80,2592,72C2688,64,2784,48,2832,40L2880,32L2880,120L1440,120Z"
          ></path>
        </svg>

        <svg
          class="k-wave k-wave-3 absolute bottom-0 w-[200%] h-full text-white fill-current"
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,96L48,88C96,80,192,64,288,66.7C384,69,480,91,576,96C672,101,768,85,864,74.7C960,64,1056,59,1152,61.3C1248,64,1344,75,1392,80L1440,85.3L1440,120L0,120Z"
          ></path>
          <path
            d="M1440,96L1488,88C1536,80,1632,64,1728,66.7C1824,69,1920,91,2016,96C2112,101,2208,85,2304,74.7C2400,64,2496,59,2592,61.3C2688,64,2784,75,2832,80L2880,85.3L2880,120L1440,120Z"
          ></path>
        </svg>
      </div>
    </section>

    <!-- Main Content Section -->
    <main class="py-16 lg:py-24 bg-white relative">
      <div class="k-container">
        <!-- Intro Notice -->
        <div class="mb-10 flex items-center gap-4 border-b border-black/[0.06] pb-6">
          <div class="flex items-center gap-2 text-xs text-secondary-400/80">
            <svg class="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Berlaku untuk semua pengguna Kolaboria</span>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-12 lg:gap-16 items-start">
          <!-- Sidebar Navigation (Desktop Sticky) -->
          <aside class="hidden lg:block lg:sticky lg:top-28 lg:self-start space-y-6">
            <div class="bg-neutral-50/80 border border-black/[0.06] rounded-2xl p-6 shadow-xs backdrop-blur-xs">
              <p class="k-eyebrow text-primary-500 mb-4 flex items-center gap-2">
                <svg class="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h7" />
                </svg>
                Daftar Isi
              </p>

              <nav class="space-y-1">
                <button
                  v-for="section in sections"
                  :key="section.id"
                  @click="scrollToSection(section.id)"
                  :class="[
                    'w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center justify-between group',
                    activeSection === section.id
                      ? 'bg-primary-50 text-primary-600 font-bold shadow-xs'
                      : 'text-secondary-400 hover:text-secondary-500 hover:bg-neutral-100/70'
                  ]"
                >
                  <span class="truncate">{{ section.title }}</span>
                  <svg
                    :class="[
                      'w-3.5 h-3.5 transition-transform duration-200',
                      activeSection === section.id
                        ? 'text-primary-500 translate-x-0'
                        : 'text-neutral-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5'
                    ]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </nav>
            </div>

            <!-- Quick Contact Box in Sidebar -->
            <div class="bg-secondary-500 rounded-2xl p-5 text-white relative overflow-hidden">
              <div class="k-dot-texture absolute inset-0 opacity-5 pointer-events-none"></div>
              <h4 class="font-bold text-sm text-white mb-2 relative z-10">Punya Pertanyaan?</h4>
              <p class="text-white/70 text-xs leading-relaxed mb-4 relative z-10">
                Hubungi tim privasi kami untuk permohonan data atau kendali akun Anda.
              </p>
              <a
                href="mailto:privacy@kolaboria.id"
                class="inline-flex items-center gap-1.5 text-xs font-bold text-accent-300 hover:text-accent-200 transition-colors relative z-10"
              >
                <span>privacy@kolaboria.id</span>
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            </div>
          </aside>

          <!-- Main Policy Content -->
          <div class="space-y-14">
            <!-- Section 1: Pendahuluan -->
            <section id="pendahuluan" class="scroll-mt-28">
              <div class="flex items-center gap-3 mb-4">
                <span class="w-8 h-8 rounded-lg bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-500 font-bold text-xs">
                  01
                </span>
                <h2 class="text-xl sm:text-2xl font-black text-secondary-500 tracking-tight">
                  Pendahuluan & Komitmen Privasi
                </h2>
              </div>
              <div class="prose prose-neutral max-w-none text-secondary-400 text-sm sm:text-base leading-relaxed space-y-4">
                <p>
                  Selamat datang di <strong>Kolaboria</strong>. Kolaboria adalah platform kolaborasi terbuka yang didirikan
                  untuk menghubungkan inisiator proyek dengan talenta digital berbakat di seluruh Indonesia.
                </p>
                <p>
                  Kami memahami bahwa data pribadi dan rekam jejak profesional Anda adalah hal yang sangat berharga.
                  Oleh karena itu, kami berkomitmen untuk melindungi privasi setiap pengguna dengan standar keamanan tinggi
                  serta prinsip keterbukaan yang transparan. Kebijakan Privasi ini menjelaskan jenis data apa yang kami
                  kumpulkan, bagaimana data tersebut diproses, serta hak kendali yang Anda miliki sepenuhnya.
                </p>
                <p>
                  Dengan mendaftar, mengakses, atau menggunakan layanan Kolaboria, Anda mengonfirmasi bahwa Anda telah
                  membaca, memahami, dan menyetujui praktik yang diuraikan dalam Kebijakan Privasi ini.
                </p>
              </div>
            </section>

            <div class="k-rule"></div>

            <!-- Section 2: Informasi yang Dikumpulkan -->
            <section id="informasi-dikumpulkan" class="scroll-mt-28">
              <div class="flex items-center gap-3 mb-4">
                <span class="w-8 h-8 rounded-lg bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-500 font-bold text-xs">
                  02
                </span>
                <h2 class="text-xl sm:text-2xl font-black text-secondary-500 tracking-tight">
                  Informasi yang Kami Kumpulkan
                </h2>
              </div>
              <div class="prose prose-neutral max-w-none text-secondary-400 text-sm sm:text-base leading-relaxed space-y-5">
                <p>
                  Kami hanya mengumpulkan data yang relevan dan dibutuhkan untuk menjalankan operasional platform kolaborasi
                  secara efektif. Informasi tersebut terbagi dalam beberapa kategori berikut:
                </p>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose mt-4">
                  <div class="bg-neutral-50 rounded-xl p-5 border border-black/[0.05]">
                    <div class="flex items-center gap-2 mb-2 font-bold text-secondary-500 text-sm">
                      <svg class="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Informasi Akun Dasar
                    </div>
                    <p class="text-secondary-400/80 text-xs leading-relaxed">
                      Nama lengkap, alamat email aktif, username unik, password terenkripsi, serta foto profil (avatar).
                    </p>
                  </div>

                  <div class="bg-neutral-50 rounded-xl p-5 border border-black/[0.05]">
                    <div class="flex items-center gap-2 mb-2 font-bold text-secondary-500 text-sm">
                      <svg class="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Profil & Portofolio
                    </div>
                    <p class="text-secondary-400/80 text-xs leading-relaxed">
                      Keahlian (skills), bio profesional, pengalaman proyek sebelumnya, serta tautan akun eksternal seperti GitHub, GitLab, atau LinkedIn.
                    </p>
                  </div>

                  <div class="bg-neutral-50 rounded-xl p-5 border border-black/[0.05]">
                    <div class="flex items-center gap-2 mb-2 font-bold text-secondary-500 text-sm">
                      <svg class="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      Aktivitas Kolaborasi
                    </div>
                    <p class="text-secondary-400/80 text-xs leading-relaxed">
                      Proyek yang diinisiasi, lamaran peran (applications), status tugas (tasks) dalam workspace, dan riwayat kontribusi tim.
                    </p>
                  </div>

                  <div class="bg-neutral-50 rounded-xl p-5 border border-black/[0.05]">
                    <div class="flex items-center gap-2 mb-2 font-bold text-secondary-500 text-sm">
                      <svg class="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Log Teknis & Keamanan
                    </div>
                    <p class="text-secondary-400/80 text-xs leading-relaxed">
                      Alamat IP, tipe peramban web, sistem operasi, stempel waktu akses, dan log error untuk diagnosis sistem.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <div class="k-rule"></div>

            <!-- Section 3: Penggunaan Informasi -->
            <section id="penggunaan-informasi" class="scroll-mt-28">
              <div class="flex items-center gap-3 mb-4">
                <span class="w-8 h-8 rounded-lg bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-500 font-bold text-xs">
                  03
                </span>
                <h2 class="text-xl sm:text-2xl font-black text-secondary-500 tracking-tight">
                  Bagaimana Kami Menggunakan Informasi Anda
                </h2>
              </div>
              <div class="prose prose-neutral max-w-none text-secondary-400 text-sm sm:text-base leading-relaxed space-y-4">
                <p>
                  Informasi yang dikumpulkan digunakan semata-mata untuk meningkatkan fungsionalitas dan kualitas ekosistem
                  kolaborasi Anda, termasuk:
                </p>

                <ul class="space-y-3 my-4">
                  <li class="flex items-start gap-3">
                    <span class="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <span><strong>Pencocokan Kolaborator Cerdas (Smart Matching):</strong> Membantu inisiator menemukan talenta dengan keahlian yang cocok dan membantu talenta menemukan proyek yang tepat.</span>
                  </li>
                  <li class="flex items-start gap-3">
                    <span class="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <span><strong>Manajemen Ruang Kerja (Workspace):</strong> Mengelola hak akses tim, status tugas di kanban board, dan pembagian tanggung jawab proyek.</span>
                  </li>
                  <li class="flex items-start gap-3">
                    <span class="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <span><strong>Validasi Portofolio Otomatis:</strong> Merekam riwayat kontribusi yang sukses selesai sebagai bukti kredibel di profil publik Anda.</span>
                  </li>
                  <li class="flex items-start gap-3">
                    <span class="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <span><strong>Komunikasi & Keamanan:</strong> Mengirimkan notifikasi penting terkait aktivitas tim, pembaruan keamanan, dan mencegah upaya peretasan atau spam.</span>
                  </li>
                </ul>
              </div>
            </section>

            <div class="k-rule"></div>

            <!-- Section 4: Visibilitas & Berbagi Data -->
            <section id="visibilitas-data" class="scroll-mt-28">
              <div class="flex items-center gap-3 mb-4">
                <span class="w-8 h-8 rounded-lg bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-500 font-bold text-xs">
                  04
                </span>
                <h2 class="text-xl sm:text-2xl font-black text-secondary-500 tracking-tight">
                  Visibilitas & Kebijakan Berbagi Data
                </h2>
              </div>
              <div class="prose prose-neutral max-w-none text-secondary-400 text-sm sm:text-base leading-relaxed space-y-4">
                <p>
                  Sebagai platform kolaborasi sosial profesional, beberapa aspek profil Anda sengaja didesain agar dapat diakses
                  oleh publik untuk membangun reputasi:
                </p>

                <!-- Crucial Guarantee Callout -->
                <div class="not-prose my-6 bg-gradient-to-r from-secondary-500 to-secondary-600 rounded-2xl p-6 text-white shadow-md">
                  <div class="flex items-start gap-4">
                    <div class="w-10 h-10 rounded-xl bg-accent-400/20 border border-accent-400/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg class="w-5 h-5 text-accent-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <div>
                      <h4 class="font-bold text-base text-white mb-1">Prinsip Tanpa Komersialisasi Data</h4>
                      <p class="text-white/80 text-xs sm:text-sm leading-relaxed">
                        Kolaboria <strong>tidak pernah menjual, menyewakan, atau memperdagangkan data pribadi Anda</strong> kepada pihak ketiga, broker data, atau jaringan pengiklan komersial manapun.
                      </p>
                    </div>
                  </div>
                </div>

                <h3 class="text-base font-bold text-secondary-500 mt-6 mb-2">Informasi Publik vs Privat:</h3>
                <ul class="space-y-2">
                  <li><strong>Informasi Terbuka (Publik):</strong> Nama lengkap, username, foto profil, deskripsi bio, daftar keahlian, dan riwayat proyek yang telah diselesaikan.</li>
                  <li><strong>Informasi Tertutup (Privat):</strong> Alamat email, kata sandi, log sistem internal, serta percakapan dan dokumen kerja di dalam private workspace tim proyek.</li>
                </ul>
              </div>
            </section>

            <div class="k-rule"></div>

            <!-- Section 5: Keamanan Data -->
            <section id="keamanan-data" class="scroll-mt-28">
              <div class="flex items-center gap-3 mb-4">
                <span class="w-8 h-8 rounded-lg bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-500 font-bold text-xs">
                  05
                </span>
                <h2 class="text-xl sm:text-2xl font-black text-secondary-500 tracking-tight">
                  Keamanan & Penyimpanan Data
                </h2>
              </div>
              <div class="prose prose-neutral max-w-none text-secondary-400 text-sm sm:text-base leading-relaxed space-y-4">
                <p>
                  Kami menerapkan pertahanan keamanan berlapis (*defense-in-depth*) untuk memastikan kerahasiaan dan integritas
                  data Anda terlindungi dari akses tanpa izin:
                </p>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 not-prose my-6">
                  <div class="p-5 rounded-2xl bg-neutral-50 border border-black/[0.06]">
                    <div class="w-8 h-8 rounded-lg bg-primary-50 text-primary-500 flex items-center justify-center mb-3">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <h4 class="font-bold text-sm text-secondary-500 mb-1">Enkripsi Data Transit</h4>
                    <p class="text-secondary-400/80 text-xs leading-relaxed">
                      Semua pertukaran data antara browser Anda dan server kami dienkripsi menggunakan protokol HTTPS / TLS 1.3.
                    </p>
                  </div>

                  <div class="p-5 rounded-2xl bg-neutral-50 border border-black/[0.06]">
                    <div class="w-8 h-8 rounded-lg bg-primary-50 text-primary-500 flex items-center justify-center mb-3">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M4 7v10c0 2 1 3 3 3h10c2 0 3-1 3-3V7c0-2-1-3-3-3H7C5 4 4 5 4 7zM9 9h6M9 13h6M9 17h4" />
                      </svg>
                    </div>
                    <h4 class="font-bold text-sm text-secondary-500 mb-1">Row Level Security (RLS)</h4>
                    <p class="text-secondary-400/80 text-xs leading-relaxed">
                      Basis data PostgreSQL kami memisahkan dan memvalidasi izin akses data pada level baris database secara ketat.
                    </p>
                  </div>

                  <div class="p-5 rounded-2xl bg-neutral-50 border border-black/[0.06]">
                    <div class="w-8 h-8 rounded-lg bg-primary-50 text-primary-500 flex items-center justify-center mb-3">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                      </svg>
                    </div>
                    <h4 class="font-bold text-sm text-secondary-500 mb-1">Otentikasi Kriptografis</h4>
                    <p class="text-secondary-400/80 text-xs leading-relaxed">
                      Kata sandi Anda disimpan menggunakan algoritma hash satu arah yang aman dan tidak dapat dibaca oleh staf Kolaboria.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <div class="k-rule"></div>

            <!-- Section 6: Hak & Kendali Pengguna -->
            <section id="hak-pengguna" class="scroll-mt-28">
              <div class="flex items-center gap-3 mb-4">
                <span class="w-8 h-8 rounded-lg bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-500 font-bold text-xs">
                  06
                </span>
                <h2 class="text-xl sm:text-2xl font-black text-secondary-500 tracking-tight">
                  Hak & Kendali Anda atas Data
                </h2>
              </div>
              <div class="prose prose-neutral max-w-none text-secondary-400 text-sm sm:text-base leading-relaxed space-y-4">
                <p>
                  Kami menghormati prinsip perlindungan data pribadi dan menjamin hak-hak berikut bagi setiap pengguna Kolaboria:
                </p>

                <div class="space-y-3 my-4">
                  <div class="flex items-start gap-3 p-4 rounded-xl border border-black/[0.05] bg-white">
                    <span class="w-6 h-6 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center flex-shrink-0 text-xs font-bold">A</span>
                    <div>
                      <h4 class="text-sm font-bold text-secondary-500">Hak Akses & Portabilitas</h4>
                      <p class="text-xs text-secondary-400/80 mt-0.5">Anda berhak melihat dan meminta salinan seluruh data profil yang tersimpan di akun Anda.</p>
                    </div>
                  </div>

                  <div class="flex items-start gap-3 p-4 rounded-xl border border-black/[0.05] bg-white">
                    <span class="w-6 h-6 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center flex-shrink-0 text-xs font-bold">B</span>
                    <div>
                      <h4 class="text-sm font-bold text-secondary-500">Hak Pembaruan & Koreksi</h4>
                      <p class="text-xs text-secondary-400/80 mt-0.5">Anda dapat memperbarui nama, bio, tautan keahlian, dan preferensi akun kapan saja melalui menu Pengaturan Profil.</p>
                    </div>
                  </div>

                  <div class="flex items-start gap-3 p-4 rounded-xl border border-black/[0.05] bg-white">
                    <span class="w-6 h-6 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center flex-shrink-0 text-xs font-bold">C</span>
                    <div>
                      <h4 class="text-sm font-bold text-secondary-500">Hak Penghapusan Akun (Right to Erasure)</h4>
                      <p class="text-xs text-secondary-400/80 mt-0.5">Anda berhak mengajukan penutupan akun permanen dan penghapusan seluruh data pribadi dari server aktif kami.</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <div class="k-rule"></div>

            <!-- Section 7: Cookie & Pelacak -->
            <section id="cookie-teknologi" class="scroll-mt-28">
              <div class="flex items-center gap-3 mb-4">
                <span class="w-8 h-8 rounded-lg bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-500 font-bold text-xs">
                  07
                </span>
                <h2 class="text-xl sm:text-2xl font-black text-secondary-500 tracking-tight">
                  Penggunaan Cookie & Teknologi Serupa
                </h2>
              </div>
              <div class="prose prose-neutral max-w-none text-secondary-400 text-sm sm:text-base leading-relaxed space-y-4">
                <p>
                  Kolaboria menggunakan cookie secara bertanggung jawab hanya untuk menjaga keandalan fungsionalitas aplikasi:
                </p>
                <ul class="space-y-2 list-disc pl-5">
                  <li><strong>Cookie Esensial:</strong> Diperlukan untuk menjaga sesi login aktif dan mencegah request forged (CSRF).</li>
                  <li><strong>Cookie Preferensi:</strong> Menyimpan preferensi navigasi atau tampilan lokal pada perangkat Anda.</li>
                  <li><strong>Analitik Performa:</strong> Metrik anonim untuk memantau waktu muat halaman dan mendeteksi bug tanpa melacak identitas lintas aplikasi.</li>
                </ul>
              </div>
            </section>

            <div class="k-rule"></div>

            <!-- Section 8: Hubungi Kami -->
            <section id="kontak-pembaruan" class="scroll-mt-28">
              <div class="flex items-center gap-3 mb-4">
                <span class="w-8 h-8 rounded-lg bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-500 font-bold text-xs">
                  08
                </span>
                <h2 class="text-xl sm:text-2xl font-black text-secondary-500 tracking-tight">
                  Pembaruan Kebijakan & Kontak Resmi
                </h2>
              </div>
              <div class="prose prose-neutral max-w-none text-secondary-400 text-sm sm:text-base leading-relaxed space-y-4">
                <p>
                  Kebijakan Privasi ini dapat diperbarui secara berkala mengikuti perkembangan fitur platform dan regulasi hukum
                  yang berlaku. Setiap perubahan substansial akan diumumkan melalui notifikasi pada platform atau email resmi kami.
                </p>

                <!-- Interactive Contact Card -->
                <div class="not-prose mt-8 bg-neutral-50 border border-black/[0.08] rounded-3xl p-8 hover:border-primary-400/40 transition-all duration-300">
                  <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                    <div>
                      <span class="k-eyebrow text-primary-500">Pertanyaan Privasi?</span>
                      <h4 class="text-xl font-bold text-secondary-500 mt-1 mb-2">
                        Tim Perlindungan Data Kolaboria Siap Membantu
                      </h4>
                      <p class="text-secondary-400 text-xs sm:text-sm max-w-md leading-relaxed">
                        Jika Anda ingin mengajukan pertanyaan, klarifikasi, atau permintaan penghapusan data, silakan hubungi kami secara langsung.
                      </p>
                    </div>

                    <a
                      href="mailto:privacy@kolaboria.id?subject=Pertanyaan%20Kebijakan%20Privasi%20Kolaboria"
                      class="flex-shrink-0"
                    >
                      <AtomicButton variant="primary" size="md">
                        Kirim Email ke Tim Privasi
                      </AtomicButton>
                    </a>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <LandingFooter />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

definePageMeta({ layout: false })

useHead({
  title: 'Kebijakan Privasi — Kolaboria',
  meta: [
    {
      name: 'description',
      content:
        'Kebijakan Privasi resmi Kolaboria. Ketahui komitmen transparansi, enkripsi, dan hak kendali data Anda di platform kolaborasi terbuka Indonesia.'
    }
  ]
})

const activeSection = ref('pendahuluan')

const sections = [
  { id: 'pendahuluan', title: '1. Pendahuluan' },
  { id: 'informasi-dikumpulkan', title: '2. Informasi Dikumpulkan' },
  { id: 'penggunaan-informasi', title: '3. Penggunaan Informasi' },
  { id: 'visibilitas-data', title: '4. Visibilitas & Berbagi' },
  { id: 'keamanan-data', title: '5. Keamanan Data' },
  { id: 'hak-pengguna', title: '6. Hak & Kendali Pengguna' },
  { id: 'cookie-teknologi', title: '7. Cookie & Analitik' },
  { id: 'kontak-pembaruan', title: '8. Pembaruan & Kontak' }
]

const scrollToSection = (id: string) => {
  activeSection.value = id
  const el = document.getElementById(id)
  if (!el) return
  window.scrollTo({
    top: el.getBoundingClientRect().top + window.scrollY - 100,
    behavior: 'smooth'
  })
}

// Scroll spy logic
const updateActiveSectionOnScroll = () => {
  const scrollPosition = window.scrollY + 140

  for (const section of sections) {
    const el = document.getElementById(section.id)
    if (el) {
      const top = el.offsetTop
      const height = el.offsetHeight
      if (scrollPosition >= top && scrollPosition < top + height) {
        activeSection.value = section.id
        break
      }
    }
  }
}

onMounted(() => {
  window.addEventListener('scroll', updateActiveSectionOnScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', updateActiveSectionOnScroll)
})
</script>

<style scoped>
html {
  scroll-behavior: smooth;
}

.k-container {
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
}
@media (min-width: 640px) {
  .k-container {
    padding-left: 2.5rem;
    padding-right: 2.5rem;
  }
}
@media (min-width: 1024px) {
  .k-container {
    padding-left: 4rem;
    padding-right: 4rem;
  }
}

.k-rule {
  height: 1px;
  background-color: rgba(0, 0, 0, 0.08);
}

.k-eyebrow {
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.k-dot-texture {
  background-image: radial-gradient(
    circle at 2px 2px,
    white 2px,
    transparent 0
  );
  background-size: 24px 24px;
}

.k-aurora-1 {
  position: absolute;
  top: -10%;
  left: -5%;
  width: 55%;
  height: 65%;
  background: radial-gradient(
    ellipse at center,
    rgba(255, 255, 255, 0.089) 0%,
    transparent 70%
  );
  animation: k-aurora-drift 12s ease-in-out infinite alternate;
  border-radius: 50%;
  filter: blur(48px);
}

.k-aurora-2 {
  position: absolute;
  bottom: 5%;
  right: -10%;
  width: 60%;
  height: 60%;
  background: radial-gradient(
    ellipse at center,
    rgba(28, 46, 74, 0.5) 0%,
    transparent 70%
  );
  animation: k-aurora-drift 16s ease-in-out infinite alternate-reverse;
  border-radius: 50%;
  filter: blur(56px);
}

@keyframes k-aurora-drift {
  0% {
    transform: translate(0px, 0px) scale(1);
  }
  50% {
    transform: translate(30px, -20px) scale(1.06);
  }
  100% {
    transform: translate(-15px, 15px) scale(0.97);
  }
}

.k-particle {
  animation: k-particle-float 7s ease-in-out infinite alternate;
}
@keyframes k-particle-float {
  0% {
    transform: translate(0, 0);
    opacity: 0.15;
  }
  50% {
    transform: translate(8px, -14px);
    opacity: 0.35;
  }
  100% {
    transform: translate(-4px, 4px);
    opacity: 0.15;
  }
}

.k-particle-line {
  animation: k-particle-pulse 5s ease-in-out infinite alternate;
}
@keyframes k-particle-pulse {
  0%,
  100% {
    opacity: 0.05;
  }
  50% {
    opacity: 0.15;
  }
}

.animate-float-strong {
  animation: float-strong 14s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}

@keyframes float-strong {
  0%,
  100% {
    transform: translate(0, 0) scale(1) rotate(0deg);
  }
  33% {
    transform: translate(30px, -40px) scale(1.05) rotate(5deg);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.95) rotate(-5deg);
  }
}

.k-wave {
  transform: translate3d(0, 0, 0);
}
.k-wave-1 {
  animation: k-wave-scroll 24s linear infinite;
}
.k-wave-2 {
  animation: k-wave-scroll 18s linear infinite reverse;
}
.k-wave-3 {
  animation: k-wave-scroll 12s linear infinite;
}
@keyframes k-wave-scroll {
  0% {
    transform: translateX(0) translateZ(0);
  }
  100% {
    transform: translateX(-50%) translateZ(0);
  }
}
</style>
