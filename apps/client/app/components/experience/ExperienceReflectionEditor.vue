<script setup lang="ts">
defineProps<{ modelValue: string; disabled?: boolean }>()
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()
const onInput = (event: Event) =>
  emit('update:modelValue', (event.target as HTMLTextAreaElement).value)
</script>
<template>
  <textarea
    :value="modelValue"
    :disabled="disabled"
    rows="5"
    maxlength="2000"
    class="mt-4 w-full rounded-xl border border-neutral-300 p-3 text-sm"
    placeholder="Apa yang Anda pelajari dari project ini?"
    @input="onInput"
  />
</template>
