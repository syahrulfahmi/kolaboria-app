<template>
  <Teleport to="body">
    <Transition name="drawer-fade">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-[60] overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        <!-- Backdrop: no blur, darker overlay -->
        <div
          class="fixed inset-0 bg-neutral-950/60 transition-opacity"
          @click="handleBackdropClick"
        />

        <!-- Positioning container: bottom on mobile, right on desktop -->
        <div
          class="fixed inset-0 flex items-end sm:items-stretch sm:justify-end pointer-events-none"
        >
          <!-- Panel -->
          <div
            class="drawer-panel pointer-events-auto relative flex flex-col bg-white shadow-2xl w-full max-h-[85vh] sm:max-h-none sm:h-full sm:max-w-xl overflow-hidden"
            @click.stop
          >
            <!-- Mobile drag handle indicator -->
            <div
              class="mx-auto w-12 h-1.5 bg-neutral-200 rounded-full mt-3 mb-1 shrink-0 sm:hidden"
            />

            <!-- Header -->
            <div
              class="px-5 py-4 flex items-center justify-between gap-4 border-b border-neutral-100 shrink-0"
            >
              <div class="flex-1 min-w-0">
                <slot name="header">
                  <h3
                    v-if="title"
                    class="text-base font-bold text-neutral-900 leading-snug truncate"
                  >
                    {{ title }}
                  </h3>
                  <p
                    v-if="subtitle"
                    class="mt-0.5 text-xs text-neutral-500 truncate"
                  >
                    {{ subtitle }}
                  </p>
                </slot>
              </div>

              <!-- Header Actions -->
              <div class="flex items-center gap-2 shrink-0">
                <slot name="header-actions">
                  <button
                    v-if="showClose"
                    @click="close"
                    class="flex-shrink-0 hover:cursor-pointer p-1.5 rounded-md text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-400"
                    aria-label="Close"
                  >
                    <svg
                      class="h-5 w-5"
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
                </slot>
              </div>
            </div>

            <!-- Body (scrollable) -->
            <div class="flex-1 overflow-y-auto">
              <slot />
            </div>

            <!-- Footer -->
            <div
              v-if="$slots.footer || primaryLabel || secondaryLabel"
              class="px-5 py-4 bg-neutral-50 border-t border-neutral-100 flex items-center justify-end gap-3 shrink-0"
            >
              <slot name="footer">
                <AtomicButton
                  v-if="secondaryLabel"
                  @click="$emit('secondary')"
                  variant="outline"
                  class="w-full sm:w-auto"
                >
                  {{ secondaryLabel }}
                </AtomicButton>

                <AtomicButton
                  v-if="primaryLabel"
                  @click="$emit('primary')"
                  :variant="primaryVariant"
                  :loading="primaryLoading"
                  :disabled="primaryLoading || primaryDisabled"
                  class="w-full sm:w-auto"
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
import { watch, onUnmounted } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
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
  }
})

const emit = defineEmits(['update:modelValue', 'close', 'primary', 'secondary'])

const close = () => {
  emit('update:modelValue', false)
  emit('close')
}

const handleBackdropClick = () => {
  if (!props.persistent) {
    close()
  }
}

// Lock body scroll when drawer is open
watch(
  () => props.modelValue,
  (isOpen) => {
    if (typeof document !== 'undefined') {
      document.body.style.overflow = isOpen ? 'hidden' : ''
    }
  }
)

// Prevent scroll lock from persisting if component unmounts while open
onUnmounted(() => {
  if (typeof document !== 'undefined') {
    document.body.style.overflow = ''
  }
})
</script>

<style scoped>
/* Backdrop fade */
.drawer-fade-enter-active,
.drawer-fade-leave-active {
  transition: opacity 0.3s ease;
}
.drawer-fade-enter-from,
.drawer-fade-leave-to {
  opacity: 0;
}

/* Mobile: panel slides up from bottom */
.drawer-fade-enter-active .drawer-panel,
.drawer-fade-leave-active .drawer-panel {
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}
.drawer-fade-enter-from .drawer-panel,
.drawer-fade-leave-to .drawer-panel {
  transform: translateY(100%);
}

/* Desktop: panel slides in from the right */
@media (min-width: 640px) {
  .drawer-fade-enter-from .drawer-panel,
  .drawer-fade-leave-to .drawer-panel {
    transform: translateX(100%);
  }
}
</style>
