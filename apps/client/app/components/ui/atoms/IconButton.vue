<template>
  <component
    :is="componentType"
    :to="to"
    :href="href"
    :type="isButton ? type : undefined"
    :disabled="isDisabled"
    :class="buttonClass"
    :title="title"
    v-bind="$attrs"
    @click="handleClick"
  >
    <svg
      v-if="loading"
      class="animate-spin"
      :class="spinnerSizeClass"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      />
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.3 0 0 5.3 0 12h4z"
      />
    </svg>
    <slot v-else />
  </component>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  to: [String, Object],
  href: [String],
  type: { type: String, default: 'button' },
  title: String,
  variant: {
    type: String,
    default: 'ghost',
    validator: (v) => ['primary', 'secondary', 'outline', 'ghost', 'light'].includes(v)
  },
  size: {
    type: String,
    default: 'md',
    validator: (v) => ['sm', 'md', 'lg'].includes(v)
  },
  shape: {
    type: String,
    default: 'circle',
    validator: (v) => ['circle', 'square'].includes(v)
  },
  disabled: Boolean,
  loading: Boolean
})

const emit = defineEmits(['click'])

const isButton = computed(() => !props.to && !props.href)
const componentType = computed(() => {
  if (props.to) return 'NuxtLink'
  if (props.href) return 'a'
  return 'button'
})

const isDisabled = computed(() => props.disabled || props.loading)

const handleClick = (e) => {
  if (!isDisabled.value) emit('click', e)
}

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'w-8 h-8 text-sm'
    case 'md':
      return 'w-10 h-10 text-sm'
    case 'lg':
      return 'w-12 h-12 text-base'
  }
})

const spinnerSizeClass = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'h-3.5 w-3.5'
    case 'md':
      return 'h-4 w-4'
    case 'lg':
      return 'h-5 w-5'
  }
})

const shapeClasses = computed(() => {
  return props.shape === 'circle' ? 'rounded-full' : 'rounded-lg'
})

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'primary':
      return `
        bg-primary-600 text-white
        hover:bg-primary-700
        active:bg-primary-800
      `
    case 'secondary':
      return `
        bg-accent-400 text-secondary-800
        hover:bg-accent-700
        active:bg-accent-800
      `
    case 'outline':
      return `
        border border-neutral-300 bg-white text-neutral-400
        hover:border-primary-300 hover:text-primary-600 hover:bg-primary-50
        active:bg-primary-100
      `
    case 'ghost':
      return `
        text-neutral-400 bg-transparent
        hover:text-primary-600 hover:bg-primary-50
        active:bg-primary-100
      `
    case 'light':
      return `
        bg-neutral-100 text-neutral-600
        hover:bg-neutral-200 hover:text-neutral-800
        active:bg-neutral-300
      `
  }
})

const baseClass = `
  flex items-center justify-center
  transition-all duration-200
  focus:outline-none
  cursor-pointer
`

const disabledClass = `
  bg-neutral-100 text-neutral-300
  cursor-not-allowed
`

const buttonClass = computed(() => [
  baseClass,
  sizeClasses.value,
  shapeClasses.value,
  isDisabled.value ? disabledClass : variantClasses.value
])
</script>
