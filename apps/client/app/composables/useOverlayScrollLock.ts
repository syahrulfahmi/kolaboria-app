import { onMounted, onScopeDispose, toValue, watch, type MaybeRefOrGetter } from 'vue'

const locks = new WeakMap<HTMLElement, { count: number; previousOverflow: string }>()

// Each overlay releases only its own lock, including overlays nested in a modal.
export const useOverlayScrollLock = (active: MaybeRefOrGetter<boolean>) => {
  let lockedBody: HTMLElement | null = null

  const release = () => {
    if (!lockedBody) return
    const lock = locks.get(lockedBody)
    if (lock && --lock.count === 0) {
      lockedBody.style.overflow = lock.previousOverflow
      locks.delete(lockedBody)
    }
    lockedBody = null
  }

  const sync = () => {
    if (!toValue(active)) return release()
    if (lockedBody || typeof document === 'undefined') return
    lockedBody = document.body
    const lock = locks.get(lockedBody) ?? {
      count: 0,
      previousOverflow: lockedBody.style.overflow
    }
    lock.count++
    locks.set(lockedBody, lock)
    lockedBody.style.overflow = 'hidden'
  }

  watch(() => toValue(active), sync, { immediate: true })
  onMounted(sync)
  onScopeDispose(release)
}
