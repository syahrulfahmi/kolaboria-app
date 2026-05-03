import { AuthService } from '../services/auth.service'
import type { LoginRequest, RegisterRequest } from '../types/auth'

export const useAuth = () => {
  const user = useSupabaseUser()
  const client = useSupabaseClient()

  const login = async (email: string, password: string) => {
    await AuthService.login(client, { email, password })
  }

  const logout = async () => {
    await AuthService.logout(client)
  }

  const register = async (
    email: string,
    password: string,
    fullName: string
  ) => {
    await AuthService.register(client, { email, password, fullName })
  }

  const loginWithGoogle = async () => {
    await AuthService.loginWithGoogle(client)
  }

  const isAuthenticated = computed(() => !!user.value)

  return { user, isAuthenticated, login, logout, register, loginWithGoogle }
}
