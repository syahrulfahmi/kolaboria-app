export const useFormGuard = (isDirty: () => boolean) => {
  const popup = usePopup()
  let pendingRoute: string | null = null
  let forceLeave = false

  const handleNavigation = (to: any, from: any, next: any) => {
    if (forceLeave) {
      next()
      return
    }

    if (isDirty()) {
      pendingRoute = to.fullPath
      showConfirmDialog()
      next(false) // Abort current navigation
    } else {
      next()
    }
  }

  const showConfirmDialog = () => {
    popup.show({
      title: 'Perubahan Belum Disimpan',
      description:
        'Kamu memiliki perubahan yang belum disimpan. Apakah kamu yakin ingin meninggalkan halaman ini dan membuang perubahan?',
      type: 'warning',
      positiveLabel: 'Tinggalkan Halaman',
      negativeLabel: 'Batal',
      onPositive: () => {
        confirmLeave()
      },
      onNegative: () => {
        cancelLeave()
      }
    })
  }

  onBeforeRouteLeave((to, from, next) => {
    handleNavigation(to, from, next)
  })

  onBeforeRouteUpdate((to, from, next) => {
    handleNavigation(to, from, next)
  })

  const handleBeforeUnload = (e: BeforeUnloadEvent) => {
    if (isDirty() && !forceLeave) {
      e.preventDefault()
      e.returnValue = ''
    }
  }

  onMounted(() => {
    window.addEventListener('beforeunload', handleBeforeUnload)
  })

  onUnmounted(() => {
    window.removeEventListener('beforeunload', handleBeforeUnload)
  })

  const confirmLeave = async () => {
    forceLeave = true
    if (pendingRoute) {
      const target = pendingRoute
      pendingRoute = null
      await navigateTo(target)
      forceLeave = false
    }
  }

  const cancelLeave = () => {
    pendingRoute = null
  }

  const triggerCancel = (fallbackRoute: string) => {
    if (isDirty()) {
      pendingRoute = fallbackRoute
      showConfirmDialog()
    } else {
      navigateTo(fallbackRoute)
    }
  }

  return {
    triggerCancel
  }
}
