import type {
  LoginRequest,
  RegisterRequest,
  RegistrationResponse,
  ResendVerificationResponse,
  AuthResponsePayload,
  CurrentUserResponse
} from '../types/auth'
import type { ApiResponse } from '../types/api'
import { API_ENDPOINTS } from '../constants/api-endpoints'

export const AuthService = {
  async login(payload: LoginRequest) {
    const { $api } = useApi()
    return await $api<ApiResponse<AuthResponsePayload>>(API_ENDPOINTS.AUTH.LOGIN, {
      method: 'POST',
      body: payload
    })
  },

  async logout(refreshToken: string) {
    const { $api } = useApi()
    return await $api<ApiResponse<null>>(API_ENDPOINTS.AUTH.LOGOUT, {
      method: 'POST',
      body: { refreshToken }
    })
  },

  async register(payload: RegisterRequest) {
    const { $api } = useApi()
    return await $api<ApiResponse<RegistrationResponse>>(API_ENDPOINTS.AUTH.REGISTER, {
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
    return await $api<ApiResponse<AuthResponsePayload>>(API_ENDPOINTS.AUTH.GOOGLE, {
      method: 'POST',
      body: { code }
    })
  },

  async resendVerification(email: string) {
    const { $api } = useApi()
    return await $api<ApiResponse<ResendVerificationResponse>>(
      API_ENDPOINTS.AUTH.RESEND_VERIFICATION,
      {
        method: 'POST',
        body: { email }
      }
    )
  },

  async verifyEmail(token: string) {
    const { $api } = useApi()
    return await $api<ApiResponse<null>>(API_ENDPOINTS.AUTH.VERIFY_EMAIL, {
      method: 'GET',
      query: { token }
    })
  },

  async forgotPassword(email: string) {
    const { $api } = useApi()
    return await $api<ApiResponse<null>>(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, {
      method: 'POST',
      body: { email }
    })
  },

  async resetPassword(payload: { token: string; newPassword: string }) {
    const { $api } = useApi()
    return await $api<ApiResponse<null>>(API_ENDPOINTS.AUTH.RESET_PASSWORD, {
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
    return await $api<ApiResponse<CurrentUserResponse>>(API_ENDPOINTS.AUTH.ME)
  }
}
