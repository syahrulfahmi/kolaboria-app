export default defineNuxtRouteMiddleware(async (to) => {
  const { isAuthenticated, user, fetchCurrentUser } = useAuth()

  if (!isAuthenticated.value) {
    return navigateTo('/login', { replace: true })
  }

  // Validate and hydrate the session through the backend /auth/me contract.
  const isCreate = /^\/projects\/create\/?$/.test(to.path)
  if (!user.value && !(await fetchCurrentUser({ preserveSessionOnError: isCreate }))) {
    // A transport failure keeps the session; the create loader blocks actions
    // and presents retry. An invalid session is still cleared by useAuth.
    if (isCreate && isAuthenticated.value) return
    return navigateTo('/login', { replace: true })
  }
})
