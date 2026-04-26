export const useAuth = () => {
  const user = useSupabaseUser()
  const client = useSupabaseClient()

  const login = async (email: string, password: string) => {
    const { error } = await client.auth.signInWithPassword({ email, password })
    if (error) throw error
  }

  const logout = async () => {
    const { error } = await client.auth.signOut()
    if (error) throw error
  }

  const isAuthenticated = computed(() => !!user.value)

  return { user, isAuthenticated, login, logout }
}
