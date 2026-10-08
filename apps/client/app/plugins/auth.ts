export default defineNuxtPlugin(async () => {
  const currentPath = import.meta.server
    ? useRequestURL().pathname
    : window.location.pathname
  const isProfileOverview = /^\/profile\/[^/]+\/?$/.test(currentPath)

  // Profile overview routes use local fixtures while the profile API is being integrated.
  if (isProfileOverview) return

  // The create route hydrates through its guards and retryable account loader.
  if (/^\/projects\/create\/?$/.test(currentPath)) return

  const { fetchCurrentUser } = useAuth()
  await fetchCurrentUser()
})
