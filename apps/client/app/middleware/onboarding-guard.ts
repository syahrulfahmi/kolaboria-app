export default defineNuxtRouteMiddleware(async (to) => {
  const { isAuthenticated } = useAuth()

  // Jika user belum login, biarkan 'auth' middleware yang menangani redirect ke /login
  if (!isAuthenticated.value) return

  const { checkOnboardingStatus } = useProfile()
  const isOnboarded = await checkOnboardingStatus()

  if (isOnboarded) {
    // Jika user sudah onboarded dan mencoba mengakses after-register, arahkan ke home
    if (to.path === '/after-register') {
      return navigateTo('/home')
    }
  } else {
    // Jika user belum onboarded dan mencoba mengakses halaman selain after-register, arahkan ke setelah-daftar (after-register)
    if (to.path !== '/after-register') {
      return navigateTo('/after-register')
    }
  }
})
