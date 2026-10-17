<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { ArrowLeft } from '@lucide/vue'
import type { Profile } from '~/types/profile'

const props = defineProps<{
  projectSlug: string
  projectTitle: string
  userName: string | null
  viewerRoleLabel: string
}>()

const { user, logout } = useAuth()
const { getProfile } = useProfile()
const router = useRouter()
const userMenuRef = ref<HTMLElement | null>(null)
const isUserDropdownOpen = ref(false)
const userProfile = ref<Profile | null>(null)
const profilePath = '/profile/me'

const displayName = computed(
  () => userProfile.value?.full_name || props.userName || user.value?.name || 'User',
)

onMounted(() => {
  void getProfile().then((profile) => {
    userProfile.value = profile
  }).catch(() => {
    // Navbar identity remains available from the authenticated session.
  })
})

useClickOutside(userMenuRef, () => {
  isUserDropdownOpen.value = false
})

const toggleUserDropdown = () => {
  isUserDropdownOpen.value = !isUserDropdownOpen.value
}

const closeUserDropdown = () => {
  isUserDropdownOpen.value = false
}

const handleLogout = async () => {
  closeUserDropdown()
  await logout()
  await router.push('/login')
}
</script>

<template>
  <header
    class="sticky top-0 z-30 flex min-h-16 items-center justify-between gap-3 border-b border-neutral-200 bg-white/95 px-4 backdrop-blur sm:px-6 lg:px-7"
  >
    <nav
      class="flex min-w-0 flex-1 items-center gap-2 font-body-3 text-neutral-500"
      aria-label="Breadcrumb workspace"
    >
      <NuxtLink
        :to="`/projects/${encodeURIComponent(projectSlug)}`"
        class="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-secondary-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
        aria-label="Kembali ke detail proyek"
        title="Kembali ke detail proyek"
      >
        <ArrowLeft class="h-4 w-4" aria-hidden="true" />
      </NuxtLink>
      <div class="flex min-w-0 items-center gap-1.5">
        <span class="hidden sm:inline">Kolaboria</span>
        <span class="hidden sm:inline" aria-hidden="true">/</span>
        <span class="shrink-0">Workspace</span>
        <span aria-hidden="true">/</span>
        <span
          v-if="projectTitle"
          class="truncate font-label-3 text-secondary-900"
        >
          {{ projectTitle }}
        </span>
      </div>
    </nav>

    <div ref="userMenuRef" class="relative flex shrink-0 items-center">
      <button
        type="button"
        class="flex items-center gap-2 rounded-lg p-1 transition-colors hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 sm:gap-3"
        :aria-label="`Menu pengguna ${displayName}`"
        aria-haspopup="menu"
        :aria-expanded="isUserDropdownOpen"
        @click="toggleUserDropdown"
        @keydown.esc="closeUserDropdown"
      >
        <span class="hidden min-w-0 text-right sm:block">
          <span class="block max-w-40 truncate font-body-1 leading-none text-secondary-900">
            {{ displayName }}
          </span>
          <span class="mt-1 block max-w-40 truncate font-label-2 text-secondary">
            {{ viewerRoleLabel }}
          </span>
        </span>
        <AtomicAvatar
          :src="userProfile?.avatar ?? undefined"
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
          class="absolute right-0 top-full z-50 mt-3 w-56 origin-top-right rounded-xl border border-neutral-200 bg-white py-2 shadow-lg shadow-secondary-900/10"
          role="menu"
          aria-label="Menu pengguna"
          @keydown.esc="closeUserDropdown"
        >
          <div class="border-b border-neutral-100 px-4 pb-2">
            <p class="truncate font-label-2 text-secondary-900">{{ displayName }}</p>
            <p class="truncate font-body-3 text-neutral-500">{{ user?.email }}</p>
          </div>
          <NuxtLink
            :to="profilePath"
            role="menuitem"
            class="block px-4 py-2 font-body-2 transition-colors hover:bg-neutral-50 hover:text-secondary-900 focus-visible:bg-neutral-50 focus-visible:outline-none"
            @click="closeUserDropdown"
          >
            Profil Saya
          </NuxtLink>
          <a
            href="#"
            role="menuitem"
            class="block px-4 py-2 font-body-2 transition-colors hover:bg-neutral-50 hover:text-secondary-900 focus-visible:bg-neutral-50 focus-visible:outline-none"
            @click.prevent="closeUserDropdown"
          >
            Pusat Bantuan
          </a>
          <AtomicButton
            variant="ghost-danger"
            role="menuitem"
            class="w-full! justify-start! px-4! py-2!"
            @click="handleLogout"
          >
            Keluar
          </AtomicButton>
        </div>
      </transition>
    </div>
  </header>
</template>
