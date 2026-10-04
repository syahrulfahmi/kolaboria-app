export default defineNuxtRouteMiddleware(async (to) => {
  const { isAuthenticated, user, fetchCurrentUser } = useAuth()

  // 1. Authenticated check (let 'auth' middleware handle unauthenticated users)
  if (!isAuthenticated.value) return

  // Hydrate user if token exists but user state is null
  let currentUser = user.value
  if (!currentUser) {
    currentUser = await fetchCurrentUser()
    if (!currentUser) {
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
