<script setup lang="ts">
defineProps<{
  loading?: boolean
}>()

const emit = defineEmits<{
  submit: [body: string]
}>()

const body = ref('')

const submit = () => {
  const trimmed = body.value.trim()
  if (!trimmed) return
  emit('submit', trimmed)
  body.value = ''
}
</script>

<template>
  <form class="flex flex-col gap-3" @submit.prevent="submit">
    <textarea
      v-model="body"
      rows="3"
      class="w-full resize-none rounded-lg border border-neutral-300 bg-white px-4 py-3 text-body text-neutral-900 transition-colors focus:border-primary-500 focus:outline-none disabled:bg-neutral-100"
      placeholder="Tulis komentar..."
      :disabled="loading"
    />
    <div class="flex justify-end">
      <AtomicButton
        type="submit"
        variant="primary"
        :loading="loading"
        :disabled="loading || body.trim().length === 0"
      >
        Kirim
      </AtomicButton>
    </div>
  </form>
</template>
