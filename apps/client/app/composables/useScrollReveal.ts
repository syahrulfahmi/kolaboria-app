import { ref, onMounted, onUnmounted } from 'vue'

export function useScrollReveal(options = {}) {
  // References for elements
  const revealTarget = ref<HTMLElement | null>(null)
  const itemRefs = ref<(HTMLElement | null)[]>([])

  // Store the observer instance
  let observer: IntersectionObserver | null = null

  // Default options
  const defaultOptions = {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px',
    ...options
  }

  // Set ref function for arrays/lists (e.g., v-for)
  const revealItems = (el: any, index: number) => {
    if (el) {
      itemRefs.value[index] = el as HTMLElement
    }
  }

  onMounted(() => {
    // Check if IntersectionObserver is supported (for SSR safety)
    if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Add is-visible class to trigger animation
            entry.target.classList.add('is-visible')

            // Unobserve after animating once (we only want enter animation)
            observer?.unobserve(entry.target)
          }
        })
      }, defaultOptions)

      // Observe single element
      if (revealTarget.value) {
        observer.observe(revealTarget.value)
      }

      // Observe array of elements
      itemRefs.value.forEach((el) => {
        if (el) observer?.observe(el)
      })
    } else {
      // Fallback if no IntersectionObserver: immediately make everything visible
      if (revealTarget.value) revealTarget.value.classList.add('is-visible')
      itemRefs.value.forEach((el) => {
        if (el) el.classList.add('is-visible')
      })
    }
  })

  onUnmounted(() => {
    if (observer) {
      observer.disconnect()
      observer = null
    }
  })

  return {
    reveal: revealTarget,
    revealItems
  }
}
