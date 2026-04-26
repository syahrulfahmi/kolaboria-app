<template>
  <div class="k-root overflow-hidden">
    <LandingNavbar />
    <LandingHero />
    <LandingProblem />
    <LandingHowItWorks />
    <LandingPersona />
    <LandingFeatures />
    <LandingFaq />
    <LandingCta />
    <LandingFooter />
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Kolaboria — Kolaborasi Nyata, Proyek Nyata.',
  meta: [
    {
      name: 'description',
      content:
        'Platform kolaborasi Indonesia yang menghubungkan inisiator proyek dengan talenta dan mentor terbaik.'
    }
  ]
})
</script>

<style>
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
.k-rule-light {
  height: 1px;
  background-color: rgba(255, 255, 255, 0.15);
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

.k-eyebrow {
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}
.k-section-title {
  font-size: 2rem;
  font-weight: 900;
  line-height: 1.15;
  letter-spacing: -0.02em;
}
@media (min-width: 768px) {
  .k-section-title {
    font-size: 2.75rem;
  }
}

.k-headline {
  font-size: 3rem;
  font-weight: 900;
  line-height: 1.05;
  letter-spacing: -0.03em;
}
@media (min-width: 768px) {
  .k-headline {
    font-size: 4rem;
  }
}
@media (min-width: 1024px) {
  .k-headline {
    font-size: 4.5rem;
  }
}

.k-tilt-card {
  transition:
    transform 400ms cubic-bezier(0.4, 0, 0.2, 1),
    box-shadow 400ms cubic-bezier(0.4, 0, 0.2, 1);
  transform: perspective(900px) rotateY(-10deg) rotateX(4deg) translateY(-10px);
}
.k-tilt-card:hover {
  transform: scale(1.1);
}

/* .k-tilt-card {
  transition: transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.k-tilt-card:hover {
  transform: translateY(-8px) scale(1.02);
} */

.k-slot-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.25rem 0.625rem;
  border-radius: 999px;
  font-size: 0.7rem;
  font-weight: 700;
  border-width: 1px;
}

.k-project-tag {
  display: inline-block;
  padding: 0.25rem 0.625rem;
  background-color: #f8fafc;
  border: 1px solid #f1f5f9;
  border-radius: 0.375rem;
  font-size: 0.7rem;
  font-weight: 600;
  color: #64748b;
  transition: all 0.2s;
}
.group:hover .k-project-tag {
  background-color: white;
  border-color: #e2e8f0;
}

.k-progress-bar {
  width: 0;
  animation: loadProgress 1.5s ease-out forwards;
}
@keyframes loadProgress {
  to {
    width: var(--progress);
  }
}

.k-perk-item {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.8rem;
  font-weight: 500;
  background-color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  border: 1px solid rgba(0, 0, 0, 0.04);
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}
.animate-float-slow {
  animation: float-slow 12s ease-in-out infinite;
}
.animate-float-strong {
  animation: float-strong 14s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}

@keyframes float {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0px);
  }
}
@keyframes float-slow {
  0% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(5deg);
  }
  100% {
    transform: translateY(0px) rotate(0deg);
  }
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

/* Base reveal state */
.reveal {
  opacity: 0;
  transform: translateY(28px);
  transition:
    opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1),
    transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  transition-delay: var(--delay, 0ms);
}
.reveal.is-visible {
  opacity: 1;
  transform: translateY(0);
}

/* Reveal from left */
.reveal-left {
  opacity: 0;
  transform: translateX(-28px);
  transition:
    opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1),
    transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  transition-delay: var(--delay, 0ms);
}
.reveal-left.is-visible {
  opacity: 1;
  transform: translateX(0);
}

/* Reveal from right */
.reveal-right {
  opacity: 0;
  transform: translateX(28px);
  transition:
    opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1),
    transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  transition-delay: var(--delay, 0ms);
}
.reveal-right.is-visible {
  opacity: 1;
  transform: translateX(0);
}

/* Reveal with scale */
.reveal-scale {
  opacity: 0;
  transform: scale(0.94);
  transition:
    opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1),
    transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  transition-delay: var(--delay, 0ms);
}
.reveal-scale.is-visible {
  opacity: 1;
  transform: scale(1);
}
</style>
