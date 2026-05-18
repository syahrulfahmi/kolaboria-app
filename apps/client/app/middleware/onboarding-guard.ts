export default defineNuxtRouteMiddleware(async (to) => {
  const user = useSupabaseUser()

  // Jika user belum login, biarkan 'auth' middleware yang menangani redirect ke /login
  if (!user.value) return

  // Jangan jalankan guard jika user sudah menuju /after-register (hindari infinite loop)
  if (to.path === '/after-register') return

  const { checkOnboardingStatus } = useProfile()
  const isOnboarded = await checkOnboardingStatus()

  if (!isOnboarded) {
    return navigateTo('/after-register')
  }
})
