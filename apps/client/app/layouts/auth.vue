<template>
  <div class="min-h-screen flex bg-white">
    <!-- Left Side - Branding (Premium Primary) -->
    <div
      class="hidden lg:flex lg:w-[45%] bg-primary-500 p-12 lg:p-16 flex-col justify-between relative overflow-hidden"
    >
      <!-- Aurora Background Effects (Adjusted for Primary bg) -->
      <div class="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          class="hidden lg:block aurora-1 opacity-60 mix-blend-overlay"
        ></div>
        <div
          class="hidden lg:block aurora-2 opacity-50 mix-blend-overlay"
        ></div>
      </div>

      <!-- Detail Subtle Graphic Grid (Unique Visual Characteristic) -->
      <div
        class="absolute inset-0 pointer-events-none mix-blend-overlay"
        style="
          background-image:
            linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
            linear-gradient(
              90deg,
              rgba(255, 255, 255, 0.05) 1px,
              transparent 1px
            );
          background-size: 64px 64px;
        "
        aria-hidden="true"
      ></div>

      <!-- Humanistic Spacing & Borders to frame the logo -->
      <div class="relative z-20 flex items-center gap-2.5">
        <NuxtLink to="/" class="flex items-center gap-3 group">
          <img
            src="~/assets/img/logo.svg"
            alt="Logo"
            class="h-12 bg-white p-2 rounded-lg"
          />
        </NuxtLink>
      </div>

      <div class="relative z-20 mt-12 flex-1 flex flex-col justify-center">
        <!-- Main Content with humanistic text rhythm -->
        <div class="mb-14 relative pl-6 border-l-2 border-white/20">
          <p
            class="font-label-sm text-white/80 mb-4 tracking-[0.2em] uppercase text-xs font-semibold"
          >
            Komunitas Terbuka
          </p>
          <h2
            class="text-4xl lg:text-[2.75rem] font-black text-white mb-6 leading-[1.15] tracking-tight drop-shadow-sm"
          >
            Selamat Datang di <br />
            Masa Depan <span class="text-white/90">Kolaborasi</span>
          </h2>
          <p
            class="font-paragraph-lg text-white/80 max-w-lg leading-[1.7] text-[1.1rem]"
          >
            Gabung bersama ribuan talenta dan mentor ahli untuk membangun
            inovasi digital yang berdampak nyata tanpa hambatan hierarki.
          </p>
        </div>

        <!-- Features using Glassmorphism approach inside flat design with subtle hover -> 'dibuat manusia' feel -->
        <div class="space-y-5">
          <div
            class="group flex items-center gap-4 bg-white/10 backdrop-blur-md border border-white/10 rounded-[1.25rem] p-4 w-fit transition-all duration-500 ease-out hover:bg-white/15 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary-900/10 cursor-default"
          >
            <div
              class="w-11 h-11 bg-white/10 rounded-xl flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform duration-500 ease-out text-white"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </div>
            <span class="text-white/95 font-medium tracking-wide"
              >Ubah ide jadi proyek nyata</span
            >
          </div>
          <div
            class="group flex items-center gap-4 bg-white/10 backdrop-blur-md border border-white/10 rounded-[1.25rem] p-4 w-fit ml-6 transition-all duration-500 ease-out hover:bg-white/15 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary-900/10 cursor-default"
          >
            <div
              class="w-11 h-11 bg-white/10 rounded-xl flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform duration-500 ease-out text-white"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </div>
            <span class="text-white/95 font-medium tracking-wide"
              >Dapatkan mentor & tim solid</span
            >
          </div>
          <div
            class="group flex items-center gap-4 bg-white/10 backdrop-blur-md border border-white/10 rounded-[1.25rem] p-4 w-fit ml-12 transition-all duration-500 ease-out hover:bg-white/15 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary-900/10 cursor-default"
          >
            <div
              class="w-11 h-11 bg-white/10 rounded-xl flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform duration-500 ease-out text-white"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </div>
            <span class="text-white/95 font-medium tracking-wide"
              >Bangun reputasi profesional</span
            >
          </div>
        </div>
      </div>

      <div
        class="relative z-20 mt-12 flex items-center gap-4 border-t border-white/15 pt-8"
      >
        <p class="text-white/70 text-sm font-medium tracking-wide">
          Dipercaya oleh
          <span class="text-white font-bold">10.000+</span> kolaborator aktif.
        </p>
      </div>
    </div>

    <!-- Right Side - Auth Form Container -->
    <div
      class="flex-1 flex items-center justify-center p-6 sm:p-12 relative overflow-hidden bg-white"
    >
      <!-- subtle hand-crafted background dot pattern for the right panel -->
      <div
        class="absolute inset-0 pointer-events-none opacity-[0.02]"
        style="
          background-image: radial-gradient(#000 1px, transparent 1px);
          background-size: 24px 24px;
        "
        aria-hidden="true"
      ></div>

      <!-- Ambient light behind the form for pop -->
      <div
        class="absolute top-0 right-0 w-96 h-96 bg-primary-100/50 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/3"
      ></div>

      <div class="w-full max-w-md relative z-10 fade-in-section px-4 sm:px-0">
        <!-- Mobile Logo -->
        <div class="lg:hidden mb-10 flex flex-col items-center">
          <NuxtLink to="/" class="flex items-center gap-2.5 group">
            <img src="~/assets/img/logo.svg" alt="Logo" class="h-8" />
          </NuxtLink>
        </div>

        <!-- Slot for Form Content -->
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Wave CSS Animations using multiple layers */
.aurora-1 {
  position: absolute;
  top: -20%;
  left: -10%;
  width: 70%;
  height: 70%;
  background: radial-gradient(
    ellipse at center,
    rgba(255, 255, 255, 0.2) 0%,
    transparent 70%
  );
  animation: aurora-drift 14s ease-in-out infinite alternate;
  border-radius: 50%;
  filter: blur(60px);
  will-change: transform;
}
.aurora-2 {
  position: absolute;
  bottom: -20%;
  right: -10%;
  width: 70%;
  height: 70%;
  background: radial-gradient(
    ellipse at center,
    rgba(255, 176, 32, 0.15) 0%,
    transparent 70%
  );
  animation: aurora-drift 18s ease-in-out infinite alternate-reverse;
  border-radius: 50%;
  filter: blur(70px);
  will-change: transform;
}
@keyframes aurora-drift {
  0% {
    transform: translate(0px, 0px) scale(1);
  }
  50% {
    transform: translate(40px, -30px) scale(1.08);
  }
  100% {
    transform: translate(-20px, 20px) scale(0.95);
  }
}
</style>
