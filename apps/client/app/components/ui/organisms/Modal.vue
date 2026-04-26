<template>
  <ClientOnly>
    <Teleport to="body">
      <Transition name="modal-fade">
        <div
          v-if="modelValue"
          class="fixed inset-0 z-50 overflow-y-auto"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <!-- Backdrop -->
          <div
            class="fixed inset-0 bg-secondary-900/70 transition-opacity backdrop-blur-sm"
            @click="handleBackdropClick"
          ></div>

          <div
            class="flex min-h-screen items-center justify-center p-4 text-center sm:p-0"
          >
            <div
              class="relative transform overflow-hidden rounded-xl bg-white text-left shadow-xl w-full sm:my-8"
              :class="sizeClass"
              @click.stop
            >
              <!-- Header -->
              <div class="py-3 px-5 flex items-start justify-between gap-4">
                <div class="w-full">
                  <h3
                    class="text-lg font-semibold text-secondary-900 leading-snug"
                    id="modal-title"
                    v-if="title"
                  >
                    {{ title }}
                  </h3>
                  <div
                    class="mt-1 text-sm text-neutral-500"
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

              <hr class="border-neutral-200" />

              <!-- Body -->
              <div class="p-5 max-h-[60vh] overflow-y-auto">
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
                      @click="$emit('secondary')"
                      variant="outline"
                      class="w-full sm:w-auto"
                    >
                      {{ secondaryLabel }}
                    </AtomicButton>

                    <!-- Primary Action -->
                    <AtomicButton
                      v-if="primaryLabel"
                      @click="$emit('primary')"
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
  </ClientOnly>
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

const emit = defineEmits(['update:modelValue', 'close', 'primary', 'secondary'])

const sizeClass = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'sm:max-w-sm'
    case 'lg':
      return 'sm:max-w-lg'
    case 'xl':
      return 'sm:max-w-2xl'
    case 'md':
    default:
      return 'sm:max-w-md'
  }
})

const close = () => {
  emit('update:modelValue', false)
  emit('close')
}

const handleBackdropClick = () => {
  if (!props.persistent) {
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
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: all 0.2s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active .relative,
.modal-fade-leave-active .relative {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.modal-fade-enter-from .relative,
.modal-fade-leave-to .relative {
  transform: scale(0.95) translateY(10px);
}
</style>
