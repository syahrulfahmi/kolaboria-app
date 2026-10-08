<template>
  <Teleport to="body">
    <Transition name="bottom-sheet-fade">
      <div
        v-if="modelValue"
        class="fixed inset-0 overflow-hidden"
        :style="{ zIndex }"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="title ? titleId : undefined"
        @keydown.esc="handleEsc"
      >
        <!-- Backdrop Overlay -->
        <div
          class="fixed inset-0 bg-neutral-950/60 transition-opacity"
          @click="handleBackdropClick"
        />

        <!-- Positioning Container: Docked to bottom -->
        <div
          class="fixed inset-0 flex flex-col justify-end pointer-events-none"
        >
          <!-- Bottom Sheet Panel -->
          <div
            ref="panelRef"
            tabindex="-1"
            class="bottom-sheet-panel pointer-events-auto relative flex flex-col rounded-t-2xl sm:rounded-t-3xl bg-white shadow-2xl w-full sm:max-w-xl sm:mx-auto overflow-hidden"
            :style="{ maxHeight }"
            @click.stop
            @keydown.tab="handleTab"
          >
            <!-- Drag Handle Indicator -->
            <div
              v-if="showHandle"
              class="mx-auto w-12 h-1.5 bg-neutral-300 rounded-full mt-3 mb-1 shrink-0"
              aria-hidden="true"
            />

            <!-- Header -->
            <div
              class="px-5 py-3.5 flex items-center justify-between gap-4 border-b border-neutral-100 shrink-0"
            >
              <div class="flex-1 min-w-0">
                <slot name="header">
                  <h3
                    v-if="title"
                    :id="titleId"
                    class="font-title-3 font-bold text-neutral-900 leading-snug truncate"
                  >
                    {{ title }}
                  </h3>
                  <p
                    v-if="subtitle"
                    class="mt-0.5 font-body-3 text-neutral-500 truncate"
                  >
                    {{ subtitle }}
                  </p>
                </slot>
              </div>

              <!-- Header Actions / Close Button -->
              <div class="flex items-center gap-2 shrink-0">
                <slot name="header-actions">
                  <button
                    v-if="showClose"
                    type="button"
                    class="flex-shrink-0 hover:cursor-pointer p-1.5 rounded-full text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-400"
                    aria-label="Tutup panel"
                    @click="close"
                  >
                    <svg
                      class="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </slot>
              </div>
            </div>

            <!-- Body (Scrollable with mobile safe area bottom) -->
            <div class="min-h-0 flex-1 overflow-y-auto px-5 py-4">
              <slot />
            </div>

            <!-- Footer (Optional) -->
            <div
              v-if="$slots.footer || primaryLabel || secondaryLabel"
              class="px-5 py-3.5 bg-neutral-50/80 border-t border-neutral-100 flex items-center justify-end gap-3 shrink-0 pb-[calc(env(safe-area-inset-bottom)+0.875rem)]"
            >
              <slot name="footer">
                <AtomicButton
                  v-if="secondaryLabel"
                  :variant="secondaryVariant"
                  class="flex-1 sm:flex-initial"
                  @click="$emit('secondary')"
                >
                  {{ secondaryLabel }}
                </AtomicButton>

                <AtomicButton
                  v-if="primaryLabel"
                  :variant="primaryVariant"
                  :loading="primaryLoading"
                  :disabled="primaryLoading || primaryDisabled"
                  class="flex-1 sm:flex-initial"
                  @click="$emit('primary')"
                >
                  {{ primaryLabel }}
                </AtomicButton>
              </slot>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { nextTick, ref, useId, watch } from 'vue'
import { useOverlayScrollLock } from '../../../composables/useOverlayScrollLock'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  zIndex: {
    type: Number,
    default: 60
  },
  title: {
    type: String,
    default: ''
  },
  subtitle: {
    type: String,
    default: ''
  },
  persistent: {
    type: Boolean,
    default: false
  },
  showClose: {
    type: Boolean,
    default: true
  },
  showHandle: {
    type: Boolean,
    default: true
  },
  maxHeight: {
    type: String,
    default: '85dvh'
  },
  // Primary Action Props
  primaryLabel: {
    type: String,
    default: ''
  },
  primaryLoading: {
    type: Boolean,
    default: false
  },
  primaryDisabled: {
    type: Boolean,
    default: false
  },
  primaryVariant: {
    type: String,
    default: 'primary'
  },
  // Secondary Action Props
  secondaryLabel: {
    type: String,
    default: ''
  },
  secondaryVariant: {
    type: String,
    default: 'outline'
  }
})

const emit = defineEmits(['update:modelValue', 'close', 'primary', 'secondary'])
const titleId = useId()
const panelRef = ref<HTMLElement | null>(null)

const handleTab = (event: KeyboardEvent) => {
  const elements = Array.from(
    panelRef.value?.querySelectorAll<HTMLElement>(
      'button:not(:disabled), input:not(:disabled), a[href], [tabindex="0"]'
    ) ?? []
  ).filter((element) => element.getClientRects().length > 0)
  const first = elements[0]
  const last = elements[elements.length - 1]
  if (!first || !last) return
  const active = document.activeElement
  if (
    !(active instanceof HTMLElement) ||
    !elements.includes(active) ||
    (event.shiftKey && active === first) ||
    (!event.shiftKey && active === last)
  ) {
    event.preventDefault()
    const target = event.shiftKey ? last : first
    target.focus()
  }
}

const handleEsc = () => {
  if (!props.persistent) {
    close()
  }
}

watch(
  () => props.modelValue,
  async (open) => {
    if (open) {
      await nextTick()
      panelRef.value?.focus({ preventScroll: true })
    }
  },
  { immediate: true }
)

const close = () => {
  emit('update:modelValue', false)
  emit('close')
}

const handleBackdropClick = () => {
  if (!props.persistent) {
    close()
  }
}

useOverlayScrollLock(() => props.modelValue)
</script>

<style scoped>
/* Backdrop fade */
.bottom-sheet-fade-enter-active,
.bottom-sheet-fade-leave-active {
  transition: opacity 0.25s ease;
}
.bottom-sheet-fade-enter-from,
.bottom-sheet-fade-leave-to {
  opacity: 0;
}

/* Panel slide-up from bottom */
.bottom-sheet-fade-enter-active .bottom-sheet-panel,
.bottom-sheet-fade-leave-active .bottom-sheet-panel {
  transition: transform 0.32s cubic-bezier(0.16, 1, 0.3, 1);
}
.bottom-sheet-fade-enter-from .bottom-sheet-panel,
.bottom-sheet-fade-leave-to .bottom-sheet-panel {
  transform: translateY(100%);
}

@media (prefers-reduced-motion: reduce) {
  .bottom-sheet-fade-enter-active,
  .bottom-sheet-fade-leave-active,
  .bottom-sheet-fade-enter-active .bottom-sheet-panel,
  .bottom-sheet-fade-leave-active .bottom-sheet-panel {
    transition: none;
  }
}
</style>
