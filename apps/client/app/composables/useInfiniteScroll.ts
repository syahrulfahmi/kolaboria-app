import { ref, watch, onMounted, onUnmounted, type Ref } from 'vue'

export interface UseInfiniteScrollOptions {
  /**
   * Callback invoked when the user scrolls near the bottom of the list.
   * Can be an asynchronous function.
   */
  onLoadMore: () => Promise<void> | void

  /**
   * Indicates whether there are more items available to load.
   * Accepts a Ref<boolean>, a getter function, or a static boolean.
   */
  hasMore?: Ref<boolean> | (() => boolean) | boolean

  /**
   * Distance margin from the viewport bottom to trigger the load ahead of time.
   * Format example: '200px' or '30%'. Default: '200px'.
   */
  distance?: string

  /**
   * Disables endless scrolling when set to true (e.g. when on desktop mode).
   * Accepts a Ref<boolean>, a getter function, or a static boolean.
   */
  disabled?: Ref<boolean> | (() => boolean) | boolean

  /**
   * Minimum cooldown time in milliseconds between successive load triggers.
   * Default: 300ms.
   */
  delay?: number
}

/**
 * Composable for reusable endless/infinite scrolling based on IntersectionObserver.
 * SSR-safe, handles debouncing and loading states gracefully.
 */
export function useInfiniteScroll(options: UseInfiniteScrollOptions) {
  const sentinelRef = ref<HTMLElement | null>(null)
  const isLoading = ref(false)
  let observer: IntersectionObserver | null = null
  let isCooldown = false

  const resolveValue = (
    val: Ref<boolean> | (() => boolean) | boolean | undefined,
    defaultValue: boolean
  ): boolean => {
    if (val === undefined) return defaultValue
    if (typeof val === 'function') return val()
    if (typeof val === 'boolean') return val
    return val.value
  }

  const triggerLoad = async () => {
    const disabled = resolveValue(options.disabled, false)
    const hasMore = resolveValue(options.hasMore, true)

    if (isLoading.value || isCooldown || disabled || !hasMore) {
      return
    }

    isLoading.value = true
    isCooldown = true

    try {
      await options.onLoadMore()
    } finally {
      isLoading.value = false
      setTimeout(() => {
        isCooldown = false
      }, options.delay ?? 300)
    }
  }

  const setupObserver = () => {
    cleanupObserver()

    if (
      typeof window === 'undefined' ||
      !('IntersectionObserver' in window) ||
      !sentinelRef.value
    ) {
      return
    }

    const disabled = resolveValue(options.disabled, false)
    const hasMore = resolveValue(options.hasMore, true)

    if (disabled || !hasMore) {
      return
    }

    observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (entry && entry.isIntersecting) {
          triggerLoad()
        }
      },
      {
        root: null,
        rootMargin: `0px 0px ${options.distance ?? '200px'} 0px`,
        threshold: 0
      }
    )

    observer.observe(sentinelRef.value)
  }

  const cleanupObserver = () => {
    if (observer) {
      observer.disconnect()
      observer = null
    }
  }

  onMounted(() => {
    setupObserver()
  })

  onUnmounted(() => {
    cleanupObserver()
  })

  watch(sentinelRef, () => {
    setupObserver()
  })

  if (typeof options.disabled === 'object' && options.disabled !== null) {
    watch(options.disabled as Ref<boolean>, () => {
      setupObserver()
    })
  }

  if (typeof options.hasMore === 'object' && options.hasMore !== null) {
    watch(options.hasMore as Ref<boolean>, (val) => {
      if (val) {
        setupObserver()
      } else {
        cleanupObserver()
      }
    })
  }

  return {
    sentinelRef,
    isLoading,
    triggerLoad
  }
}
