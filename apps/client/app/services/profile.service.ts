import type { SubmitOnboardingRequest } from '../types/profile'
import { useApi } from '../composables/useApi'
import type { ApiResponse } from '../types/api'

export const ProfileService = {
  async getProfile() {
    const { $api } = useApi()
    return await $api<ApiResponse<any>>('/profiles/me')
  },

  async getProfileByUsername(username: string) {
    const { $api } = useApi()
    return await $api<ApiResponse<any>>(`/profiles/${username}`)
  },

  async updateProfile(payload: any) {
    const { $api } = useApi()
    return await $api<ApiResponse<any>>('/profiles/me', {
      method: 'PATCH',
      body: payload
    })
  },

  async submitOnboarding(payload: SubmitOnboardingRequest) {
    const { $api } = useApi()
    return await $api<ApiResponse<null>>('/profiles/onboarding', {
      method: 'POST',
      body: payload
    })
  },

  async checkOnboardingStatus(): Promise<boolean> {
    const { $api } = useApi()
    try {
      const response = await $api<ApiResponse<{ isOnboarded: boolean }>>(
        '/profiles/onboarding/status'
      )
      return !!response.data?.isOnboarded
    } catch (err) {
      console.error('Gagal mengecek status onboarding:', err)
      return false
    }
  },

  async getPublicCareers(username: string) {
    const { $api } = useApi()
    return await $api<ApiResponse<any[]>>(`/profiles/${username}/careers`)
  },

  async getPublicPortfolio(username: string) {
    const { $api } = useApi()
    return await $api<ApiResponse<any[]>>(`/profiles/${username}/portfolio`)
  }
}

