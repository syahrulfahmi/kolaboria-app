<script setup lang="ts">
import { nextTick, ref } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { Ellipsis, Pencil, Trash2 } from '@lucide/vue'

defineProps<{
  canEdit: boolean
  canDelete: boolean
  label: string
}>()

const emit = defineEmits<{
  edit: []
  delete: []
}>()

const rootRef = ref<HTMLElement | null>(null)
const menuRef = ref<HTMLElement | null>(null)
const isMenuOpen = ref(false)

onClickOutside(rootRef, () => {
  isMenuOpen.value = false
})

const focusTrigger = () => {
  rootRef.value?.querySelector<HTMLButtonElement>('[aria-haspopup="menu"]')?.focus()
}

const focusMenuItem = async (last = false) => {
  await nextTick()
  const items = menuRef.value?.querySelectorAll<HTMLButtonElement>('[role="menuitem"]')
  if (!items?.length) return
  items[last ? items.length - 1 : 0]?.focus()
}

const openMenu = (last = false) => {
  isMenuOpen.value = true
  void focusMenuItem(last)
}

const toggleMenu = (event: MouseEvent) => {
  event.stopPropagation()
  if (isMenuOpen.value) {
    isMenuOpen.value = false
    return
  }
  openMenu()
}

const handleTriggerKeydown = (event: KeyboardEvent) => {
  if (event.key === 'ArrowDown') {
    event.preventDefault()
    openMenu()
  } else if (event.key === 'ArrowUp') {
    event.preventDefault()
    openMenu(true)
  }
}

const handleMenuKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    event.preventDefault()
    isMenuOpen.value = false
    void nextTick(focusTrigger)
    return
  }

  if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return
  event.preventDefault()
  const items = [...(menuRef.value?.querySelectorAll<HTMLButtonElement>('[role="menuitem"]') ?? [])]
  if (!items.length) return

  const currentIndex = items.indexOf(document.activeElement as HTMLButtonElement)
  const nextIndex = event.key === 'Home'
    ? 0
    : event.key === 'End'
      ? items.length - 1
      : (currentIndex + (event.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length
  items[nextIndex]?.focus()
}

const handleFocusOut = (event: FocusEvent) => {
  if (!rootRef.value?.contains(event.relatedTarget as Node | null)) {
    isMenuOpen.value = false
  }
}

const selectAction = (action: 'edit' | 'delete') => {
  isMenuOpen.value = false
  if (action === 'edit') emit('edit')
  else emit('delete')
}
</script>

<template>
  <div ref="rootRef" class="relative shrink-0" @focusout="handleFocusOut">
    <AtomicIconButton
      variant="ghost"
      size="sm"
      class="min-h-11 min-w-11 text-neutral-500 hover:text-primary-700"
      :title="label"
      :aria-label="label"
      aria-haspopup="menu"
      :aria-expanded="isMenuOpen"
      @click="toggleMenu"
      @keydown="handleTriggerKeydown"
    >
      <Ellipsis class="h-5 w-5" aria-hidden="true" />
    </AtomicIconButton>

    <Transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="scale-95 opacity-0"
      enter-to-class="scale-100 opacity-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="scale-100 opacity-100"
      leave-to-class="scale-95 opacity-0"
    >
      <div
        v-if="isMenuOpen"
        ref="menuRef"
        role="menu"
        :aria-label="label"
        class="absolute right-0 z-30 mt-1.5 w-40 origin-top-right rounded-lg border border-neutral-200 bg-white p-1 shadow-lg"
        @keydown="handleMenuKeydown"
      >
        <button
          v-if="canEdit"
          type="button"
          role="menuitem"
          class="flex min-h-10 w-full items-center gap-2 rounded-md px-2.5 text-left font-body-3 text-secondary-800 hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
          @click="selectAction('edit')"
        >
          <Pencil class="h-4 w-4 text-neutral-500" aria-hidden="true" />
          Edit
        </button>
        <button
          v-if="canDelete"
          type="button"
          role="menuitem"
          class="flex min-h-10 w-full items-center gap-2 rounded-md px-2.5 text-left font-body-3 text-danger-700 hover:bg-danger-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger-500"
          @click="selectAction('delete')"
        >
          <Trash2 class="h-4 w-4" aria-hidden="true" />
          Hapus
        </button>
      </div>
    </Transition>
  </div>
</template>
