<template>
  <nav
    id="navbar"
    :class="[
      'fixed top-0 inset-x-0 z-50',
      'transition-all duration-500 ease-[cubic-bezier(.4,0,.2,1)]',
      isScrolled
        ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-black/[.06]'
        : 'bg-transparent'
    ]"
  >
    <div class="k-container flex items-center justify-between h-[68px]">
      <NuxtLink to="/" class="flex items-center gap-2.5 group">
        <img
          src="~/assets/img/logo.svg"
          alt="Logo"
          :class="isScrolled ? 'h-8' : 'h-10 bg-white p-2 rounded-lg'"
        />
      </NuxtLink>

      <div class="hidden md:flex items-center gap-7">
        <a
          v-for="link in navLinks"
          :key="link.id"
          :href="`#${link.id}`"
          @click.prevent="scrollTo(`#${link.id}`)"
          :class="[
            'text-sm font-medium transition-colors duration-300 relative group',
            isScrolled
              ? 'text-primary-600 hover:text-primary-800'
              : 'text-white/75 hover:text-white'
          ]"
        >
          {{ link.label }}

          <span
            class="absolute -bottom-0.5 left-0 w-0 h-px bg-primary-400 group-hover:w-full transition-all duration-300 ease-out"
          ></span>
        </a>
      </div>

      <div class="flex items-center gap-2.5">
        <NuxtLink
          to="/login"
          :class="[
            'hidden sm:inline-flex text-sm font-semibold px-4 py-2 rounded-lg transition-colors duration-300',
            isScrolled
              ? 'text-primary-400 hover:text-primary-500'
              : 'text-white/80 hover:text-white'
          ]"
        >
          Masuk
        </NuxtLink>
        <NuxtLink to="/register" class="inline-flex">
          <AtomicButton variant="primary" size="sm" rounded="lg">
            Daftar Gratis
          </AtomicButton>
        </NuxtLink>

        <button
          @click="mobileOpen = !mobileOpen"
          :class="[
            'md:hidden p-2 rounded-lg transition-colors duration-200',
            isScrolled
              ? 'text-secondary-400 hover:bg-gray-100'
              : 'text-white hover:bg-white/10'
          ]"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            stroke-width="2"
          >
            <path
              v-if="!mobileOpen"
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
            <path
              v-else
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>

    <transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div
        v-show="mobileOpen"
        class="md:hidden bg-white border-b border-black/[.06] shadow-lg"
      >
        <div class="k-container py-4 flex flex-col gap-1">
          <a
            v-for="link in navLinks"
            :key="link.id"
            :href="`#${link.id}`"
            @click.prevent="handleScrollTo(link.id)"
            class="px-3 py-2.5 text-sm font-medium text-secondary-400 hover:text-secondary-500 hover:bg-gray-50 rounded-lg transition-colors duration-200"
          >
            {{ link.label }}
          </a>
          <div class="k-rule mt-2 mb-3"></div>
          <NuxtLink
            to="/login"
            class="px-3 py-2.5 text-sm font-medium text-secondary-400 hover:bg-gray-50 rounded-lg"
            >Masuk</NuxtLink
          >
          <NuxtLink to="/register" class="inline-flex">
            <AtomicButton
              variant="primary"
              size="sm"
              rounded="lg"
              class="w-full"
            >
              Daftar Gratis
            </AtomicButton>
          </NuxtLink>
        </div>
      </div>
    </transition>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const isScrolled = ref(false)
const mobileOpen = ref(false)

const handleScroll = () => {
  isScrolled.value = window.scrollY > 32
}

const scrollTo = (selector: string) => {
  const el = document.querySelector(selector)
  if (!el) return
  window.scrollTo({
    top: el.getBoundingClientRect().top + window.scrollY - 72,
    behavior: 'smooth'
  })
}

const handleScrollTo = (link: string) => {
  scrollTo(`#${link}`)
  mobileOpen.value = false
}

onMounted(() => window.addEventListener('scroll', handleScroll))
onUnmounted(() => window.removeEventListener('scroll', handleScroll))

const navLinks = [
  { id: 'problem', label: 'Masalah & Solusi' },
  { id: 'how', label: 'Cara Kerja' },
  { id: 'features', label: 'Fitur' },
  { id: 'faq', label: 'FAQ' }
]
</script>
