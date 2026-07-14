<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 overflow-hidden"
        aria-labelledby="modal-title"
        role="dialog"
        aria-modal="true"
      >
        <!-- Backdrop: no blur, solid dark overlay -->
        <div
          class="fixed inset-0 bg-neutral-950/60 transition-opacity"
          @click="handleBackdropClick"
        ></div>

        <!-- On mobile: align to bottom; on desktop: center -->
        <div
          class="flex min-h-screen items-end justify-center sm:items-center p-0 sm:p-4 text-center"
        >
          <div
            class="modal-panel relative flex flex-col transform overflow-hidden rounded-t-2xl sm:rounded-xl bg-white text-left shadow-xl w-full sm:my-8"
            :class="sizeClass"
            @click.stop
          >
            <!-- Mobile drag handle -->
            <div
              class="mx-auto w-12 h-1.5 bg-neutral-200 rounded-full mt-3 mb-1 shrink-0 sm:hidden"
            />
            <!-- Header -->
            <div class="py-3 px-5 flex items-start justify-between gap-4">
              <div class="w-full">
                <h3
                  class="font-title-3 leading-snug"
                  id="modal-title"
                  v-if="title"
                >
                  {{ title }}
                </h3>
                <div
                  class="font-paragraph-2 text-secondary mt-1"
                  v-if="subtitle || $slots.description"
                >
                  <slot name="description">
                    <p>{{ subtitle }}</p>
                  </slot>
                </div>
              </div>

              <!-- Close Button -->
              <button
                v-if="showClose"
                @click="close"
                class="flex-shrink-0 hover:cursor-pointer p-1.5 rounded-full text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-400"
                aria-label="Close modal"
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
            </div>

            <hr class="border-neutral-200" v-if="showClose" />

            <!-- Body -->
            <div class="p-5 max-h-[60vh] sm:max-h-[60vh] overflow-y-auto">
              <slot></slot>
            </div>

            <!-- Footer -->
            <div v-if="$slots.footer || primaryLabel || secondaryLabel">
              <hr class="border-neutral-200" />
              <div
                class="py-3 px-5 flex items-center gap-3 w-full"
                :class="
                  primaryLabel && !secondaryLabel
                    ? 'justify-center'
                    : 'justify-end'
                "
              >
                <slot name="footer">
                  <!-- Secondary Action -->
                  <AtomicButton
                    v-if="secondaryLabel"
                    @click="$emit('onSecondaryClick')"
                    variant="outline"
                    class="w-full sm:w-auto"
                  >
                    {{ secondaryLabel }}
                  </AtomicButton>

                  <!-- Primary Action -->
                  <AtomicButton
                    v-if="primaryLabel"
                    @click="$emit('onPrimaryClick')"
                    :variant="primaryVariant"
                    :loading="primaryLoading"
                    :disabled="primaryLoading || primaryDisabled"
                    :block="!secondaryLabel"
                    class="w-full sm:w-auto"
                  >
                    {{ primaryLabel }}
                  </AtomicButton>
                </slot>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { watch, onUnmounted, computed } from 'vue'

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
  size: {
    type: String,
    default: 'md',
    validator: (val: string) => ['sm', 'md', 'lg', 'xl'].includes(val)
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

const emit = defineEmits(['update:modelValue', 'close', 'onPrimaryClick', 'onSecondaryClick'])

const sizeClass = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'sm:max-w-lg'
    case 'md':
      return 'sm:max-w-xl'
    case 'lg':
      return 'sm:max-w-3xl'
    case 'xl':
      return 'sm:max-w-5xl'
    default:
      return 'sm:max-w-xl'
  }
})

const close = () => {
  emit('update:modelValue', false)
  emit('close')
}

const handleBackdropClick = () => {
  if (!props.persistent && props.showClose) {
    close()
  }
}

// Lock body scroll when modal is open
watch(
  () => props.modelValue,
  (isOpen) => {
    if (typeof document !== 'undefined') {
      if (isOpen) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = ''
      }
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
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.25s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

/* Mobile (default): slide up from bottom */
.modal-fade-enter-active .modal-panel,
.modal-fade-leave-active .modal-panel {
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}
.modal-fade-enter-from .modal-panel,
.modal-fade-leave-to .modal-panel {
  transform: translateY(100%);
}

/* Desktop (sm+): zoom + slight translateY */
@media (min-width: 640px) {
  .modal-fade-enter-active .modal-panel,
  .modal-fade-leave-active .modal-panel {
    transition:
      transform 0.3s cubic-bezier(0.16, 1, 0.3, 1),
      opacity 0.25s ease;
  }
  .modal-fade-enter-from .modal-panel,
  .modal-fade-leave-to .modal-panel {
    transform: scale(0.95) translateY(10px);
    opacity: 0;
  }
}
</style>
