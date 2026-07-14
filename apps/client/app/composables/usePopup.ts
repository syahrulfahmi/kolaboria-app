import { useState } from '#app'

interface PopupOptions {
  title: string
  description?: string
  type?: 'info' | 'success' | 'warning' | 'danger'
  positiveLabel?: string
  negativeLabel?: string
  onPositive?: () => void | Promise<void>
  onNegative?: () => void | Promise<void>
}

export const usePopup = () => {
  const isOpen = useState<boolean>('popup_is_open', () => false)
  const options = useState<PopupOptions>('popup_options', () => ({
    title: '',
    description: '',
    type: 'info',
    positiveLabel: '',
    negativeLabel: ''
  }))

  const show = (newOptions: PopupOptions) => {
    options.value = {
      type: 'info',
      ...newOptions
    }
    isOpen.value = true
  }

  const close = () => {
    isOpen.value = false
  }

  const handlePositive = async () => {
    if (options.value.onPositive) {
      await options.value.onPositive()
    }
    isOpen.value = false
  }

  const handleNegative = async () => {
    if (options.value.onNegative) {
      await options.value.onNegative()
    }
    isOpen.value = false
  }

  return {
    isOpen,
    options,
    show,
    close,
    handlePositive,
    handleNegative
  }
}
