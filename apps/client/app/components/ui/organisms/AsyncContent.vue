<script setup lang="ts">
import { computed } from 'vue'
import { useDelayedLoading } from '~/composables/useDelayedLoading'

const props = withDefaults(defineProps<{
  pending: boolean
  ready?: boolean
  label?: string
  contentClass?: string
}>(), { ready: false, label: 'Memuat konten...', contentClass: '' })

// Existing content stays mounted during a background refresh.
const blocked = computed(() => props.pending && !props.ready)
const showIndicator = useDelayedLoading(blocked)
</script>

<template>
  <div :aria-busy="pending" :class="{ 'async-content--pending': blocked }">
    <MoleculeLoading v-if="blocked && showIndicator" :label="label" />
    <div v-if="!blocked" class="async-content__body" :class="contentClass">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.async-content--pending {
  min-height: 40vh;
  display: flex;
  align-items: center;
}
.async-content__body {
  animation: content-arrive 160ms ease-out;
}
@keyframes content-arrive {
  from { opacity: 0.96; }
  to { opacity: 1; }
}
@media (prefers-reduced-motion: reduce) {
  .async-content__body { animation: none; }
}
</style>
