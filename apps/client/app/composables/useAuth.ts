import { computed } from 'vue'
import { jwtDecode } from 'jwt-decode'
import { AuthService } from '../services/auth.service'
import type { User } from '../types/auth'

export const useAuth = () => {
  const accessToken = useCookie('auth_token')
  const refreshToken = useCookie('auth_refresh_token')
  const user = useState<User | null>('user', () => null)

  const isAuthenticated = computed(() => !!accessToken.value)
  const isVerified = computed(() => !!user.value?.emailVerifiedAt)

  const login = async (email: string, password: string) => {
    const res = await AuthService.login({ email, password })
    if (res.data) {
      accessToken.value = res.data.accessToken
      refreshToken.value = res.data.refreshToken
      user.value = res.data.user
    }
  }

  const logout = async () => {
    try {
      if (refreshToken.value) {
        await AuthService.logout(refreshToken.value)
      }
    } catch (err) {
      console.warn('Backend logout failed', err)
    } finally {
      accessToken.value = null
      refreshToken.value = null
      user.value = null

      const currentProfile = useState('current_profile')
      const currentTalentProfile = useState('current_talent_profile')
      const isOnboardedState = useState('is_onboarded')

      currentProfile.value = null
      currentTalentProfile.value = null
      isOnboardedState.value = null

      navigateTo('/login')
    }
  }

  const register = async (
    email: string,
    password: string,
    fullName: string
  ) => {
    return await AuthService.register({ email, password, fullName })
  }

  const loginWithGoogle = () => {
    AuthService.loginWithGoogle()
  }

  const loginWithGoogleCallback = async (code: string) => {
    const res = await AuthService.loginWithGoogleCallback(code)
    if (res.data) {
      accessToken.value = res.data.accessToken
      refreshToken.value = res.data.refreshToken
      user.value = res.data.user
    }
  }

  const resendVerification = async (email?: string) => {
    const targetEmail = email || user.value?.email
    if (!targetEmail) throw new Error('Email tidak ditemukan')
    await AuthService.resendVerification(targetEmail)
  }

  const forgotPassword = async (email: string) => {
    await AuthService.forgotPassword(email)
  }

  const resetPassword = async (token: string, newPassword: string) => {
    await AuthService.resetPassword({ token, newPassword })
  }

  const fetchCurrentUser = async () => {
    if (!accessToken.value) return null
    try {
      const res = await AuthService.getMe()
      if (res.data) {
        user.value = res.data
      }
      return user.value
    } catch (err) {
      accessToken.value = null
      refreshToken.value = null
      user.value = null
      return null
    }
  }

  interface DecodedToken {
    user_id?: string
    username?: string
    exp?: number
  }

  const getDecodedToken = (): DecodedToken | null => {
    if (!accessToken.value) return null
    try {
      return jwtDecode<DecodedToken>(accessToken.value)
    } catch (e) {
      console.error('Failed to parse JWT token:', e)
      return null
    }
  }

  const currentUserId = computed(() => getDecodedToken()?.user_id || null)
  const currentUsername = computed(() => getDecodedToken()?.username || null)

  return {
    user,
    isAuthenticated,
    isVerified,
    login,
    logout,
    register,
    loginWithGoogle,
    loginWithGoogleCallback,
    resendVerification,
    forgotPassword,
    resetPassword,
    fetchCurrentUser,
    currentUserId,
    currentUsername
  }
}
