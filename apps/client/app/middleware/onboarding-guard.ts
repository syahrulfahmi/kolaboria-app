export default defineNuxtRouteMiddleware(async (to) => {
  const { isAuthenticated, user, fetchCurrentUser } = useAuth()

  // 1. Authenticated check (let 'auth' middleware handle unauthenticated users)
  if (!isAuthenticated.value) return
  const isCreate = /^\/projects\/create\/?$/.test(to.path)

  // Hydrate user if token exists but user state is null
  let currentUser = user.value
  if (!currentUser) {
    currentUser = await fetchCurrentUser({ preserveSessionOnError: isCreate })
    if (!currentUser) {
      if (isCreate && isAuthenticated.value) return
      return navigateTo('/login')
    }
  }

  // /auth/me returns emailVerifiedAt; pending accounts can access only notice.
  if (!currentUser.emailVerifiedAt) {
    if (to.path !== '/verify-email-notice') {
      return navigateTo({
        path: '/verify-email-notice',
        query: currentUser.email ? { email: currentUser.email } : {}
      })
    }
    return
  }

  // 3. Onboarding check (only reached if user is verified)
  const { checkOnboardingStatus } = useProfile()
  let isOnboarded: boolean
  try {
    isOnboarded = await checkOnboardingStatus(false, { throwOnError: isCreate })
  } catch {
    // Let the create page retry the lookup without treating an outage as a
    // negative onboarding result. Its editor stays unavailable until loaded.
    if (isCreate) return
    throw new Error('Status onboarding belum tersedia.')
  }

  if (isOnboarded) {
    // If user is onboarded and tries to access after-register, direct to home
    if (to.path === '/after-register') {
      return navigateTo('/home')
    }
  } else {
    // If user is not onboarded and tries to access protected page other than after-register, direct to after-register
    if (to.path !== '/after-register') {
      return navigateTo('/after-register')
    }
  }
})
