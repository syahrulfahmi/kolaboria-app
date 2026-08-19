export default defineNuxtRouteMiddleware(async (to) => {
  const { isAuthenticated, user, isVerified, fetchCurrentUser } = useAuth()

  // 1. Authenticated check (let 'auth' middleware handle unauthenticated users)
  if (!isAuthenticated.value) return

  // Hydrate user if token exists but user state is null
  if (!user.value) {
    const fetchedUser = await fetchCurrentUser()
    if (!fetchedUser) {
      return navigateTo('/login')
    }
  }

  // 2. Email Verified check (order: authenticated -> verified -> onboarded)
  if (!isVerified.value) {
    if (to.path !== '/verify-email-notice') {
      return navigateTo({
        path: '/verify-email-notice',
        query: user.value?.email ? { email: user.value.email } : {}
      })
    }
    return
  }

  // 3. Onboarding check (only reached if user is verified)
  const { checkOnboardingStatus } = useProfile()
  const isOnboarded = await checkOnboardingStatus()

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
