<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useToast } from '../../../composables/useToast'
import MoleculeToast from './Toast.vue'

const { toasts, remove } = useToast()
const isMounted = ref(false)

onMounted(() => {
  isMounted.value = true
})
</script>

<template>
  <Teleport to="body" v-if="isMounted">
    <!-- Container for toasts -->
    <div
      class="fixed top-0 right-0 z-50 flex flex-col gap-3 p-4 sm:p-6 w-full sm:w-auto pointer-events-none"
    >
      <TransitionGroup
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="translate-x-full opacity-0"
        enter-to-class="translate-x-0 opacity-100"
        leave-active-class="transition-all duration-200 ease-in absolute"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0 -translate-y-4"
        move-class="transition-all duration-300 ease-in-out"
      >
        <MoleculeToast
          v-for="toast in toasts"
          :key="toast.id"
          :id="toast.id"
          :variant="toast.variant"
          :title="toast.title"
          :message="toast.message"
          @close="remove"
        />
      </TransitionGroup>
    </div>
  </Teleport>
</template>
