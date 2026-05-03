<script setup lang="ts">
export interface ContentListItem {
  label: string
  description?: string
  completed?: boolean
}

const props = withDefaults(
  defineProps<{
    items: ContentListItem[]
    modelValue?: number
    mode?: 'free' | 'stepper'
    sticky?: boolean
  }>(),
  {
    modelValue: 0,
    mode: 'free',
    sticky: true
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void
}>()

const isLocked = (index: number) => {
  if (props.mode === 'free') return false
  return index > props.modelValue
}

const handleClick = (index: number) => {
  if (!isLocked(index)) {
    emit('update:modelValue', index)
  }
}
</script>

<template>
  <div :class="sticky ? 'lg:sticky lg:top-24' : ''">
    <div class="bg-white rounded-2xl border border-neutral-200 shadow-sm p-2">
      <nav class="flex flex-col space-y-1" role="navigation">
        <button
          v-for="(item, index) in items"
          :key="index"
          type="button"
          class="group flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-150 text-left w-full"
          :class="[
            modelValue === index
              ? 'bg-primary-50 text-primary-700 border-l-2 border-primary-500'
              : isLocked(index)
              ? 'text-neutral-400 cursor-not-allowed'
              : 'text-neutral-600 hover:bg-neutral-50 hover:text-secondary-900 border-l-2 border-transparent'
          ]"
          :disabled="isLocked(index)"
          :aria-current="modelValue === index ? 'page' : undefined"
          @click="handleClick(index)"
        >
          <!-- Stepper number / check -->
          <span
            v-if="mode === 'stepper'"
            class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors"
            :class="[
              item.completed
                ? 'bg-success-100 text-success-700'
                : modelValue === index
                ? 'bg-primary-500 text-white'
                : isLocked(index)
                ? 'bg-neutral-100 text-neutral-400'
                : 'bg-neutral-200 text-neutral-600'
            ]"
          >
            <svg
              v-if="item.completed"
              class="h-3 w-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="3"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span v-else>{{ index + 1 }}</span>
          </span>

          <!-- Label + Description -->
          <span class="flex flex-col min-w-0">
            <span class="truncate">{{ item.label }}</span>
            <span
              v-if="item.description"
              class="mt-0.5 text-xs font-normal truncate"
              :class="
                modelValue === index
                  ? 'text-primary-500'
                  : isLocked(index)
                  ? 'text-neutral-300'
                  : 'text-neutral-400'
              "
            >
              {{ item.description }}
            </span>
          </span>
        </button>
      </nav>
    </div>
  </div>
</template>
