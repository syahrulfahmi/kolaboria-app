import { onScopeDispose, ref, watch, type Ref } from 'vue'

// Delay only the indicator, never the request or the arrival of its content.
export const useDelayedLoading = (pending: Readonly<Ref<boolean>>, delay = 150) => {
  const visible = ref(false)
  let timer: ReturnType<typeof setTimeout> | undefined
  const cancel = () => {
    clearTimeout(timer)
    timer = undefined
  }
  watch(pending, (loading) => {
    cancel()
    visible.value = false
    if (loading) timer = setTimeout(() => { visible.value = true }, delay)
  }, { immediate: true, flush: 'sync' })
  onScopeDispose(cancel)
  return visible
}
