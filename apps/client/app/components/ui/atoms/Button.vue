<template>
  <component
    :is="componentType"
    :to="to"
    :href="href"
    :type="isButton ? type : undefined"
    :disabled="isDisabled"
    :class="buttonClass"
    v-bind="$attrs"
    @click="handleClick"
  >
    <!-- LEFT ICON / LOADING -->
    <span class="flex items-center gap-2">
      <svg
        v-if="loading"
        class="animate-spin h-4 w-4"
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

      <slot name="icon-left" v-else />

      <span>
        <slot>{{ label }}</slot>
      </span>

      <slot name="icon-right" v-if="!loading" />
    </span>
  </component>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  label: String,
  to: [String, Object],
  href: String,
  type: { type: String, default: 'button' },

  variant: {
    type: String,
    default: 'primary',
    validator: (v) =>
      [
        'primary',
        'secondary',
        'outline',
        'danger',
        'ghost-primary',
        'ghost-secondary',
        'ghost-danger',
        'google'
      ].includes(v)
  },

  size: {
    type: String,
    default: 'md',
    validator: (v) => ['sm', 'md', 'lg'].includes(v)
  },

  block: Boolean,
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

/**
 * 🎯 VARIANT (DESIGN TOKEN BASED)
 */
const variantClasses = computed(() => {
  switch (props.variant) {
    case 'primary':
      return `
        bg-secondary-500 text-white
        hover:bg-secondary-600
        active:bg-secondary-800
        hover:cursor-pointer
      `
    case 'secondary':
      return `
        bg-accent-400 text-secondary-800
        hover:bg-accent-700
        active:bg-accent-800
        hover:cursor-pointer
      `

    case 'outline':
      return `
        border border-secondary-400 text-secondary-400 bg-transparent
        hover:bg-secondary-100
        active:bg-secondary-200
        hover:cursor-pointer
      `

    case 'danger':
      return `
        bg-danger-500 text-white
        hover:bg-danger-700
        active:bg-danger-900
        hover:cursor-pointer
      `

    case 'ghost-primary':
      return `
        text-primary-500 bg-transparent
        hover:bg-primary-50
        active:text-primary-700
        hover:cursor-pointer
        px-0! py-0!
      `

    case 'ghost-secondary':
      return `
        text-accent-500 bg-transparent
        hover:bg-accent-50
        active:text-accent-700
        hover:cursor-pointer
        px-0! py-0!
      `

    case 'ghost-danger':
      return `
        text-danger-500 bg-transparent
        hover:bg-danger-50
        active:bg-danger-100
        hover:cursor-pointer
        px-0! py-0!
      `
    case 'google':
      return `bg-white text-gray-700 border-1 border-secondary-500 hover:bg-gray-50 hover:cursor-pointer`
  }
})

/**
 * 📏 SIZE
 */
const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'px-4 py-2 text-sm'
    case 'md':
      return 'px-5 py-2.5 text-sm'
    case 'lg':
      return 'px-6 py-3 text-base'
  }
})

/**
 * 🎨 BASE STYLE
 */
const baseClass = `
  inline-flex items-center justify-center
  font-medium
  rounded-lg
  transition-all duration-200
  focus:outline-none
`

/**
 * 🚫 DISABLED STATE
 */
const disabledClass = `
  bg-neutral-300 text-neutral-500
  cursor-not-allowed
`

const buttonClass = computed(() => [
  baseClass,
  sizeClasses.value,
  props.block && 'w-full',
  isDisabled.value ? disabledClass : variantClasses.value
])
</script>
