export default defineNuxtRouteMiddleware(async () => {
  const { isAuthenticated, user, fetchCurrentUser } = useAuth()

  if (!isAuthenticated.value) {
    return navigateTo('/login', { replace: true })
  }

  // Validate and hydrate the session through the backend /auth/me contract.
  if (!user.value && !(await fetchCurrentUser())) {
    return navigateTo('/login', { replace: true })
  }
})
