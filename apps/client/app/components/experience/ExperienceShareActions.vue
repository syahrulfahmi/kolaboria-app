<script setup lang="ts">
const emit = defineEmits<{ copy: [] }>()
const copy = () => emit('copy')
</script>
<template>
  <AtomicButton variant="secondary" size="sm" @click="copy"
    >Salin Link Publik</AtomicButton
  >
</template>
