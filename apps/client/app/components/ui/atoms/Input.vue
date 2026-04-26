<script setup lang="ts">
defineProps<{
  modelValue?: string
  placeholder?: string
  type?: 'text' | 'email' | 'password'
  error?: string
  disabled?: boolean
}>()

defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <div class="flex flex-col gap-1">
    <input
      :value="modelValue"
      @input="
        $emit('update:modelValue', ($event.target as HTMLInputElement).value)
      "
      :type="type || 'text'"
      :placeholder="placeholder"
      :disabled="disabled"
      class="rounded-lg border border-neutral-300 px-4 py-2 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 disabled:bg-neutral-100 disabled:text-neutral-500"
      :class="[
        error &&
          'border-tertiary-500 focus:border-tertiary-500 focus:ring-tertiary-500'
      ]"
    />
    <span v-if="error" class="text-caption text-tertiary-500">{{ error }}</span>
  </div>
</template>
