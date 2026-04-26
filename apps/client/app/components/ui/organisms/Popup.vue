<template>
  <Teleport to="body">
    <Transition name="popup-fade">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <!-- Backdrop -->
        <div
          class="absolute inset-0 bg-secondary-900/70 backdrop-blur-sm transition-opacity"
          @click="handleBackdropClick"
        ></div>

        <!-- Popup Dialog -->
        <div
          class="relative w-full max-w-sm overflow-hidden bg-white shadow-xl rounded-xl p-8 text-center"
        >
          <!-- Close Button (Optional) -->
          <button
            v-if="showClose"
            @click="close"
            class="absolute right-4 top-4 rounded-full p-1.5 hover:cursor-pointer text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-primary-400 transition-colors"
            aria-label="Tutup popup"
          >
            <svg
              class="h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <!-- Illustration -->
          <div
            class="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full"
            :class="iconContainerClass"
          >
            <!-- Info Icon -->
            <svg
              v-if="type === 'info'"
              class="h-8 w-8 text-primary-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
              />
            </svg>

            <!-- Success Icon -->
            <svg
              v-else-if="type === 'success'"
              class="h-8 w-8 text-success-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>

            <!-- Warning Icon -->
            <svg
              v-else-if="type === 'warning'"
              class="h-8 w-8 text-accent-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>

            <!-- Danger Icon -->
            <svg
              v-else-if="type === 'danger'"
              class="h-8 w-8 text-danger-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>

          <!-- Content -->
          <h3
            class="text-xl font-semibold tracking-tight text-secondary-900 leading-snug"
          >
            {{ title }}
          </h3>

          <!-- Safely rendered HTML description -->
          <div
            v-if="description"
            v-dompurify-html="description"
            class="mt-3 text-sm leading-relaxed text-neutral-500"
          ></div>

          <!-- Actions -->
          <div
            v-if="positiveLabel || negativeLabel"
            class="mt-8 flex gap-3"
            :class="{
              'flex-col w-full': !negativeLabel,
              'flex-row': negativeLabel
            }"
          >
            <!-- Negative Button -->
            <AtomicButton
              v-if="negativeLabel"
              variant="outline"
              @click="emit('negative')"
              class="flex-1"
            >
              {{ negativeLabel }}
            </AtomicButton>

            <!-- Positive Button -->
            <AtomicButton
              v-if="positiveLabel"
              variant="primary"
              @click="emit('positive')"
              :class="negativeLabel ? 'flex-1' : 'w-full'"
            >
              {{ positiveLabel }}
            </AtomicButton>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, watch, onUnmounted } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue: boolean
    title: string
    description?: string
    showClose?: boolean
    positiveLabel?: string
    negativeLabel?: string
    type?: 'info' | 'success' | 'warning' | 'danger'
    persistent?: boolean
  }>(),
  {
    showClose: false,
    type: 'info',
    persistent: false
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  positive: []
  negative: []
  close: []
}>()

const iconContainerClass = computed(() => {
  switch (props.type) {
    case 'success':
      return 'bg-success-50 ring-1 ring-success-200'
    case 'warning':
      return 'bg-accent-50 ring-1 ring-accent-200'
    case 'danger':
      return 'bg-danger-50 ring-1 ring-danger-200'
    case 'info':
    default:
      return 'bg-primary-50 ring-1 ring-primary-200'
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

onUnmounted(() => {
  if (typeof document !== 'undefined') {
    document.body.style.overflow = ''
  }
})
</script>

<style scoped>
.popup-fade-enter-active,
.popup-fade-leave-active {
  transition: all 0.2s ease;
}

.popup-fade-enter-from,
.popup-fade-leave-to {
  opacity: 0;
}

.popup-fade-enter-active .relative,
.popup-fade-leave-active .relative {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.popup-fade-enter-from .relative,
.popup-fade-leave-to .relative {
  transform: scale(0.95) translateY(10px);
}
</style>
