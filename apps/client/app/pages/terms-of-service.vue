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
          Syarat & Ketentuan Layanan<br />
          <span class="text-accent-300">di Kolaboria</span>
        </h1>

        <!-- Subtitle -->
        <p class="text-white/80 font-paragraph-base max-w-2xl mx-auto text-base sm:text-lg leading-relaxed mb-10">
          Pedoman dan kesepakatan bersama dalam membangun proyek nyata, menjaga etika profesional,
          dan menciptakan ekosistem kolaborasi terbuka yang sehat di Indonesia.
        </p>

        <!-- Quick Highlights Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left max-w-3xl mx-auto">
          <div class="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 transition-all duration-300 hover:bg-white/15">
            <div class="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center mb-3">
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h2 class="text-white font-bold text-sm mb-1">Kolaborasi Terbuka & Adil</h2>
            <p class="text-white/70 text-xs leading-relaxed">Peran terdefinisi transparan tanpa hierarki yang mengekang.</p>
          </div>

          <div class="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 transition-all duration-300 hover:bg-white/15">
            <div class="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center mb-3">
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <h2 class="text-white font-bold text-sm mb-1">Hak Cipta Tetap Milik Tim</h2>
            <p class="text-white/70 text-xs leading-relaxed">Kolaboria tidak mengklaim kepemilikan atas produk buatan Anda.</p>
          </div>

          <div class="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 transition-all duration-300 hover:bg-white/15">
            <div class="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center mb-3">
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 class="text-white font-bold text-sm mb-1">Etika & Akuntabilitas</h2>
            <p class="text-white/70 text-xs leading-relaxed">Komitmen saling menghargai waktu dan kontribusi sesama anggota.</p>
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
            <span>Berlaku efektif sejak 1 Oktober 2026 untuk seluruh inisiator proyek dan talenta Kolaboria</span>
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

            <!-- Quick Legal Box in Sidebar -->
            <div class="bg-secondary-500 rounded-2xl p-5 text-white relative overflow-hidden">
              <div class="k-dot-texture absolute inset-0 opacity-5 pointer-events-none"></div>
              <h4 class="font-bold text-sm text-white mb-2 relative z-10">Pertanyaan Ketentuan?</h4>
              <p class="text-white/70 text-xs leading-relaxed mb-4 relative z-10">
                Punya pertanyaan mengenai hak cipta proyek atau aturan kolaborasi? Hubungi tim legal kami.
              </p>
              <a
                href="mailto:legal@kolaboria.id"
                class="inline-flex items-center gap-1.5 text-xs font-bold text-accent-300 hover:text-accent-200 transition-colors relative z-10"
              >
                <span>legal@kolaboria.id</span>
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            </div>
          </aside>

          <!-- Main Policy Content -->
          <div class="space-y-14">
            <!-- Section 1: Penerimaan Ketentuan -->
            <section id="penerimaan-ketentuan" class="scroll-mt-28">
              <div class="flex items-center gap-3 mb-4">
                <span class="w-8 h-8 rounded-lg bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-500 font-bold text-xs">
                  01
                </span>
                <h2 class="text-xl sm:text-2xl font-black text-secondary-500 tracking-tight">
                  Penerimaan Ketentuan & Ruang Lingkup
                </h2>
              </div>
              <div class="prose prose-neutral max-w-none text-secondary-400 text-sm sm:text-base leading-relaxed space-y-4">
                <p>
                  Syarat & Ketentuan Layanan ini (*"Ketentuan"*) merupakan perjanjian yang sah dan mengikat secara hukum
                  antara Anda (*"Pengguna"*, baik bertindak sebagai Inisiator Proyek maupun Talenta/Kontributor) dan
                  <strong>Kolaboria</strong> (*"Kami"*).
                </p>
                <p>
                  Dengan mengakses situs web kami, membuat akun, menerbitkan proyek, atau mengajukan diri ke dalam proyek
                  di platform Kolaboria, Anda menyatakan telah membaca, memahami, dan menyetujui untuk terikat oleh
                  seluruh isi Ketentuan ini serta <NuxtLink to="/privacy-policy" class="text-primary-600 hover:underline font-semibold">Kebijakan Privasi</NuxtLink> kami.
                </p>
                <p>
                  Jika Anda tidak menyetujui salah satu bagian dari Ketentuan ini, Anda tidak diperkenankan untuk mengakses
                  atau menggunakan layanan Kolaboria.
                </p>
              </div>
            </section>

            <div class="k-rule"></div>

            <!-- Section 2: Kelayakan & Akun -->
            <section id="kelayakan-akun" class="scroll-mt-28">
              <div class="flex items-center gap-3 mb-4">
                <span class="w-8 h-8 rounded-lg bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-500 font-bold text-xs">
                  02
                </span>
                <h2 class="text-xl sm:text-2xl font-black text-secondary-500 tracking-tight">
                  Kelayakan Pengguna & Keamanan Akun
                </h2>
              </div>
              <div class="prose prose-neutral max-w-none text-secondary-400 text-sm sm:text-base leading-relaxed space-y-4">
                <p>
                  Untuk menggunakan layanan Kolaboria, Anda wajib memenuhi persyaratan kelayakan sebagai berikut:
                </p>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose my-5">
                  <div class="bg-neutral-50 rounded-xl p-5 border border-black/[0.05]">
                    <div class="flex items-center gap-2 mb-2 font-bold text-secondary-500 text-sm">
                      <svg class="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Kredibilitas Identitas
                    </div>
                    <p class="text-secondary-400/80 text-xs leading-relaxed">
                      Anda wajib memberikan informasi profil, keahlian, dan riwayat yang jujur dan dapat dipertanggungjawabkan tanpa manipulasi.
                    </p>
                  </div>

                  <div class="bg-neutral-50 rounded-xl p-5 border border-black/[0.05]">
                    <div class="flex items-center gap-2 mb-2 font-bold text-secondary-500 text-sm">
                      <svg class="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      Tanggung Jawab Kredensial
                    </div>
                    <p class="text-secondary-400/80 text-xs leading-relaxed">
                      Anda bertanggung jawab penuh menjaga kerahasiaan kata sandi akun Anda dan atas semua tindakan yang terjadi di bawah akun tersebut.
                    </p>
                  </div>
                </div>

                <p>
                  Pembuatan akun palsu (impersonation), akun robotik tanpa izin, atau penjualan kembali akun Kolaboria
                  dilarang keras dan akan berakibat pada penutupan akun permanen.
                </p>
              </div>
            </section>

            <div class="k-rule"></div>

            <!-- Section 3: Peran & Etika Kolaborasi -->
            <section id="peran-etika" class="scroll-mt-28">
              <div class="flex items-center gap-3 mb-4">
                <span class="w-8 h-8 rounded-lg bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-500 font-bold text-xs">
                  03
                </span>
                <h2 class="text-xl sm:text-2xl font-black text-secondary-500 tracking-tight">
                  Peran Pengguna & Etika Kolaborasi
                </h2>
              </div>
              <div class="prose prose-neutral max-w-none text-secondary-400 text-sm sm:text-base leading-relaxed space-y-4">
                <p>
                  Kolaboria adalah wadah kolaborasi independen. Hubungan antara Inisiator Proyek dan Talenta/Kontributor
                  adalah hubungan kemitraan profesional, bukan hubungan ketenagakerjaan atau majikan-pekerja dengan Kolaboria:
                </p>

                <ul class="space-y-3 my-4">
                  <li class="flex items-start gap-3">
                    <span class="w-5 h-5 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <span><strong>Kewajiban Inisiator Proyek:</strong> Menyediakan gambaran visi proyek yang jelas, menetapkan kriteria role dan ekspektasi beban kerja secara realistis, serta memberikan feedback objektif dan tepat waktu kepada kontributor tim.</span>
                  </li>
                  <li class="flex items-start gap-3">
                    <span class="w-5 h-5 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <span><strong>Komitmen Talenta / Kontributor:</strong> Melaksanakan tugas dan deliverable sesuai kesepakatan tim, menghormati roadmap milestone, dan segera mengomunikasikan kendala jika terjadi hambatan kerja.</span>
                  </li>
                  <li class="flex items-start gap-3">
                    <span class="w-5 h-5 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <span><strong>Pengunduran Diri yang Bertanggung Jawab:</strong> Jika anggota tim berhalangan melanjutkan kolaborasi, wajib menyampaikan pemberitahuan transparan agar tim proyek dapat menyesuaikan slot kontributor tanpa merugikan progres.</span>
                  </li>
                </ul>
              </div>
            </section>

            <div class="k-rule"></div>

            <!-- Section 4: HAKI & Kepemilikan Karya -->
            <section id="hak-kekayaan-intelektual" class="scroll-mt-28">
              <div class="flex items-center gap-3 mb-4">
                <span class="w-8 h-8 rounded-lg bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-500 font-bold text-xs">
                  04
                </span>
                <h2 class="text-xl sm:text-2xl font-black text-secondary-500 tracking-tight">
                  Kepemilikan Hak Kekayaan Intelektual (HAKI)
                </h2>
              </div>
              <div class="prose prose-neutral max-w-none text-secondary-400 text-sm sm:text-base leading-relaxed space-y-4">
                <p>
                  Prinsip kami mengenai hak kekayaan intelektual dirancang untuk melindungi pencipta karya dan menjunjung
                  semangat kolaborasi terbuka:
                </p>

                <!-- Big Guarantee Callout Card -->
                <div class="not-prose my-6 bg-gradient-to-r from-secondary-500 to-secondary-600 rounded-2xl p-6 text-white shadow-md">
                  <div class="flex items-start gap-4">
                    <div class="w-10 h-10 rounded-xl bg-accent-400/20 border border-accent-400/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg class="w-5 h-5 text-accent-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                    </div>
                    <div>
                      <h4 class="font-bold text-base text-white mb-1">Produk Anda adalah Milik Tim Anda</h4>
                      <p class="text-white/80 text-xs sm:text-sm leading-relaxed">
                        Kolaboria <strong>tidak mengklaim kepemilikan hak cipta atas kode program, desain, atau produk digital</strong> yang Anda ciptakan dalam proyek. Seluruh hak cipta diatur sepenuhnya oleh kesepakatan internal antara Inisiator dan Kontributor masing-masing.
                      </p>
                    </div>
                  </div>
                </div>

                <div class="space-y-3">
                  <p><strong>1. Lisensi Proyek:</strong> Inisiator dan tim disarankan untuk menentukan lisensi proyek sejak awal (misalnya lisensi open-source seperti MIT, Apache 2.0, GPL, atau perjanjian kepemilikan bersama proprietary).</p>
                  <p><strong>2. Hak Pamer Portofolio (Showcase Rights):</strong> Setiap kontributor berhak menampilkan keterlibatannya, cuplikan karya yang telah disetujui, dan verifikasi kontribusi proyek pada portofolio profil publik Kolaboria mereka sebagai bukti keahlian nyata.</p>
                  <p><strong>3. Kekayaan Intelektual Kolaboria:</strong> Segala merek dagang, logo Kolaboria, desain antarmuka, dan kode inti platform Kolaboria adalah milik eksklusif Kolaboria dan dilindungi oleh undang-undang hak cipta Republik Indonesia.</p>
                </div>
              </div>
            </section>

            <div class="k-rule"></div>

            <!-- Section 5: Perilaku Terlarang -->
            <section id="aktivitas-terlarang" class="scroll-mt-28">
              <div class="flex items-center gap-3 mb-4">
                <span class="w-8 h-8 rounded-lg bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-500 font-bold text-xs">
                  05
                </span>
                <h2 class="text-xl sm:text-2xl font-black text-secondary-500 tracking-tight">
                  Aktivitas & Perilaku yang Dilarang
                </h2>
              </div>
              <div class="prose prose-neutral max-w-none text-secondary-400 text-sm sm:text-base leading-relaxed space-y-4">
                <p>
                  Untuk memastikan ekosistem Kolaboria tetap aman, suportif, dan profesional, pengguna dilarang keras untuk:
                </p>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose my-5">
                  <div class="p-4 rounded-xl border border-red-100 bg-red-50/50">
                    <h4 class="font-bold text-xs text-red-700 uppercase tracking-wider mb-1">Pelecehan & Diskriminasi</h4>
                    <p class="text-secondary-400 text-xs leading-relaxed">
                      Melakukan ujaran kebencian, perundungan, intimidasi, pelecehan seksual, atau diskriminasi berbasis SARA dalam bentuk apapun.
                    </p>
                  </div>

                  <div class="p-4 rounded-xl border border-red-100 bg-red-50/50">
                    <h4 class="font-bold text-xs text-red-700 uppercase tracking-wider mb-1">Penipuan & Proyek Palsu</h4>
                    <p class="text-secondary-400 text-xs leading-relaxed">
                      Membuat proyek fiktif untuk mengelabui talenta, mencuri data karya tanpa atribusi, atau melakukan skema penipuan finansial.
                    </p>
                  </div>

                  <div class="p-4 rounded-xl border border-red-100 bg-red-50/50">
                    <h4 class="font-bold text-xs text-red-700 uppercase tracking-wider mb-1">Eksploitasi & Malware</h4>
                    <p class="text-secondary-400 text-xs leading-relaxed">
                      Menyebarkan perangkat lunak berbahaya, virus, trojan, phishing link, atau berupaya membobol infrastruktur sistem Kolaboria.
                    </p>
                  </div>

                  <div class="p-4 rounded-xl border border-red-100 bg-red-50/50">
                    <h4 class="font-bold text-xs text-red-700 uppercase tracking-wider mb-1">Scraping & Spam</h4>
                    <p class="text-secondary-400 text-xs leading-relaxed">
                      Mengumpulkan data pengguna lain secara massal tanpa izin atau mengirimkan pesan promosi/spam secara agresif di platform.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <div class="k-rule"></div>

            <!-- Section 6: Workspace & Milestone -->
            <section id="workspace-milestone" class="scroll-mt-28">
              <div class="flex items-center gap-3 mb-4">
                <span class="w-8 h-8 rounded-lg bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-500 font-bold text-xs">
                  06
                </span>
                <h2 class="text-xl sm:text-2xl font-black text-secondary-500 tracking-tight">
                  Ruang Kerja (Workspace) & Kolaborasi Tim
                </h2>
              </div>
              <div class="prose prose-neutral max-w-none text-secondary-400 text-sm sm:text-base leading-relaxed space-y-4">
                <p>
                  Fitur Workspace disediakan sebagai sarana teknis untuk mendukung eksekusi proyek:
                </p>
                <ul class="space-y-2 list-disc pl-5">
                  <li><strong>Kerahasiaan Internal:</strong> Dokumen tugas, lampiran, dan diskusi di dalam Workspace privat hanya dapat diakses oleh anggota tim yang telah diterima dalam proyek bersangkutan.</li>
                  <li><strong>Verifikasi Kontribusi:</strong> Tugas dan kontribusi yang ditandai selesai (*completed*) akan menjadi dasar validasi portofolio anggota tim yang terintegrasi secara otomatis ke profil.</li>
                  <li><strong>Penyelesaian Perselisihan:</strong> Jika timbul perbedaan pendapat mengenai arah teknis atau pengerjaan tugas, tim diharapkan menyelesaikannya secara musyawarah profesional di ruang diskusi.</li>
                </ul>
              </div>
            </section>

            <div class="k-rule"></div>

            <!-- Section 7: Batasan Tanggung Jawab -->
            <section id="batasan-tanggung-jawab" class="scroll-mt-28">
              <div class="flex items-center gap-3 mb-4">
                <span class="w-8 h-8 rounded-lg bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-500 font-bold text-xs">
                  07
                </span>
                <h2 class="text-xl sm:text-2xl font-black text-secondary-500 tracking-tight">
                  Batasan Tanggung Jawab & Penolakan Jaminan
                </h2>
              </div>
              <div class="prose prose-neutral max-w-none text-secondary-400 text-sm sm:text-base leading-relaxed space-y-4">
                <p>
                  Layanan platform Kolaboria disediakan atas dasar <strong>"sebagaimana adanya" (*as-is*)</strong> dan
                  <strong>"sebagaimana tersedia" (*as-available*)</strong>.
                </p>
                <p>
                  Sejauh diizinkan oleh hukum yang berlaku di Indonesia, Kolaboria tidak bertanggung jawab atas:
                </p>
                <ul class="space-y-2 list-disc pl-5">
                  <li>Kegagalan kelanjutan proyek yang disebabkan oleh pengunduran diri salah satu pihak anggota tim.</li>
                  <li>Sengketa pembagian kepemilikan bisnis, kompensasi ekuitas, atau keuntungan komersial di luar platform.</li>
                  <li>Kehilangan data atau kerugian tidak langsung yang timbul akibat gangguan jaringan internet pihak ketiga atau kelalaian pengguna.</li>
                </ul>
              </div>
            </section>

            <div class="k-rule"></div>

            <!-- Section 8: Pengakhiran & Hukum -->
            <section id="pengakhiran-hukum" class="scroll-mt-28">
              <div class="flex items-center gap-3 mb-4">
                <span class="w-8 h-8 rounded-lg bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-500 font-bold text-xs">
                  08
                </span>
                <h2 class="text-xl sm:text-2xl font-black text-secondary-500 tracking-tight">
                  Pengakhiran Akun, Hukum & Kontak
                </h2>
              </div>
              <div class="prose prose-neutral max-w-none text-secondary-400 text-sm sm:text-base leading-relaxed space-y-4">
                <p>
                  Ketentuan ini tunduk pada hukum dan peraturan perundang-undangan yang berlaku di <strong>Republik Indonesia</strong>.
                </p>
                <p>
                  Kolaboria berhak untuk menangguhkan atau menghentikan akses akun Anda sewaktu-waktu apabila ditemukan
                  pelanggaran berat terhadap Ketentuan ini. Anda juga berhak menghapus akun Anda kapan saja melalui menu pengaturan.
                </p>

                <!-- Interactive Contact Card -->
                <div class="not-prose mt-8 bg-neutral-50 border border-black/[0.08] rounded-3xl p-8 hover:border-primary-400/40 transition-all duration-300">
                  <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                    <div>
                      <span class="k-eyebrow text-primary-500">Pusat Layanan Hukum</span>
                      <h4 class="text-xl font-bold text-secondary-500 mt-1 mb-2">
                        Ada Hal yang Ingin Anda Tanyakan?
                      </h4>
                      <p class="text-secondary-400 text-xs sm:text-sm max-w-md leading-relaxed">
                        Tim kepatuhan dan legal Kolaboria siap memberikan klarifikasi terkait hak cipta, lisensi karya, atau ketentuan kerja sama.
                      </p>
                    </div>

                    <a
                      href="mailto:legal@kolaboria.id?subject=Pertanyaan%20Ketentuan%20Layanan%20Kolaboria"
                      class="flex-shrink-0"
                    >
                      <AtomicButton variant="primary" size="md">
                        Hubungi Tim Legal
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
  title: 'Syarat & Ketentuan Layanan — Kolaboria',
  meta: [
    {
      name: 'description',
      content:
        'Syarat dan Ketentuan Layanan resmi Kolaboria. Panduan hak cipta proyek, etika kolaborasi independen, dan aturan ekosistem kerja sama terbuka di Indonesia.'
    }
  ]
})

const activeSection = ref('penerimaan-ketentuan')

const sections = [
  { id: 'penerimaan-ketentuan', title: '1. Penerimaan Ketentuan' },
  { id: 'kelayakan-akun', title: '2. Kelayakan & Akun' },
  { id: 'peran-etika', title: '3. Peran & Etika Kolaborasi' },
  { id: 'hak-kekayaan-intelektual', title: '4. Hak Cipta & HAKI' },
  { id: 'aktivitas-terlarang', title: '5. Aktivitas Terlarang' },
  { id: 'workspace-milestone', title: '6. Workspace & Milestone' },
  { id: 'batasan-tanggung-jawab', title: '7. Batasan Tanggung Jawab' },
  { id: 'pengakhiran-hukum', title: '8. Pengakhiran & Hukum' }
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
