<template>
  <div
    class="bg-white rounded-xl border border-black/[.07] overflow-hidden transition-shadow duration-300"
    :class="isOpen ? 'shadow-sm' : ''"
  >
    <!-- Trigger -->
    <button
      type="button"
      class="w-full flex items-center justify-between gap-4 px-5 py-4 hover:cursor-pointer text-left transition-colors duration-200 hover:bg-neutral-50/80 group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-200"
      @click="toggle"
      :aria-expanded="isOpen"
    >
      <span
        class="text-neutral-700 font-medium text-[0.9rem] group-hover:text-primary-500 transition-colors duration-200"
      >
        {{ title }}
      </span>

      <span
        :class="[
          'w-6 h-6 rounded-full flex items-center justify-center shrink-0',
          'border border-black/[.08] text-neutral-400',
          'transition-all duration-300 ease-[cubic-bezier(.4,0,.2,1)]',
          isOpen
            ? 'rotate-180 bg-primary-50 border-primary-200 text-primary-500'
            : ''
        ]"
      >
        <svg
          class="w-3.5 h-3.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          stroke-width="2.5"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </span>
    </button>

    <!-- Slide-down Content -->
    <div
      :class="[
        'grid transition-all duration-300 ease-[cubic-bezier(.4,0,.2,1)]',
        isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
      ]"
    >
      <div class="overflow-hidden">
        <div class="border-t border-black/[.05] mx-5"></div>
        <div class="px-5 py-4 text-neutral-700 text-sm leading-relaxed">
          <!-- Slot kustom (prioritas utama) -->
          <slot>
            <!-- Fallback: render HTML aman via v-dompurify-html -->
            <div v-if="content" v-dompurify-html="content" />
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject, computed } from 'vue'
import { buildVueDompurifyHTMLDirective } from 'vue-dompurify-html'

const vDompurifyHtml = buildVueDompurifyHTMLDirective()

const props = defineProps<{
  title: string
  content?: string
  index: number
}>()

const accordion = inject<{
  activeItems: Set<number>
  toggle: (index: number) => void
}>('accordion')!

const isOpen = computed(() => accordion.activeItems.has(props.index))

const toggle = () => accordion.toggle(props.index)
</script>
