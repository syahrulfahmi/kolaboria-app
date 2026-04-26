<script setup lang="ts">
const { signOut, user } = useAuth()

const router = useRouter()
const isMobileMenuOpen = ref(false)
const isUserDropdownOpen = ref(false)

const mobileMenuRef = ref(null)
const mobileMenuButtonRef = ref(null)
const userMenuRef = ref(null)

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

const handleLogout = () => {
  signOut()

  router.push('/login')
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 font-sans">
    <!-- Top Navigation -->
    <nav
      class="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center gap-8">
            <!-- Logo -->
            <NuxtLink to="/home" class="flex items-center gap-2">
              <img src="~/assets/img/logo.svg" alt="Logo" class="h-8" />
            </NuxtLink>

            <!-- Desktop Navigation -->
            <div class="hidden md:flex items-center gap-1">
              <NuxtLink
                to="/home"
                class="px-3 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50 hover:text-primary-600 transition-colors"
                active-class="bg-primary-50 text-primary-600"
              >
                Beranda
              </NuxtLink>
              <NuxtLink
                to="/my-applications"
                class="px-3 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50 hover:text-primary-600 transition-colors"
                active-class="bg-primary-50 text-primary-600"
              >
                Lamaranku
              </NuxtLink>
              <NuxtLink
                to="/profile"
                class="px-3 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50 hover:text-primary-600 transition-colors"
                active-class="bg-primary-50 text-primary-600"
              >
                Profil
              </NuxtLink>
            </div>
          </div>

          <!-- Right Side Actions -->
          <div class="flex items-center gap-4">
            <!-- Notifications -->
            <button
              class="p-2 text-gray-400 hover:text-gray-600 transition-colors relative"
            >
              <span
                class="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"
              ></span>
              <svg
                class="w-6 h-6"
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

            <!-- User Menu -->
            <div
              ref="userMenuRef"
              class="hidden md:block relative ml-4 pl-4 border-l border-gray-200"
            >
              <button
                @click="isUserDropdownOpen = !isUserDropdownOpen"
                class="flex items-center gap-3 focus:outline-none"
              >
                <div class="hidden sm:block text-right">
                  <p class="text-sm font-semibold text-gray-900 leading-none">
                    {{ user?.user_metadata?.full_name }}
                  </p>
                  <p class="text-xs text-gray-500 mt-1">
                    {{ user?.email }}
                  </p>
                </div>
                <div
                  class="w-9 h-9 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-white shadow-sm overflow-hidden ring-1 ring-gray-100 transition-ring hover:ring-primary-200"
                >
                  <img
                    :src="`https://ui-avatars.com/api/?name=${user?.user_metadata?.full_name}&background=random&color=ffffff`"
                    alt="User"
                    class="w-full h-full object-cover"
                  />
                </div>
              </button>

              <!-- Desktop Dropdown -->
              <transition
                enter-active-class="transition ease-out duration-200"
                enter-from-class="transform opacity-0 scale-95"
                enter-to-class="transform opacity-100 scale-100"
                leave-active-class="transition ease-in duration-75"
                leave-from-class="transform opacity-100 scale-100"
                leave-to-class="transform opacity-0 scale-95"
              >
                <div
                  v-if="isUserDropdownOpen"
                  class="absolute right-0 mt-4 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 origin-top-right"
                >
                  <a
                    href="#"
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >Pusat Bantuan</a
                  >
                  <button
                    @click="handleLogout"
                    class="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Keluar
                  </button>
                </div>
              </transition>
            </div>

            <!-- Mobile Menu Button -->
            <button
              ref="mobileMenuButtonRef"
              @click="isMobileMenuOpen = !isMobileMenuOpen"
              class="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg
                v-if="!isMobileMenuOpen"
                class="w-6 h-6"
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
                class="w-6 h-6"
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

      <!-- Mobile Menu -->
      <transition
        enter-active-class="transition ease-out duration-300"
        enter-from-class="opacity-0 -translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition ease-in duration-200"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-2"
      >
        <div
          v-show="isMobileMenuOpen"
          ref="mobileMenuRef"
          class="md:hidden absolute left-0 right-0 border-b border-gray-100 bg-white shadow-lg"
        >
          <div class="px-4 pt-2 pb-4 space-y-1">
            <NuxtLink
              to="/home"
              class="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50"
              active-class="bg-primary-50 text-primary-600"
              @click="isMobileMenuOpen = false"
            >
              Beranda
            </NuxtLink>
            <NuxtLink
              to="/my-applications"
              class="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50"
              active-class="bg-primary-50 text-primary-600"
              @click="isMobileMenuOpen = false"
            >
              Lamaranku
            </NuxtLink>
            <NuxtLink
              to="/profile"
              class="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50"
              active-class="bg-primary-50 text-primary-600"
              @click="isMobileMenuOpen = false"
            >
              Profil
            </NuxtLink>

            <div class="border-t border-gray-100 my-2"></div>
            <a
              href="#"
              class="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50"
            >
              Pusat Bantuan
            </a>
            <button
              @click="handleLogout"
              class="w-full text-left block px-3 py-2 rounded-lg text-base font-medium text-red-600 hover:bg-red-50"
            >
              Keluar
            </button>
          </div>
        </div>
      </transition>
    </nav>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <slot />
    </main>
  </div>
</template>

<style scoped>
/* Add any layout-specific styles here */
</style>
