import { onMounted, onUnmounted } from 'vue'

export function useClickOutside(
  component: any,
  callback: any,
  excludeComponent: any = null
) {
  if (!component) return

  const listener = (event: any) => {
    // Check if the click is inside the component
    if (
      event.target === component.value ||
      event.composedPath().includes(component.value)
    ) {
      return
    }

    // Check if the click is inside the excluded component (e.g., toggle button)
    if (
      excludeComponent &&
      excludeComponent.value &&
      (event.target === excludeComponent.value ||
        event.composedPath().includes(excludeComponent.value))
    ) {
      return
    }

    if (typeof callback === 'function') {
      callback()
    }
  }

  onMounted(() => {
    window.addEventListener('click', listener)
  })

  onUnmounted(() => {
    window.removeEventListener('click', listener)
  })
}
