export default defineNuxtPlugin(async () => {
  const currentPath = import.meta.server
    ? useRequestURL().pathname
    : window.location.pathname
  const isProfileOverview = /^\/profile\/[^/]+\/?$/.test(currentPath)

  // Profile overview routes use local fixtures while the profile API is being integrated.
  if (isProfileOverview) return

  const { fetchCurrentUser } = useAuth()
  await fetchCurrentUser()
})
