<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

const { logout: signOut, user } = useAuth()
const { getProfile } = useProfile()
const router = useRouter()

const isMobileMenuOpen = ref(false)
const isUserDropdownOpen = ref(false)
const mobileMenuRef = ref<HTMLElement | null>(null)
const mobileMenuButtonRef = ref<HTMLElement | null>(null)
const userMenuRef = ref<HTMLElement | null>(null)
const userProfile = ref<any>(null)

const profilePath = '/profile/me'

const displayName = computed(
  () => userProfile.value?.full_name || user.value?.name || 'User'
)

onMounted(async () => {
  if (user.value) {
    userProfile.value = await getProfile()
  }
})

useClickOutside(
  mobileMenuRef,
  () => {
    isMobileMenuOpen.value = false
  },
  mobileMenuButtonRef
)

useClickOutside(userMenuRef, () => {
  isUserDropdownOpen.value = false
})

const handleLogout = async () => {
  await signOut()
  router.push('/login')
}
</script>

<template>
  <div class="min-h-screen bg-neutral-50 font-sans text-neutral-900">
    <nav
      class="sticky top-0 z-50 border-b border-neutral-200 bg-white/90 backdrop-blur"
    >
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="flex h-16 items-center justify-between gap-6">
          <div class="flex items-center gap-8">
            <NuxtLink
              to="/home"
              class="flex items-center gap-2"
              aria-label="Kolaboria home"
            >
              <img src="~/assets/img/logo.svg" alt="Kolaboria" class="h-8" />
            </NuxtLink>

            <div class="hidden items-center gap-1 md:flex">
              <NuxtLink
                to="/home"
                class="rounded-lg px-3 py-2 font-label-1 text-secondary transition-colors hover:bg-neutral-100 hover:text-primary-700"
                active-class="bg-primary-50 text-primary-700"
              >
                Beranda
              </NuxtLink>
              <NuxtLink
                to="/projects/my-applications"
                class="rounded-lg px-3 py-2 font-label-1 text-secondary transition-colors hover:bg-neutral-100 hover:text-primary-700"
                active-class="bg-primary-50 text-primary-700"
              >
                Lamaranku
              </NuxtLink>
              <NuxtLink
                to="/projects/my-projects"
                class="rounded-lg px-3 py-2 font-label-1 text-secondary transition-colors hover:bg-neutral-100 hover:text-primary-700"
                active-class="bg-primary-50 text-primary-700"
              >
                Project Saya
              </NuxtLink>
              <NuxtLink
                :to="profilePath"
                class="rounded-lg px-3 py-2 font-label-1 text-secondary transition-colors hover:bg-neutral-100 hover:text-primary-700"
                active-class="bg-primary-50 text-primary-700"
              >
                Profil
              </NuxtLink>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <button
              type="button"
              class="relative rounded-lg p-2 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-secondary-700"
              aria-label="Notifikasi"
            >
              <span
                class="absolute right-2 top-2 h-2 w-2 rounded-full bg-danger-500 ring-2 ring-white"
              />
              <svg
                class="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </button>

            <div
              ref="userMenuRef"
              class="relative hidden border-l border-neutral-200 pl-4 md:block"
            >
              <button
                type="button"
                class="flex items-center gap-3 rounded-lg p-1 transition-colors hover:bg-neutral-50 focus:outline-none"
                @click="isUserDropdownOpen = !isUserDropdownOpen"
              >
                <div class="hidden text-right sm:block">
                  <p class="font-body-1 leading-none text-secondary-900">
                    {{ displayName }}
                  </p>
                  <p class="mt-1 font-label-2 text-secondary">
                    {{ user?.email }}
                  </p>
                </div>
                <AtomicAvatar
                  :src="userProfile?.avatar"
                  :name="displayName"
                  size="sm"
                  class="h-9! w-9!"
                />
              </button>

              <transition
                enter-active-class="transition ease-out duration-200"
                enter-from-class="scale-95 opacity-0"
                enter-to-class="scale-100 opacity-100"
                leave-active-class="transition ease-in duration-100"
                leave-from-class="scale-100 opacity-100"
                leave-to-class="scale-95 opacity-0"
              >
                <div
                  v-if="isUserDropdownOpen"
                  class="absolute right-0 z-50 mt-3 w-52 origin-top-right rounded-xl border border-neutral-200 bg-white py-2 shadow-lg shadow-secondary-900/10"
                >
                  <NuxtLink
                    :to="profilePath"
                    class="block px-4 py-2 font-body-2 transition-colors hover:bg-neutral-50 hover:text-secondary-900"
                  >
                    Profil Saya
                  </NuxtLink>
                  <a
                    href="#"
                    class="block px-4 py-2 font-body-2 transition-colors hover:bg-neutral-50 hover:text-secondary-900"
                  >
                    Pusat Bantuan
                  </a>
                  <AtomicButton
                    variant="ghost-danger"
                    @click="handleLogout"
                    class="w-full! justify-start! py-2! px-4!"
                  >
                    Keluar
                  </AtomicButton>
                </div>
              </transition>
            </div>

            <button
              ref="mobileMenuButtonRef"
              type="button"
              class="rounded-lg p-2 text-neutral-600 transition-colors hover:bg-neutral-100 md:hidden"
              aria-label="Menu"
              @click="isMobileMenuOpen = !isMobileMenuOpen"
            >
              <svg
                v-if="!isMobileMenuOpen"
                class="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              <svg
                v-else
                class="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <transition
        enter-active-class="transition ease-out duration-200"
        enter-from-class="-translate-y-2 opacity-0"
        enter-to-class="translate-y-0 opacity-100"
        leave-active-class="transition ease-in duration-150"
        leave-from-class="translate-y-0 opacity-100"
        leave-to-class="-translate-y-2 opacity-0"
      >
        <div
          v-show="isMobileMenuOpen"
          ref="mobileMenuRef"
          class="absolute left-0 right-0 border-b border-neutral-200 bg-white shadow-lg shadow-secondary-900/10 md:hidden"
        >
          <div class="space-y-1 px-4 pb-4 pt-2">
            <NuxtLink
              to="/home"
              class="block rounded-lg px-3 py-2 text-body font-medium text-neutral-700 hover:bg-neutral-50 hover:text-primary-700"
              active-class="bg-primary-50 text-primary-700"
              @click="isMobileMenuOpen = false"
            >
              Beranda
            </NuxtLink>
            <NuxtLink
              to="/projects/my-applications"
              class="block rounded-lg px-3 py-2 text-body font-medium text-neutral-700 hover:bg-neutral-50 hover:text-primary-700"
              active-class="bg-primary-50 text-primary-700"
              @click="isMobileMenuOpen = false"
            >
              Lamaranku
            </NuxtLink>
            <NuxtLink
              to="/projects/my-projects"
              class="block rounded-lg px-3 py-2 text-body font-medium text-neutral-700 hover:bg-neutral-50 hover:text-primary-700"
              active-class="bg-primary-50 text-primary-700"
              @click="isMobileMenuOpen = false"
            >
              Project Saya
            </NuxtLink>
            <NuxtLink
              :to="profilePath"
              class="block rounded-lg px-3 py-2 text-body font-medium text-neutral-700 hover:bg-neutral-50 hover:text-primary-700"
              active-class="bg-primary-50 text-primary-700"
              @click="isMobileMenuOpen = false"
            >
              Profil
            </NuxtLink>
            <div class="my-2 border-t border-neutral-200" />
            <a
              href="#"
              class="block rounded-lg px-3 py-2 text-body font-medium text-neutral-700 hover:bg-neutral-50 hover:text-primary-700"
            >
              Pusat Bantuan
            </a>
            <AtomicButton
              variant="ghost-danger"
              block
              class="!px-3 !py-2 !justify-start !font-body-2"
              @click="handleLogout"
            >
              Keluar
            </AtomicButton>
          </div>
        </div>
      </transition>
    </nav>

    <main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <slot />
    </main>
  </div>
</template>
