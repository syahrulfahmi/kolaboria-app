<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue'
import {
  PROFILE_EDIT_MENU_ITEMS,
  PROFILE_EDIT_ROOT_PATH
} from '~/data/profile-edit-navigation'

const router = useRouter()
const route = useRoute()

const menuItems = PROFILE_EDIT_MENU_ITEMS.map((item) => ({
  label: item.menuLabel,
  description: item.description,
  icon: item.icon
}))

let desktopMediaQuery: MediaQueryList | null = null

const redirectDesktopToBasic = () => {
  if (route.path === PROFILE_EDIT_ROOT_PATH && desktopMediaQuery?.matches) {
    void navigateTo(PROFILE_EDIT_MENU_ITEMS[0].path, { replace: true })
  }
}

const handleMenuSelection = (index: number) => {
  const item = PROFILE_EDIT_MENU_ITEMS[index]
  if (item) void router.push(item.path)
}

onMounted(() => {
  desktopMediaQuery = window.matchMedia('(min-width: 1024px)')
  redirectDesktopToBasic()
  desktopMediaQuery.addEventListener('change', redirectDesktopToBasic)
})

onBeforeUnmount(() => {
  desktopMediaQuery?.removeEventListener('change', redirectDesktopToBasic)
})
</script>

<template>
  <section
    class="-mx-4 -mt-4 border-y border-neutral-100 bg-white lg:hidden"
    aria-labelledby="profile-edit-title"
  >
    <header class="border-b border-neutral-100 px-3 pb-4 pt-6">
      <h1 id="profile-edit-title" class="font-title-2 text-secondary-900">
        Edit Profil
      </h1>
      <p class="mt-1 font-body-3 leading-5 text-secondary/80">
        Kelola informasi yang membantu orang lain mengenal kemampuan, karya, dan
        pengalamanmu.
      </p>
    </header>

    <OrganismContentList
      :items="menuItems"
      :model-value="-1"
      mode="free"
      layout="rows"
      :sticky="false"
      @update:model-value="handleMenuSelection"
    />
  </section>
</template>
