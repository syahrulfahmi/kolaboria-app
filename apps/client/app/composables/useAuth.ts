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
    return await AuthService.register(client, { email, password, fullName })
  }


  const loginWithGoogle = async () => {
    await AuthService.loginWithGoogle(client)
  }

  const resendVerification = async () => {
    if (!user.value?.email) throw new Error('Email tidak ditemukan')
    await AuthService.resendVerification(client, user.value.email)
  }

  const forgotPassword = async (email: string) => {
    await AuthService.forgotPassword(client, email)
  }

  const resetPassword = async (newPassword: string) => {
    await AuthService.resetPassword(client, newPassword)
  }

  const isAuthenticated = computed(() => !!user.value)
  const isVerified = computed(() => !!user.value?.email_confirmed_at)

  return {
    user,
    isAuthenticated,
    isVerified,
    login,
    logout,
    register,
    loginWithGoogle,
    resendVerification,
    forgotPassword,
    resetPassword
  }
}
