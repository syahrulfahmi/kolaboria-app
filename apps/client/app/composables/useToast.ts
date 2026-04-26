import { ref } from 'vue'

export type ToastVariant = 'success' | 'info' | 'warning' | 'danger'

export interface Toast {
  id: string
  variant: ToastVariant
  title?: string
  message: string
  duration?: number // 0 for persistent
}

// Global client-side state
const toasts = ref<Toast[]>([])

export const useToast = () => {
  const generateId = () => Math.random().toString(36).substring(2, 9)

  const add = (options: Omit<Toast, 'id'>) => {
    const id = generateId()
    const duration = options.duration !== undefined ? options.duration : 4000

    toasts.value.push({ ...options, id, duration })

    if (duration > 0) {
      setTimeout(() => {
        remove(id)
      }, duration)
    }
  }

  const remove = (id: string) => {
    const index = toasts.value.findIndex((t) => t.id === id)
    if (index !== -1) {
      toasts.value.splice(index, 1)
    }
  }

  const success = (message: string, title?: string, duration?: number) =>
    add({ variant: 'success', message, title, duration })

  const info = (message: string, title?: string, duration?: number) =>
    add({ variant: 'info', message, title, duration })

  const warning = (message: string, title?: string, duration?: number) =>
    add({ variant: 'warning', message, title, duration })

  const error = (message: string, title?: string, duration?: number) =>
    add({ variant: 'danger', message, title, duration })

  return {
    toasts,
    add,
    remove,
    success,
    info,
    warning,
    error
  }
}
