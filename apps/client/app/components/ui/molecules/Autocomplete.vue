<template>
  <div class="flex flex-col gap-1.5" ref="autocompleteRef">
    <label v-if="label" class="font-label-1">
      {{ label }}
      <span v-if="required" class="text-primary-400 text-base leading-none"
        >*</span
      >
    </label>

    <div class="relative" ref="triggerRef">
      <div
        class="flex min-h-[44px] w-full items-center gap-1.5 rounded-lg border bg-white px-3 py-2 transition-all duration-150 focus-within:ring-2 focus-within:ring-offset-1"
        :class="[
          error
            ? 'border-red-300 focus-within:border-red-400 focus-within:ring-red-200'
            : 'border-neutral-300 hover:border-primary-300 focus-within:border-primary-400 focus-within:ring-primary-200',
          disabled ? 'cursor-not-allowed bg-neutral-100 opacity-75' : ''
        ]"
      >
        <!-- Search Input -->
        <input
          type="text"
          v-model="searchQuery"
          @input="handleInput"
          @focus="handleFocus"
          :placeholder="placeholder"
          :disabled="disabled"
          class="w-full border-none bg-transparent p-0 pl-1 text-sm focus:outline-none focus:ring-0 text-neutral-900 placeholder:text-neutral-400"
        />

        <!-- Loading Spinner -->
        <div
          v-if="loading"
          class="animate-spin rounded-full h-4 w-4 border-2 border-primary-500 border-t-transparent mr-1"
        ></div>

        <!-- Clear Button -->
        <button
          v-if="searchQuery && !disabled"
          type="button"
          @click="clearSelection"
          class="text-neutral-400 hover:text-neutral-600 focus:outline-none mr-1"
        >
          <svg
            class="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <!-- Chevron Down / Up -->
        <svg
          class="h-5 w-5 text-neutral-400 transition-transform duration-200"
          :class="{ 'rotate-180 text-primary-400': isOpen }"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
          @click.stop="toggleDropdown"
        >
          <path
            fill-rule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clip-rule="evenodd"
          />
        </svg>
      </div>

      <!-- Suggestion List (Teleported) -->
      <Teleport to="body">
        <transition
          enter-active-class="transition-all ease-out duration-150"
          :enter-from-class="
            openUpward
              ? 'transform opacity-0 translate-y-3'
              : 'transform opacity-0 -translate-y-3'
          "
          enter-to-class="transform opacity-100 translate-y-0"
          leave-active-class="transition-all ease-in duration-150"
          leave-from-class="transform opacity-100 translate-y-0"
          :leave-to-class="
            openUpward
              ? 'transform opacity-0 translate-y-3'
              : 'transform opacity-0 -translate-y-3'
          "
        >
          <div
            v-if="isOpen && !disabled"
            ref="dropdownListRef"
            class="fixed z-[9999] max-h-60 overflow-auto rounded-xl bg-white shadow-lg shadow-secondary-900/10 ring-1 ring-black/5 focus:outline-none flex flex-col"
            :style="dropdownStyle"
          >
            <ul role="listbox" class="py-1.5 flex-1 overflow-y-auto">
              <!-- Loading Skeleton -->
              <template v-if="loading && options.length === 0">
                <li
                  v-for="i in 3"
                  :key="i"
                  class="py-2.5 px-4 flex items-center gap-3"
                >
                  <div
                    class="h-4 w-full bg-neutral-100 animate-pulse rounded-md"
                  ></div>
                </li>
              </template>

              <template v-else>
                <li
                  v-for="option in options"
                  :key="String(option.value)"
                  @click.stop="selectOption(option)"
                  class="relative cursor-pointer select-none py-2.5 pl-4 pr-9 text-sm text-neutral-800 transition-colors border-l-2"
                  :class="[
                    option.value === modelValue
                      ? 'bg-primary-50 text-primary-700 font-medium border-primary-500'
                      : 'border-transparent hover:bg-neutral-50 hover:text-neutral-900 hover:border-primary-300'
                  ]"
                  role="option"
                  :aria-selected="option.value === modelValue"
                >
                  <!-- We render highlighted label safely using v-html -->
                  <span
                    class="block truncate"
                    v-html="getHighlightedLabel(option.label)"
                  ></span>

                  <span
                    v-if="option.value === modelValue"
                    class="absolute inset-y-0 right-0 flex items-center pr-4 text-primary-500"
                  >
                    <svg
                      class="h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </span>
                </li>

                <li
                  v-if="options.length === 0"
                  class="py-3 px-4 text-sm text-neutral-500 text-center"
                >
                  {{ loading ? 'Mencari...' : 'Data tidak ditemukan' }}
                </li>
              </template>
            </ul>
          </div>
        </transition>
      </Teleport>
    </div>

    <!-- Error message -->
    <div v-if="error" class="flex items-center gap-1.5 mt-0.5">
      <svg
        class="h-3.5 w-3.5 text-red-500 shrink-0"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fill-rule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
          clip-rule="evenodd"
        />
      </svg>
      <span class="text-caption text-red-500">{{ error }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue'

interface AutocompleteOption {
  label: string
  value: string | number
}

const props = withDefaults(
  defineProps<{
    label?: string
    modelValue?: string | number | null
    options: AutocompleteOption[]
    placeholder?: string
    error?: string
    disabled?: boolean
    required?: boolean
    loading?: boolean
    initialLabel?: string
    debounceMs?: number
  }>(),
  {
    placeholder: 'Ketik untuk mencari...',
    debounceMs: 300,
    options: () => []
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: string | number | null]
  search: [query: string]
  select: [option: AutocompleteOption]
}>()

const isOpen = ref(false)
const searchQuery = ref('')
const autocompleteRef = ref<HTMLElement | null>(null)
const triggerRef = ref<HTMLElement | null>(null)
const dropdownListRef = ref<HTMLElement | null>(null)
const openUpward = ref(false)
const dropdownStyle = ref<Record<string, string>>({})

// Watch initialLabel for default display value
watch(
  () => props.initialLabel,
  (newLabel) => {
    if (newLabel) {
      searchQuery.value = newLabel
    }
  },
  { immediate: true }
)

// Helper to escape HTML characters to prevent XSS
function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

// Highlight matching query characters in the label
const getHighlightedLabel = (label: string) => {
  if (!searchQuery.value) return escapeHtml(label)

  // Split search query into search tokens, remove special characters to prevent regex breaking
  const cleanQuery = searchQuery.value
    .trim()
    .replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
  if (!cleanQuery) return escapeHtml(label)

  const regex = new RegExp(`(${cleanQuery})`, 'gi')
  return escapeHtml(label).replace(
    regex,
    '<span class="text-primary-600 font-bold">$1</span>'
  )
}

const DROPDOWN_MAX_HEIGHT = 240

const calculatePosition = () => {
  if (!triggerRef.value) return

  const rect = triggerRef.value.getBoundingClientRect()
  const spaceBelow = window.innerHeight - rect.bottom
  const spaceAbove = rect.top

  openUpward.value = spaceBelow < DROPDOWN_MAX_HEIGHT && spaceAbove > spaceBelow

  dropdownStyle.value = {
    position: 'fixed',
    left: `${rect.left}px`,
    width: `${rect.width}px`,
    zIndex: '9999',
    ...(openUpward.value
      ? { bottom: `${window.innerHeight - rect.top + 4}px` }
      : { top: `${rect.bottom + 4}px` })
  }
}

let debounceTimeout: any = null

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  searchQuery.value = target.value

  if (!target.value) {
    emit('update:modelValue', null)
  }

  if (!isOpen.value) {
    isOpen.value = true
  }

  calculatePosition()

  clearTimeout(debounceTimeout)
  debounceTimeout = setTimeout(() => {
    emit('search', target.value)
  }, props.debounceMs)
}

const handleFocus = () => {
  if (props.disabled) return
  isOpen.value = true
  calculatePosition()

  // Automatically trigger a search with the current value to load initial suggestions
  emit('search', searchQuery.value)
}

const toggleDropdown = () => {
  if (props.disabled) return
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    calculatePosition()
    emit('search', searchQuery.value)
  }
}

const selectOption = (option: AutocompleteOption) => {
  searchQuery.value = option.label
  isOpen.value = false
  emit('update:modelValue', option.value)
  emit('select', option)
}

const clearSelection = () => {
  searchQuery.value = ''
  isOpen.value = false
  emit('update:modelValue', null)
  emit('search', '')
}

// Click outside to close dropdown list
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as Node
  const isOutsideAutocomplete =
    autocompleteRef.value && !autocompleteRef.value.contains(target)
  const isOutsideList =
    dropdownListRef.value && !dropdownListRef.value.contains(target)

  if (isOutsideAutocomplete && isOutsideList) {
    isOpen.value = false

    // If no value was selected, reset search query to props value if exists
    if (!props.modelValue && !props.initialLabel) {
      searchQuery.value = ''
    } else if (props.modelValue) {
      const activeOption = props.options.find(
        (opt) => opt.value === props.modelValue
      )
      if (activeOption) {
        searchQuery.value = activeOption.label
      } else if (props.initialLabel) {
        searchQuery.value = props.initialLabel
      }
    }
  }
}

const handleScrollOrResize = () => {
  if (isOpen.value) {
    calculatePosition()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  window.addEventListener('scroll', handleScrollOrResize, true)
  window.addEventListener('resize', handleScrollOrResize)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  window.removeEventListener('scroll', handleScrollOrResize, true)
  window.removeEventListener('resize', handleScrollOrResize)
  clearTimeout(debounceTimeout)
})
</script>
