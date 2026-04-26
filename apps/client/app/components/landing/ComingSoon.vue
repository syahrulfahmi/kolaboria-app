<template>
  <div
    class="min-h-screen bg-primary-500 overflow-hidden relative flex flex-col justify-center font-sans tracking-tight"
  >
    <nav class="absolute top-0 inset-x-0 z-50 bg-transparent py-8">
      <div class="max-w-7xl mx-auto px-6 flex items-center justify-center">
        <img
          src="~/assets/img/logo.svg"
          alt="Kolaboria Logo"
          class="h-10 bg-white p-2 rounded-xl"
        />
      </div>
    </nav>

    <div
      class="absolute inset-0 pointer-events-none opacity-[.06] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px]"
    ></div>

    <div
      class="absolute inset-0 pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      <div class="aurora"></div>
    </div>

    <svg
      class="absolute inset-0 w-full h-full pointer-events-none opacity-50"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        class="animate-float"
        cx="15%"
        cy="20%"
        r="3"
        fill="#fff"
        opacity="0.8"
      />
      <circle
        class="animate-float"
        cx="80%"
        cy="15%"
        r="4"
        fill="#fff"
        opacity="0.6"
        style="animation-delay: 1.2s"
      />
      <circle
        class="animate-float"
        cx="20%"
        cy="75%"
        r="2.5"
        fill="#fff"
        opacity="0.9"
        style="animation-delay: 2.1s"
      />
      <circle
        class="animate-float"
        cx="85%"
        cy="70%"
        r="3"
        fill="#fff"
        opacity="0.8"
        style="animation-delay: 0.5s"
      />
    </svg>

    <div
      class="relative z-10 max-w-4xl mx-auto px-6 py-20 text-center flex flex-col items-center"
    >
      <div
        class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-8 backdrop-blur-sm animate-float shadow-xl shadow-black/5"
      >
        <span
          class="w-2.5 h-2.5 rounded-full bg-secondary-400 animate-pulse"
        ></span>
        <span class="text-white font-bold text-xs tracking-widest uppercase"
          >Platform Kolaborasi</span
        >
      </div>

      <h1
        class="text-3xl md:text-5xl lg:text-[3.5rem] font-black text-white mb-6 leading-[1.1] drop-shadow-sm"
      >
        Sesuatu yang Besar<br />
        <span class="text-secondary-500"> Segera Hadir </span>
      </h1>

      <p
        class="text-md md:text-lg text-white/80 max-w-2xl mx-auto mb-12 leading-relaxed font-medium"
      >
        Kami sedang membangun cara baru untuk mengubah idemu menjadi nyata.
      </p>
    </div>

    <div
      class="absolute bottom-[-1px] left-0 right-0 overflow-hidden leading-none z-10 w-full h-[12vh] min-h-[80px]"
    >
      <svg
        class="absolute bottom-0 w-[200%] h-full opacity-30 text-white fill-current wave-1"
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
        class="absolute bottom-0 w-[200%] h-full text-white fill-current wave-2"
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
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.aurora {
  position: absolute;
  bottom: 5%;
  right: -10%;
  width: 60%;
  height: 60%;
  background: radial-gradient(
    ellipse at center,
    rgba(28, 46, 74, 0.4) 0%,
    transparent 70%
  );
  animation: aurora-drift 16s ease-in-out infinite alternate-reverse;
  border-radius: 50%;
  filter: blur(56px);
}
@keyframes aurora-drift {
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
@keyframes float {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-16px);
  }
}
.animate-float {
  animation: float 6s ease-in-out infinite;
}
.wave-1 {
  animation: wave-scroll 24s linear infinite;
  will-change: transform;
}
.wave-2 {
  animation: wave-scroll 12s linear infinite;
  will-change: transform;
}
@keyframes wave-scroll {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}
</style>
