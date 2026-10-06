<script setup lang="ts">
export interface ContentListItem {
  label: string
  description?: string
  completed?: boolean
  icon?: string
}

const props = withDefaults(
  defineProps<{
    items: ContentListItem[]
    modelValue?: number
    mode?: 'free' | 'stepper'
    sticky?: boolean
    layout?: 'default' | 'rows'
  }>(),
  {
    modelValue: 0,
    mode: 'free',
    sticky: true,
    layout: 'default'
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
    <div
      :class="
        layout === 'rows'
          ? 'bg-white'
          : 'rounded-2xl border border-neutral-200 bg-white p-2'
      "
    >
      <nav
        class="flex flex-col"
        :class="layout === 'rows' ? '' : 'space-y-1'"
        role="navigation"
      >
        <button
          v-for="(item, index) in items"
          :key="index"
          type="button"
          class="group flex w-full items-center text-left"
          :class="[
            layout === 'rows'
              ? 'min-h-16 gap-3 border-b border-neutral-100 px-3 py-3 transition-colors duration-150 last:border-b-0 hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-500'
              : 'gap-3 rounded-xl px-4 py-3 font-label-1 transition-all duration-150',
            layout !== 'rows' && modelValue === index
              ? 'border-l-2 border-primary-500 bg-primary-50 text-primary-700'
              : layout !== 'rows' && isLocked(index)
                ? 'cursor-not-allowed text-neutral-400'
                : layout !== 'rows'
                  ? 'border-l-2 border-transparent text-secondary hover:bg-neutral-50 hover:text-secondary-900'
                  : '',
            isLocked(index) ? 'cursor-not-allowed' : ''
          ]"
          :disabled="isLocked(index)"
          :aria-current="modelValue === index ? 'page' : undefined"
          @click="handleClick(index)"
        >
          <!-- Icon -->
          <span
            v-if="item.icon"
            class="shrink-0 transition-colors"
            :class="[
              layout === 'rows'
                ? 'grid h-9 w-9 place-items-center rounded-xl bg-primary-50 text-primary-600'
                : modelValue === index
                  ? 'text-primary-600'
                  : 'text-neutral-400 group-hover:text-neutral-600'
            ]"
          >
            <svg
              v-if="item.icon === 'user'"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <svg
              v-else-if="item.icon === 'code'"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
              />
            </svg>
            <svg
              v-else-if="item.icon === 'briefcase'"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <svg
              v-else-if="item.icon === 'academic-cap'"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 14l9-5-9-5-9 5 9 5z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
              />
            </svg>
          </span>

          <!-- Stepper number / check -->
          <span
            v-if="mode === 'stepper'"
            class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-label-1 transition-colors"
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
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span v-else>{{ index + 1 }}</span>
          </span>

          <!-- Label + Description -->
          <span
            class="min-w-0"
            :class="
              layout === 'rows'
                ? 'flex flex-1 flex-row flex-wrap items-baseline gap-x-1.5 gap-y-0.5'
                : 'flex flex-1 flex-col'
            "
          >
            <span
              :class="
                layout === 'rows'
                  ? 'font-label-2 text-secondary-900'
                  : 'truncate'
              "
              >{{ item.label }}</span
            >
            <span
              v-if="item.description"
              class="font-normal"
              :class="
                layout === 'rows'
                  ? 'font-body-3 text-secondary/75'
                  : [
                      'mt-0.5 truncate text-xs',
                      modelValue === index
                        ? 'text-primary-500'
                        : isLocked(index)
                          ? 'text-neutral-300'
                          : 'text-neutral-400'
                    ]
              "
            >
              {{ item.description }}
            </span>
          </span>

          <svg
            v-if="layout === 'rows'"
            aria-hidden="true"
            class="h-4 w-4 shrink-0 text-neutral-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="m9 18 6-6-6-6"
            />
          </svg>
        </button>
      </nav>
    </div>
  </div>
</template>
