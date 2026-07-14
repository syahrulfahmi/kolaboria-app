import type { LoginRequest, RegisterRequest } from '../types/auth'
import type { ApiResponse } from '../types/api'
import type { User } from '../types/auth'

export const AuthService = {
  async login(payload: LoginRequest) {
    const { $api } = useApi()
    return await $api<
      ApiResponse<{ accessToken: string; refreshToken: string; user: User }>
    >('/auth/login', {
      method: 'POST',
      body: payload
    })
  },

  async logout(refreshToken: string) {
    const { $api } = useApi()
    return await $api<ApiResponse<null>>('/auth/logout', {
      method: 'POST',
      body: { refreshToken }
    })
  },

  async register(payload: RegisterRequest) {
    const { $api } = useApi()
    return await $api<ApiResponse<User>>('/auth/register', {
      method: 'POST',
      body: {
        name: payload.fullName,
        email: payload.email,
        password: payload.password,
        confirmPassword: payload.password
      }
    })
  },

  loginWithGoogle() {
    const config = useRuntimeConfig()
    const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth'
    const redirectUri = import.meta.client
      ? `${window.location.origin}/auth/callback`
      : 'http://localhost:3000/auth/callback'

    const options = {
      redirect_uri: redirectUri,
      client_id: config.public.googleClientId,
      access_type: 'offline',
      response_type: 'code',
      prompt: 'select_account',
      scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email'
      ].join(' ')
    }

    const qs = new URLSearchParams(options).toString()
    if (import.meta.client) {
      window.location.href = `${rootUrl}?${qs}`
    }
  },

  async loginWithGoogleCallback(code: string) {
    const { $api } = useApi()
    return await $api<
      ApiResponse<{ accessToken: string; refreshToken: string; user: User }>
    >('/auth/google', {
      method: 'POST',
      body: { code }
    })
  },

  async resendVerification(email: string) {
    const { $api } = useApi()
    return await $api<ApiResponse<null>>('/auth/resend-verification', {
      method: 'POST',
      body: { email }
    })
  },

  async forgotPassword(email: string) {
    const { $api } = useApi()
    return await $api<ApiResponse<null>>('/auth/forgot-password', {
      method: 'POST',
      body: { email }
    })
  },

  async resetPassword(payload: { token: string; newPassword: string }) {
    const { $api } = useApi()
    return await $api<ApiResponse<null>>('/auth/reset-password', {
      method: 'POST',
      body: {
        token: payload.token,
        password: payload.newPassword,
        confirmPassword: payload.newPassword
      }
    })
  },

  async getMe() {
    const { $api } = useApi()
    return await $api<ApiResponse<User>>('/auth/me')
  }
}
