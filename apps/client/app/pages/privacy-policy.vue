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
          fill="var(--color-accent-400, #ffb020)"
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
          fill="var(--color-accent-400, #ffb020)"
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
          class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 border border-primary-200/30 mb-6 backdrop-blur-md shadow-sm"
        >
          <span class="w-2 h-2 rounded-full bg-accent-400 animate-pulse"></span>
          <span class="font-label-2 text-primary-50 tracking-wide">
            Pembaruan Terakhir: 2 Oktober 2026 | Sesuai Standar Google API &amp; Privasi Global
          </span>
        </div>

        <!-- Main Title -->
        <h1 class="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.12] mb-6">
          Kebijakan Privasi<br />
          <span class="text-accent-300">Kolaboria</span>
        </h1>

        <!-- Subtitle -->
        <p class="font-paragraph-1 text-primary-100 max-w-2xl mx-auto mb-10">
          Transparansi, kedaulatan data, dan keamanan adalah fondasi ekosistem kami. Dokumen ini merinci secara terbuka bagaimana informasi Anda dikumpulkan, digunakan, dilindungi, dan dikelola secara bertanggung jawab.
        </p>

        <!-- Quick Highlights Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left max-w-4xl mx-auto">
          <div class="bg-white/10 backdrop-blur-md border border-primary-200/20 rounded-2xl p-4 transition-all duration-300 hover:bg-white/15">
            <div class="w-8 h-8 rounded-lg bg-primary-400/30 text-white flex items-center justify-center mb-3">
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 class="font-title-3 text-white mb-1">Enkripsi &amp; Keamanan TLS</h3>
            <p class="font-paragraph-4 text-primary-100">Koneksi aman TLS 1.3, hashing bcrypt, dan proteksi database level baris (RLS).</p>
          </div>

          <div class="bg-white/10 backdrop-blur-md border border-primary-200/20 rounded-2xl p-4 transition-all duration-300 hover:bg-white/15">
            <div class="w-8 h-8 rounded-lg bg-primary-400/30 text-white flex items-center justify-center mb-3">
              <svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
            </div>
            <h3 class="font-title-3 text-white mb-1">Kepatuhan Google OAuth</h3>
            <p class="font-paragraph-4 text-primary-100">Patuhi Kebijakan Data Pengguna Layanan Google API &amp; Persyaratan Penggunaan Terbatas.</p>
          </div>

          <div class="bg-white/10 backdrop-blur-md border border-primary-200/20 rounded-2xl p-4 transition-all duration-300 hover:bg-white/15">
            <div class="w-8 h-8 rounded-lg bg-primary-400/30 text-white flex items-center justify-center mb-3">
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 class="font-title-3 text-white mb-1">Workspace Tetap Privat</h3>
            <p class="font-paragraph-4 text-primary-100">Karya, berkas, dan percakapan internal hanya diakses oleh anggota tim proyek.</p>
          </div>

          <div class="bg-white/10 backdrop-blur-md border border-primary-200/20 rounded-2xl p-4 transition-all duration-300 hover:bg-white/15">
            <div class="w-8 h-8 rounded-lg bg-primary-400/30 text-white flex items-center justify-center mb-3">
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h3 class="font-title-3 text-white mb-1">Hak Hapus Data Kapan Saja</h3>
            <p class="font-paragraph-4 text-primary-100">Pengguna memiliki hak penuh untuk meminta penghapusan akun dan data secara permanen.</p>
          </div>
        </div>
      </div>

      <!-- Wave Bottom Transition -->
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
        <!-- Intro Notice Banner -->
        <div class="mb-10 flex flex-wrap items-center justify-between gap-4 border-b border-neutral-200 pb-6">
          <div class="flex items-center gap-2 font-paragraph-3 text-neutral-600 font-medium">
            <svg class="w-4 h-4 text-success-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Berlaku untuk seluruh layanan aplikasi web <strong class="text-secondary-900 font-semibold">Kolaboria</strong> (Domain: <code class="font-mono text-xs bg-neutral-100 text-secondary-900 px-1.5 py-0.5 rounded border border-neutral-200">kolaboria.com</code> &amp; <code class="font-mono text-xs bg-neutral-100 text-secondary-900 px-1.5 py-0.5 rounded border border-neutral-200">dev.kolaboria.com</code>)</span>
          </div>
          <div class="font-body-3 text-neutral-500">
            Versi Kebijakan: 2.1 (Terverifikasi OAuth)
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-12 lg:gap-16 items-start">
          <!-- Sidebar Navigation (Desktop Sticky) -->
          <aside class="hidden lg:block lg:sticky lg:top-28 lg:self-start space-y-6">
            <div class="bg-neutral-50 border border-neutral-200 rounded-2xl p-6 shadow-xs backdrop-blur-xs">
              <p class="k-eyebrow text-primary-600 mb-4 flex items-center gap-2">
                <svg class="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
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
                    'w-full text-left px-3 py-2 rounded-lg font-label-2 transition-all duration-200 flex items-center justify-between group',
                    activeSection === section.id
                      ? 'bg-primary-50 text-primary-600 font-bold shadow-xs border border-primary-200'
                      : 'text-neutral-600 hover:text-secondary-900 hover:bg-neutral-100'
                  ]"
                >
                  <span class="truncate">{{ section.title }}</span>
                  <svg
                    :class="[
                      'w-3.5 h-3.5 transition-transform duration-200 flex-shrink-0',
                      activeSection === section.id
                        ? 'text-primary-600 translate-x-0'
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

            <!-- Google Security Revocation Quick Card -->
            <div class="bg-neutral-50 border border-neutral-200 rounded-2xl p-5 shadow-xs">
              <div class="flex items-center gap-2 mb-2">
                <svg class="w-4 h-4 text-secondary-900" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                <h4 class="font-label-1 text-secondary-900">Izin Akun Google</h4>
              </div>
              <p class="font-paragraph-4 text-neutral-600 mb-3">
                Anda dapat meninjau atau mencabut izin akses Kolaboria kapan saja dari akun Google Anda.
              </p>
              <a
                href="https://myaccount.google.com/permissions"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-1 font-label-2 text-primary-600 hover:text-primary-700 transition-colors"
              >
                <span>Kelola Izin di Google</span>
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>

            <!-- Quick Contact Box in Sidebar -->
            <div class="bg-secondary-500 rounded-2xl p-5 text-white relative overflow-hidden">
              <div class="k-dot-texture absolute inset-0 opacity-5 pointer-events-none"></div>
              <h4 class="font-title-3 text-white mb-2 relative z-10">Pusat Bantuan Privasi</h4>
              <p class="font-paragraph-4 text-secondary-100 mb-4 relative z-10">
                Punya pertanyaan mengenai data Anda atau ingin mengajukan penghapusan akun permanen?
              </p>
              <a
                href="mailto:privacy@kolaboria.id"
                class="inline-flex items-center gap-1.5 font-label-2 text-accent-300 hover:text-accent-200 transition-colors relative z-10"
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
            <!-- Section 1: Pendahuluan & Identitas Aplikasi -->
            <section id="pendahuluan" class="scroll-mt-28">
              <div class="flex items-center gap-3 mb-4">
                <span class="w-8 h-8 rounded-lg bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-600 font-label-2">
                  01
                </span>
                <h2 class="font-title-1 text-secondary-900 tracking-tight">
                  Pendahuluan &amp; Identitas Aplikasi
                </h2>
              </div>
              <div class="font-paragraph-2 text-neutral-600 space-y-4">
                <p>
                  Selamat datang di <strong class="text-secondary-900 font-semibold">Kolaboria</strong>. Kebijakan Privasi ini mengatur bagaimana platform web
                  <strong class="text-secondary-900 font-semibold">Kolaboria</strong> (&quot;kami&quot;, &quot;aplikasi&quot;, atau &quot;Kolaboria&quot;), yang dapat diakses melalui
                  domain resmi <a href="https://kolaboria.com" target="_blank" rel="noopener noreferrer" class="text-primary-600 underline font-semibold hover:text-primary-700 transition-colors">https://kolaboria.com</a>
                  dan lingkungan pengembangannya di <a href="https://dev.kolaboria.com" target="_blank" rel="noopener noreferrer" class="text-primary-600 underline font-semibold hover:text-primary-700 transition-colors">https://dev.kolaboria.com</a>,
                  mengumpulkan, memproses, menyimpan, dan melindungi data pribadi Anda.
                </p>
                <p>
                  <strong class="text-secondary-900 font-semibold">Kolaboria</strong> adalah platform kolaborasi digital terbuka yang dirancang untuk menghubungkan inisiator proyek
                  dengan talenta digital berbakat (seperti desainer, pengembang perangkat lunak, dan manajer produk) guna mewujudkan proyek nyata secara transparan dan terstruktur.
                </p>
                <p>
                  Kami berkomitmen penuh untuk menjunjung tinggi privasi setiap pengguna, mematuhi regulasi perlindungan data yang berlaku (termasuk Undang-Undang Perlindungan Data Pribadi / UU PDP di Indonesia), serta mematuhi secara ketat <strong class="text-secondary-900 font-semibold">Kebijakan Data Pengguna Layanan API Google (Google API Services User Data Policy)</strong> termasuk Persyaratan Penggunaan Terbatas (Limited Use requirements).
                </p>
                <p>
                  Dengan mendaftar, mengakses, atau masuk ke layanan Kolaboria (baik melalui pendaftaran email maupun autentikasi Google Sign-In), Anda mengonfirmasi bahwa Anda telah membaca, memahami, dan menyetujui praktik yang diuraikan dalam Kebijakan Privasi ini.
                </p>
              </div>
            </section>

            <div class="k-rule"></div>

            <!-- Section 2: Informasi yang Dikumpulkan -->
            <section id="informasi-dikumpulkan" class="scroll-mt-28">
              <div class="flex items-center gap-3 mb-4">
                <span class="w-8 h-8 rounded-lg bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-600 font-label-2">
                  02
                </span>
                <h2 class="font-title-1 text-secondary-900 tracking-tight">
                  Informasi yang Kami Kumpulkan
                </h2>
              </div>
              <div class="space-y-5">
                <p class="font-paragraph-2 text-neutral-600">
                  Kami hanya mengumpulkan data yang relevan, memadai, dan terbatas pada apa yang benar-benar diperlukan untuk menyediakan fungsionalitas inti aplikasi Kolaboria bagi Anda. Informasi yang kami kumpulkan mencakup:
                </p>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <!-- Card 1: Google OAuth Data -->
                  <div class="bg-primary-50/60 rounded-xl p-5 border border-primary-200 shadow-xs">
                    <div class="flex items-center gap-2 mb-2 font-title-3 text-secondary-900">
                      <svg class="w-4 h-4 text-primary-600 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                      </svg>
                      <span>Data dari Akun Google (Google OAuth)</span>
                    </div>
                    <p class="font-paragraph-3 text-neutral-600 mb-2">
                      Saat Anda memilih fitur <strong class="text-secondary-900 font-semibold">&quot;Masuk dengan Google&quot;</strong>, aplikasi kami mengakses data profil dasar publik yang diberikan oleh Google melalui protokol OAuth 2.0:
                    </p>
                    <ul class="font-paragraph-4 text-neutral-600 space-y-1.5 list-disc pl-4">
                      <li><strong class="text-secondary-900 font-semibold">Pengenal Pengguna Unik Google (Google User ID / <code class="font-mono text-xs bg-neutral-100 text-secondary-900 px-1 rounded">sub</code>)</strong>: Digunakan untuk mengaitkan akun Anda secara persisten.</li>
                      <li><strong class="text-secondary-900 font-semibold">Alamat Email (<code class="font-mono text-xs bg-neutral-100 text-secondary-900 px-1 rounded">email</code>)</strong> &amp; status verifikasi email.</li>
                      <li><strong class="text-secondary-900 font-semibold">Nama Lengkap (<code class="font-mono text-xs bg-neutral-100 text-secondary-900 px-1 rounded">name</code>)</strong>: Untuk mengisi nama tampilan profil Anda.</li>
                      <li><strong class="text-secondary-900 font-semibold">Foto Profil (<code class="font-mono text-xs bg-neutral-100 text-secondary-900 px-1 rounded">picture</code>)</strong>: Sebagai avatar profil awal Anda.</li>
                    </ul>
                  </div>

                  <!-- Card 2: Manual Registration Data -->
                  <div class="bg-neutral-50 rounded-xl p-5 border border-neutral-200">
                    <div class="flex items-center gap-2 mb-2 font-title-3 text-secondary-900">
                      <svg class="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Informasi Pendaftaran Mandiri
                    </div>
                    <p class="font-paragraph-3 text-neutral-600">
                      Jika mendaftar secara manual: nama lengkap, alamat email aktif, username pilihan, serta kata sandi yang telah di-hash secara satu arah menggunakan algoritma bcrypt (kata sandi asli Anda tidak pernah kami ketahui atau simpan dalam teks biasa).
                    </p>
                  </div>

                  <!-- Card 3: Profile & Portfolio Data -->
                  <div class="bg-neutral-50 rounded-xl p-5 border border-neutral-200">
                    <div class="flex items-center gap-2 mb-2 font-title-3 text-secondary-900">
                      <svg class="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Profil &amp; Portofolio Tambahan
                    </div>
                    <p class="font-paragraph-3 text-neutral-600">
                      Informasi opsional yang Anda tambahkan ke profil: deskripsi bio profesional, keahlian teknis (skills), alat kerja (tools), riwayat pengalaman karier, dan tautan akun portofolio eksternal (GitHub, GitLab, LinkedIn, dsb.).
                    </p>
                  </div>

                  <!-- Card 4: Collaboration & Workspace Data -->
                  <div class="bg-neutral-50 rounded-xl p-5 border border-neutral-200">
                    <div class="flex items-center gap-2 mb-2 font-title-3 text-secondary-900">
                      <svg class="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      Aktivitas Kolaborasi &amp; Log Teknis
                    </div>
                    <p class="font-paragraph-3 text-neutral-600">
                      Proyek yang diinisiasi, lamaran peran kontributor, status tugas di kanban workspace tim, berkas deliverable yang diunggah, serta log teknis standar (alamat IP, jenis peramban web, dan waktu akses) untuk keamanan sistem.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <div class="k-rule"></div>

            <!-- Section 3: Penggunaan Informasi -->
            <section id="penggunaan-informasi" class="scroll-mt-28">
              <div class="flex items-center gap-3 mb-4">
                <span class="w-8 h-8 rounded-lg bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-600 font-label-2">
                  03
                </span>
                <h2 class="font-title-1 text-secondary-900 tracking-tight">
                  Bagaimana Kami Menggunakan Informasi Anda
                </h2>
              </div>
              <div class="space-y-4 font-paragraph-2 text-neutral-600">
                <p>
                  Kami memproses data Anda semata-mata untuk mengoperasikan, memelihara, dan meningkatkan fungsionalitas platform Kolaboria secara langsung bagi Anda. Penggunaan informasi mencakup tujuan-tujuan berikut:
                </p>

                <ul class="space-y-3 my-4">
                  <li class="flex items-start gap-3">
                    <span class="w-5 h-5 rounded-full bg-success-50 border border-success-200 text-success-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <span><strong class="text-secondary-900 font-semibold">Autentikasi &amp; Akses Layanan yang Aman:</strong> Memverifikasi identitas Anda saat login (melalui kredensial akun atau Google Sign-In), menerbitkan token sesi JWT terenkripsi, dan menjaga akun Anda tetap aman dari akses tidak sah.</span>
                  </li>
                  <li class="flex items-start gap-3">
                    <span class="w-5 h-5 rounded-full bg-success-50 border border-success-200 text-success-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <span><strong class="text-secondary-900 font-semibold">Manajemen Ruang Kerja Proyek (Workspace):</strong> Mengizinkan inisiator proyek dan kolaborator berinteraksi, membagi tugas di kanban board, meninjau deliverable karya, serta mengelola perizinan anggota tim.</span>
                  </li>
                  <li class="flex items-start gap-3">
                    <span class="w-5 h-5 rounded-full bg-success-50 border border-success-200 text-success-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <span><strong class="text-secondary-900 font-semibold">Pencocokan Kolaborator Cerdas (Matching):</strong> Membantu inisiator menemukan talenta berdasarkan keahlian (skills) dan alat (tools) yang relevan, serta merekomendasikan proyek terbuka yang sesuai minat Anda.</span>
                  </li>
                  <li class="flex items-start gap-3">
                    <span class="w-5 h-5 rounded-full bg-success-50 border border-success-200 text-success-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <span><strong class="text-secondary-900 font-semibold">Notifikasi Transaksional &amp; Keamanan:</strong> Mengirimkan pemberitahuan penting seperti penerimaan lamaran proyek, aktivitas tugas baru, email verifikasi akun, dan peringatan keamanan sesi.</span>
                  </li>
                  <li class="flex items-start gap-3">
                    <span class="w-5 h-5 rounded-full bg-success-50 border border-success-200 text-success-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <span><strong class="text-secondary-900 font-semibold">Validasi Portofolio Terverifikasi:</strong> Menampilkan riwayat kontribusi tugas yang berhasil diselesaikan sebagai bukti rekam jejak profesional di profil publik Anda.</span>
                  </li>
                </ul>
              </div>
            </section>

            <div class="k-rule"></div>

            <!-- Section 4: Kebijakan Khusus Data Pengguna Google (Google OAuth & Limited Use) -->
            <section id="google-user-data" class="scroll-mt-28">
              <div class="flex items-center gap-3 mb-4">
                <span class="w-8 h-8 rounded-lg bg-primary-50 border border-primary-200 flex items-center justify-center text-primary-600 font-label-2">
                  04
                </span>
                <h2 class="font-title-1 text-secondary-900 tracking-tight">
                  Ketentuan Khusus Data Pengguna Google (Google OAuth &amp; Limited Use Disclosure)
                </h2>
              </div>

              <!-- High-Visibility Callout Box for Google Verification Audit -->
              <div class="bg-neutral-50 border-2 border-primary-200/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
                <div class="flex items-start gap-4">
                  <div class="w-10 h-10 rounded-xl bg-white border border-neutral-200 flex items-center justify-center flex-shrink-0 shadow-xs">
                    <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                  </div>
                  <div>
                    <h3 class="font-title-2 text-secondary-900 mb-1">
                      Keterbukaan Integrasi Google OAuth &amp; Penggunaan Data Pengguna Google
                    </h3>
                    <p class="font-paragraph-3 text-neutral-600 leading-relaxed">
                      Bagian ini secara eksplisit menguraikan cakupan (scopes), akses, penggunaan, penyimpanan, dan perlindungan data yang diterima dari Google APIs sesuai dengan pedoman resmi Google Cloud Trust &amp; Safety.
                    </p>
                  </div>
                </div>

                <!-- Detailed Sub-clauses -->
                <div class="space-y-4">
                  <div class="p-4 sm:p-5 rounded-xl bg-white border border-neutral-200">
                    <h4 class="font-title-3 text-secondary-900 mb-2">
                      1. Cakupan (Scopes) Google OAuth yang Diminta:
                    </h4>
                    <p class="font-paragraph-3 text-neutral-600 mb-2">
                      Kolaboria hanya meminta cakupan minimal (least privilege scopes) berikut:
                    </p>
                    <ul class="list-disc pl-5 space-y-1.5 font-paragraph-4 text-neutral-600">
                      <li><code class="font-mono text-xs bg-neutral-100 text-secondary-900 px-1.5 py-0.5 rounded border border-neutral-200">https://www.googleapis.com/auth/userinfo.profile</code> &mdash; Membaca nama lengkap dan foto profil dasar publik Anda.</li>
                      <li><code class="font-mono text-xs bg-neutral-100 text-secondary-900 px-1.5 py-0.5 rounded border border-neutral-200">https://www.googleapis.com/auth/userinfo.email</code> &mdash; Membaca alamat email primer akun Google Anda.</li>
                    </ul>
                    <p class="font-paragraph-4 text-neutral-600 mt-2">
                      Aplikasi kami <strong class="text-secondary-900 font-semibold">TIDAK PERNAH</strong> meminta akses ke Google Drive, Gmail, Kalender, Kontak, Dokumen, atau data sensitif Google lainnya.
                    </p>
                  </div>

                  <div class="p-4 sm:p-5 rounded-xl bg-white border border-neutral-200">
                    <h4 class="font-title-3 text-secondary-900 mb-2">
                      2. Bagaimana Data Pengguna Google Digunakan:
                    </h4>
                    <p class="font-paragraph-3 text-neutral-600 mb-2">
                      Data yang diperoleh dari Google API (ID Pengguna Google <code class="font-mono text-xs bg-neutral-100 text-secondary-900 px-1 rounded">sub</code>, email, nama, dan foto profil) digunakan <strong class="text-secondary-900 font-semibold">hanya untuk</strong>:
                    </p>
                    <ul class="list-disc pl-5 space-y-1 font-paragraph-4 text-neutral-600">
                      <li>Mengautentikasi dan memberikan izin masuk (Sign-In) secara aman ke akun Kolaboria Anda.</li>
                      <li>Membuat akun pengguna baru atau menautkan ke akun Kolaboria yang ada dengan email yang sama.</li>
                      <li>Mengisi nama tampilan dan foto profil awal akun Kolaboria Anda secara otomatis agar mempermudah pengalaman Anda.</li>
                    </ul>
                  </div>

                  <div class="p-4 sm:p-5 rounded-xl bg-white border border-neutral-200">
                    <h4 class="font-title-3 text-secondary-900 mb-2">
                      3. Larangan Penggunaan &amp; Jaminan Tanpa Komersialisasi:
                    </h4>
                    <p class="font-paragraph-3 text-neutral-600 mb-2">
                      Sesuai dengan ketentuan Google API Services User Data Policy, Kolaboria menetapkan batasan mutlak berikut:
                    </p>
                    <ul class="list-disc pl-5 space-y-1.5 font-paragraph-4 text-neutral-600">
                      <li><strong class="text-secondary-900 font-semibold">Tidak Menjual Data:</strong> Kami <em class="text-secondary-900">tidak pernah menjual, menyewakan, atau memperdagangkan data pengguna Google</em> kepada pihak ketiga, broker data, atau jaringan iklan komersial manapun.</li>
                      <li><strong class="text-secondary-900 font-semibold">Tidak Ada Iklan Tertarget:</strong> Data pengguna Google <em class="text-secondary-900">tidak pernah digunakan</em> untuk periklanan tertarget, iklan personalisasi, retargeting, atau analisis kelayakan kredit.</li>
                      <li><strong class="text-secondary-900 font-semibold">Tidak Digunakan untuk Melatih Model AI/ML:</strong> Data pengguna Google dari Kolaboria <em class="text-secondary-900">tidak pernah digunakan</em> untuk melatih, mengembangkan, atau menyempurnakan model kecerdasan buatan (AI) atau pembelajaran mesin (ML) non-personalisasi / general.</li>
                      <li><strong class="text-secondary-900 font-semibold">Pembatasan Transfer Data:</strong> Kami tidak mentransfer data pengguna Google kepada pihak ketiga kecuali penyedia infrastruktur komputasi awan yang diwajibkan secara kontraktual untuk menjalankan layanan Kolaboria dengan standar keamanan tinggi.</li>
                    </ul>
                  </div>

                  <div class="p-4 sm:p-5 rounded-xl bg-white border border-neutral-200">
                    <h4 class="font-title-3 text-secondary-900 mb-2">
                      4. Cara Mencabut Izin Akses Google (Revoke Access):
                    </h4>
                    <p class="font-paragraph-3 text-neutral-600">
                      Anda memiliki kendali penuh setiap saat. Jika Anda ingin memutuskan koneksi akun Google dengan Kolaboria, Anda dapat mencabut izin akses kapan saja melalui halaman Pengaturan Keamanan Google resmi di:
                      <a href="https://myaccount.google.com/permissions" target="_blank" rel="noopener noreferrer" class="text-primary-600 underline font-semibold hover:text-primary-700 transition-colors ml-1">
                        https://myaccount.google.com/permissions
                      </a>.
                      Setelah izin dicabut, Kolaboria tidak lagi dapat menerima pembaruan informasi apapun dari akun Google Anda.
                    </p>
                  </div>

                  <!-- Mandatory Google Limited Use Statement (Bilingual Indonesian & English) -->
                  <div class="p-5 rounded-2xl bg-primary-50/80 border border-primary-200">
                    <div class="flex items-center gap-2 mb-2 text-primary-900 font-label-1">
                      <svg class="w-4 h-4 text-primary-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Pernyataan Kepatuhan Resmi (Official Google Limited Use Statement)</span>
                    </div>

                    <div class="space-y-3 font-paragraph-3 text-primary-900 leading-relaxed">
                      <p class="font-medium">
                        <strong class="text-secondary-900 font-semibold">Bahasa Indonesia:</strong> Penggunaan dan pengalihan informasi yang diterima Kolaboria dari Google API ke aplikasi lain akan mematuhi
                        <a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noopener noreferrer" class="underline font-bold text-primary-700 hover:text-primary-800 transition-colors">
                          Kebijakan Data Pengguna Layanan API Google
                        </a>, termasuk Persyaratan Penggunaan Terbatas (Limited Use requirements).
                      </p>
                      <div class="border-t border-primary-200/60 pt-2">
                        <p class="italic font-paragraph-4 text-primary-800">
                          <strong class="font-semibold text-secondary-900">English Official Disclosure:</strong> &quot;Kolaboria&apos;s use and transfer to any other app of information received from Google APIs will adhere to the
                          <a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noopener noreferrer" class="underline font-bold text-primary-700 hover:text-primary-800 transition-colors">
                            Google API Services User Data Policy
                          </a>, including the Limited Use requirements.&quot;
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <div class="k-rule"></div>

            <!-- Section 5: Visibilitas & Berbagi Data -->
            <section id="visibilitas-data" class="scroll-mt-28">
              <div class="flex items-center gap-3 mb-4">
                <span class="w-8 h-8 rounded-lg bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-600 font-label-2">
                  05
                </span>
                <h2 class="font-title-1 text-secondary-900 tracking-tight">
                  Visibilitas &amp; Kebijakan Berbagi Data
                </h2>
              </div>
              <div class="space-y-4 font-paragraph-2 text-neutral-600">
                <p>
                  Sebagai ekosistem kolaborasi profesional terbuka, kami merancang hierarki data yang jelas antara informasi yang ditampilkan ke publik untuk membangun reputasi Anda dan informasi yang dijaga kerahasiaannya secara ketat:
                </p>

                <!-- Guarantee Callout -->
                <div class="my-6 bg-gradient-to-r from-secondary-500 to-secondary-600 rounded-2xl p-6 text-white shadow-md">
                  <div class="flex items-start gap-4">
                    <div class="w-10 h-10 rounded-xl bg-accent-400/20 border border-accent-400/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg class="w-5 h-5 text-accent-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <div>
                      <h3 class="font-title-2 text-white mb-1">Prinsip Tanpa Komersialisasi &amp; Non-Penjualan Data</h3>
                      <p class="font-paragraph-3 text-secondary-100 leading-relaxed">
                        Kolaboria <strong class="text-white font-semibold">tidak pernah menjual, menyewakan, atau memperdagangkan data pribadi pengguna kepada pihak ketiga</strong> untuk tujuan pemasaran, promosi pihak ketiga, atau monetisasi data dalam bentuk apapun.
                      </p>
                    </div>
                  </div>
                </div>

                <h3 class="font-title-3 text-secondary-900 mt-6 mb-2">Perincian Informasi Publik vs. Privat:</h3>
                <ul class="space-y-2 list-disc pl-5">
                  <li><strong class="text-secondary-900 font-semibold">Informasi Terbuka (Publik):</strong> Nama lengkap, username unik, avatar/foto profil, biografi singkat, daftar keahlian (skills), alat (tools), dan riwayat kontribusi proyek yang telah diselesaikan untuk membangun portofolio reputasi Anda.</li>
                  <li><strong class="text-secondary-900 font-semibold">Informasi Tertutup (Privat &amp; Terisolasi):</strong> Alamat email pribadi, kata sandi (hash), log autentikasi teknis, serta dokumen kerja, diskusi, dan tugas di dalam private workspace proyek (hanya dapat diakses oleh inisiator dan anggota tim proyek yang bersangkutan).</li>
                </ul>

                <h3 class="font-title-3 text-secondary-900 mt-6 mb-2">Pihak Ketiga Tepercaya (Sub-prosesor Layanan):</h3>
                <p>
                  Kami hanya membagikan data kepada pihak ketiga yang bertindak sebagai penyedia infrastruktur teknologi esensial (seperti penyedia basis data cloud PostgreSQL, penyedia hosting server, dan penyedia pengiriman email transaksional) semata-mata untuk mengoperasikan sistem Kolaboria. Semua mitra ini terikat perjanjian kerahasiaan dan kepatuhan standar keamanan data internasional yang ketat.
                </p>
              </div>
            </section>

            <div class="k-rule"></div>

            <!-- Section 6: Keamanan Data -->
            <section id="keamanan-data" class="scroll-mt-28">
              <div class="flex items-center gap-3 mb-4">
                <span class="w-8 h-8 rounded-lg bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-600 font-label-2">
                  06
                </span>
                <h2 class="font-title-1 text-secondary-900 tracking-tight">
                  Keamanan &amp; Perlindungan Data
                </h2>
              </div>
              <div class="space-y-4 font-paragraph-2 text-neutral-600">
                <p>
                  Kami menerapkan arsitektur keamanan berlapis (<em>defense-in-depth</em>) untuk melindungi informasi Anda, termasuk data yang diterima melalui Google OAuth, dari ancaman akses tanpa izin, kehilangan, perubahan, atau kebocoran:
                </p>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
                  <div class="p-5 rounded-2xl bg-neutral-50 border border-neutral-200">
                    <div class="w-8 h-8 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center mb-3">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <h3 class="font-title-3 text-secondary-900 mb-1">Enkripsi Transit (HTTPS / TLS 1.3)</h3>
                    <p class="font-paragraph-4 text-neutral-600">
                      Seluruh transmisi data antara peramban web Anda dan server Kolaboria dienkripsi secara penuh dengan protokol Transport Layer Security terkini.
                    </p>
                  </div>

                  <div class="p-5 rounded-2xl bg-neutral-50 border border-neutral-200">
                    <div class="w-8 h-8 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center mb-3">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M4 7v10c0 2 1 3 3 3h10c2 0 3-1 3-3V7c0-2-1-3-3-3H7C5 4 4 5 4 7zM9 9h6M9 13h6M9 17h4" />
                      </svg>
                    </div>
                    <h3 class="font-title-3 text-secondary-900 mb-1">Row Level Security (RLS)</h3>
                    <p class="font-paragraph-4 text-neutral-600">
                      Basis data PostgreSQL kami memisahkan dan memvalidasi otorisasi akses data hingga baris database secara ketat, memastikan data privat tim tidak dapat dibaca oleh pengguna luar.
                    </p>
                  </div>

                  <div class="p-5 rounded-2xl bg-neutral-50 border border-neutral-200">
                    <div class="w-8 h-8 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center mb-3">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                      </svg>
                    </div>
                    <h3 class="font-title-3 text-secondary-900 mb-1">Token Kriptografis &amp; Hashing</h3>
                    <p class="font-paragraph-4 text-neutral-600">
                      Kredensial login dikelola menggunakan token JWT berbasis waktu dan algoritma hashing password bcrypt. Akses database dibatasi dengan prinsip hak istimewa terendah (least privilege).
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <div class="k-rule"></div>

            <!-- Section 7: Retensi & Penghapusan Data (Data Retention & Deletion) -->
            <section id="retensi-penghapusan" class="scroll-mt-28">
              <div class="flex items-center gap-3 mb-4">
                <span class="w-8 h-8 rounded-lg bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-600 font-label-2">
                  07
                </span>
                <h2 class="font-title-1 text-secondary-900 tracking-tight">
                  Retensi &amp; Penghapusan Data (Data Retention &amp; Deletion)
                </h2>
              </div>
              <div class="space-y-4 font-paragraph-2 text-neutral-600">
                <p>
                  Kami menghormati prinsip pembatasan penyimpanan data. Kami hanya menyimpan data pribadi Anda (termasuk data yang diperoleh dari akun Google) selama diperlukan untuk memenuhi tujuan penyediaan layanan:
                </p>

                <div class="space-y-3 my-4">
                  <div class="p-4 sm:p-5 rounded-xl border border-neutral-200 bg-neutral-50">
                    <h3 class="font-title-3 text-secondary-900 mb-1">Masa Retensi Data (Retention Period):</h3>
                    <p class="font-paragraph-3 text-neutral-600">
                      Data profil dan riwayat kolaborasi disimpan selama akun Kolaboria Anda berstatus aktif. Apabila akun tidak aktif dalam jangka waktu lama atau ketika tujuan pemrosesan data telah selesai, data akan dihapus atau dianonimkan sesuai prosedur internal kami kecuali diwajibkan lain oleh ketentuan hukum yang berlaku.
                    </p>
                  </div>

                  <div class="p-4 sm:p-5 rounded-xl border border-neutral-200 bg-neutral-50">
                    <h3 class="font-title-3 text-secondary-900 mb-1">Permintaan Penghapusan Akun &amp; Data Pribadi:</h3>
                    <p class="font-paragraph-3 text-neutral-600">
                      Setiap pengguna berhak mengajukan penutupan akun permanen dan penghapusan seluruh data pribadi (termasuk data Google OAuth). Anda dapat mengajukan permintaan penghapusan akun kapan saja dengan:
                    </p>
                    <ul class="list-disc pl-5 mt-2 space-y-1 font-paragraph-4 text-neutral-600">
                      <li>Mengakses menu <strong class="text-secondary-900 font-semibold">Pengaturan Akun &gt; Hapus Akun</strong> di dashboard profil Kolaboria Anda, atau</li>
                      <li>Mengirimkan email permohonan ke <a href="mailto:privacy@kolaboria.id" class="text-primary-600 underline font-semibold hover:text-primary-700 transition-colors">privacy@kolaboria.id</a> dengan subjek <em class="text-secondary-900">&quot;Permintaan Penghapusan Akun &amp; Data&quot;</em> menggunakan email terdaftar Anda.</li>
                    </ul>
                    <p class="font-paragraph-4 text-neutral-600 mt-2">
                      Setelah permohonan diverifikasi, seluruh data profil pribadi, token autentikasi, dan pengenal akun akan dihapus secara permanen dari basis data aktif kami dalam waktu selambat-lambatnya <strong class="text-secondary-900 font-semibold">30 hari kalender</strong>.
                    </p>
                  </div>

                  <div class="p-4 sm:p-5 rounded-xl border border-neutral-200 bg-neutral-50">
                    <h3 class="font-title-3 text-secondary-900 mb-1">Pencabutan Akses Google secara Mandiri:</h3>
                    <p class="font-paragraph-3 text-neutral-600">
                      Pengguna yang masuk menggunakan Google Sign-In dapat mencabut hak akses aplikasi Kolaboria secara instan melalui
                      <a href="https://myaccount.google.com/permissions" target="_blank" rel="noopener noreferrer" class="text-primary-600 underline font-semibold hover:text-primary-700 transition-colors ml-1">
                        Pengaturan Akses Aplikasi Akun Google
                      </a>. Tindakan ini secara otomatis menghentikan segala pertukaran data baru antara Google dan platform kami.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <div class="k-rule"></div>

            <!-- Section 8: Hak & Kendali Pengguna -->
            <section id="hak-pengguna" class="scroll-mt-28">
              <div class="flex items-center gap-3 mb-4">
                <span class="w-8 h-8 rounded-lg bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-600 font-label-2">
                  08
                </span>
                <h2 class="font-title-1 text-secondary-900 tracking-tight">
                  Hak &amp; Kendali Anda atas Data Pribadi
                </h2>
              </div>
              <div class="space-y-4 font-paragraph-2 text-neutral-600">
                <p>
                  Sesuai dengan ketentuan perlindungan data pribadi yang berlaku, Anda memiliki hak-hak utama berikut atas informasi pribadi Anda di Kolaboria:
                </p>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
                  <div class="flex items-start gap-3 p-4 rounded-xl border border-neutral-200 bg-white shadow-xs">
                    <span class="w-6 h-6 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center flex-shrink-0 font-label-3">A</span>
                    <div>
                      <h4 class="font-label-1 text-secondary-900">Hak Akses &amp; Transparansi</h4>
                      <p class="font-paragraph-4 text-neutral-600 mt-0.5">Anda berhak meminta informasi mengenai data pribadi apa saja yang kami simpan serta tujuan pemrosesannya.</p>
                    </div>
                  </div>

                  <div class="flex items-start gap-3 p-4 rounded-xl border border-neutral-200 bg-white shadow-xs">
                    <span class="w-6 h-6 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center flex-shrink-0 font-label-3">B</span>
                    <div>
                      <h4 class="font-label-1 text-secondary-900">Hak Pembaruan &amp; Koreksi</h4>
                      <p class="font-paragraph-4 text-neutral-600 mt-0.5">Anda dapat memperbarui nama, foto profil, deskripsi keahlian, dan tautan sosial kapan saja melalui halaman Pengaturan Profil.</p>
                    </div>
                  </div>

                  <div class="flex items-start gap-3 p-4 rounded-xl border border-neutral-200 bg-white shadow-xs">
                    <span class="w-6 h-6 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center flex-shrink-0 font-label-3">C</span>
                    <div>
                      <h4 class="font-label-1 text-secondary-900">Hak Penarikan Persetujuan</h4>
                      <p class="font-paragraph-4 text-neutral-600 mt-0.5">Anda berhak menarik kembali izin pemrosesan data tertentu atau memutuskan integrasi pihak ketiga (seperti akun Google).</p>
                    </div>
                  </div>

                  <div class="flex items-start gap-3 p-4 rounded-xl border border-neutral-200 bg-white shadow-xs">
                    <span class="w-6 h-6 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center flex-shrink-0 font-label-3">D</span>
                    <div>
                      <h4 class="font-label-1 text-secondary-900">Hak Penghapusan (Right to Erasure)</h4>
                      <p class="font-paragraph-4 text-neutral-600 mt-0.5">Anda berhak meminta penghapusan permanen akun Anda dan seluruh rekaman data pribadi terkait dari sistem kami.</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <div class="k-rule"></div>

            <!-- Section 9: Cookie & Pelacak -->
            <section id="cookie-teknologi" class="scroll-mt-28">
              <div class="flex items-center gap-3 mb-4">
                <span class="w-8 h-8 rounded-lg bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-600 font-label-2">
                  09
                </span>
                <h2 class="font-title-1 text-secondary-900 tracking-tight">
                  Penggunaan Cookie &amp; Teknologi Serupa
                </h2>
              </div>
              <div class="space-y-4 font-paragraph-2 text-neutral-600">
                <p>
                  Kolaboria menggunakan cookie secara bertanggung jawab dan proporsional hanya untuk menjaga keandalan fungsionalitas aplikasi web kami:
                </p>
                <ul class="space-y-2 list-disc pl-5">
                  <li><strong class="text-secondary-900 font-semibold">Cookie Esensial &amp; Sesi:</strong> Diperlukan untuk mempertahankan sesi login aktif Anda secara aman dan melindungi permintaan dari serangan Cross-Site Request Forgery (CSRF).</li>
                  <li><strong class="text-secondary-900 font-semibold">Cookie Preferensi Tampilan:</strong> Menyimpan preferensi navigasi, bahasa, atau tema lokal di perangkat Anda.</li>
                  <li><strong class="text-secondary-900 font-semibold">Metrik Kinerja Sistem:</strong> Mengukur waktu respon server dan performa halaman secara agregat dan anonim tanpa melacak aktivitas pribadi Anda di situs eksternal. Kami <strong class="text-secondary-900 font-semibold">tidak menggunakan</strong> cookie pelacak iklan pihak ketiga (third-party tracking cookies).</li>
                </ul>
              </div>
            </section>

            <div class="k-rule"></div>

            <!-- Section 10: Pembaruan & Kontak -->
            <section id="kontak-pembaruan" class="scroll-mt-28">
              <div class="flex items-center gap-3 mb-4">
                <span class="w-8 h-8 rounded-lg bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-600 font-label-2">
                  10
                </span>
                <h2 class="font-title-1 text-secondary-900 tracking-tight">
                  Pembaruan Kebijakan &amp; Kontak Resmi
                </h2>
              </div>
              <div class="space-y-4 font-paragraph-2 text-neutral-600">
                <p>
                  Kebijakan Privasi ini dapat kami perbarui dari waktu ke waktu untuk menyesuaikan dengan penambahan fitur aplikasi, pedoman keamanan baru, atau perubahan regulasi hukum. Jika terdapat pembaruan material yang memengaruhi hak atau cara kami memproses data pengguna (termasuk data Google OAuth), kami akan memberitahukan Anda melalui pengumuman di aplikasi atau melalui email terdaftar sebelum perubahan tersebut berlaku efektif.
                </p>

                <!-- Interactive Contact Card -->
                <div class="mt-8 bg-neutral-50 border border-neutral-200 rounded-3xl p-8 hover:border-primary-300 transition-all duration-300">
                  <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                    <div>
                      <span class="k-eyebrow text-primary-600">Pusat Layanan Data</span>
                      <h3 class="font-title-2 text-secondary-900 mt-1 mb-2">
                        Tim Perlindungan Privasi Kolaboria
                      </h3>
                      <p class="font-paragraph-3 text-neutral-600 max-w-md">
                        Jika Anda memiliki pertanyaan seputar Kebijakan Privasi, integrasi Google OAuth, permohonan data, atau penghapusan akun, silakan hubungi tim kami langsung. Kami berkomitmen membalas permohonan dalam waktu 1&ndash;3 hari kerja.
                      </p>
                      <div class="mt-3 font-body-2 text-neutral-600">
                        Email Resmi: <a href="mailto:privacy@kolaboria.id" class="font-bold text-primary-600 underline hover:text-primary-700 transition-colors">privacy@kolaboria.id</a>
                      </div>
                    </div>

                    <a
                      href="mailto:privacy@kolaboria.id?subject=Pertanyaan%20Privasi%20dan%20Data%20Kolaboria"
                      class="flex-shrink-0"
                    >
                      <AtomicButton variant="primary" size="md">
                        Hubungi Tim Privasi
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
        'Kebijakan Privasi resmi Kolaboria. Ketahui komitmen transparansi, enkripsi data, integrasi Google OAuth, kepatuhan Google API Limited Use, dan hak kendali data Anda.'
    },
    {
      property: 'og:title',
      content: 'Kebijakan Privasi — Kolaboria'
    },
    {
      property: 'og:description',
      content:
        'Kebijakan Privasi resmi Kolaboria. Transparansi pemrosesan data, integrasi Google OAuth, enkripsi, dan hak kendali penuh pengguna.'
    },
    {
      property: 'og:url',
      content: 'https://dev.kolaboria.com/privacy-policy'
    }
  ]
})

const activeSection = ref('pendahuluan')

const sections = [
  { id: 'pendahuluan', title: '1. Pendahuluan & Identitas' },
  { id: 'informasi-dikumpulkan', title: '2. Informasi Dikumpulkan' },
  { id: 'penggunaan-informasi', title: '3. Penggunaan Informasi' },
  { id: 'google-user-data', title: '4. Ketentuan Data Google' },
  { id: 'visibilitas-data', title: '5. Visibilitas & Berbagi' },
  { id: 'keamanan-data', title: '6. Keamanan Data' },
  { id: 'retensi-penghapusan', title: '7. Retensi & Penghapusan' },
  { id: 'hak-pengguna', title: '8. Hak & Kendali Pengguna' },
  { id: 'cookie-teknologi', title: '9. Cookie & Analitik' },
  { id: 'kontak-pembaruan', title: '10. Pembaruan & Kontak' }
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
  background-color: var(--color-neutral-200, #e2e8ef);
}

.k-eyebrow {
  font-size: var(--font-label-3-size, 0.6875rem);
  font-weight: var(--font-label-3-weight, 700);
  line-height: var(--font-label-3-line-height, 1.36);
  letter-spacing: var(--font-label-3-letter-spacing, 0.05em);
  text-transform: uppercase;
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
    color-mix(in srgb, var(--color-secondary-500, #1c2e4a) 50%, transparent) 0%,
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
