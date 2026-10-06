import type { SubmitOnboardingRequest } from '../types/profile'
import { useApi } from '../composables/useApi'
import { API_ENDPOINTS } from '../constants/api-endpoints'
import type { ApiResponse } from '../types/api'
import type {
  AddSkillRequest,
  AddToolRequest,
  ProfileResponse,
  UpdateProfileRequest,
  UserSkillResponse,
  UserToolResponse
} from '../types/profile-api'
import { CareerService } from './career.service'
import { PortfolioService } from './portfolio.service'

export interface UserSkillDTO {
  id: string
  skill_id: string
  name: string
  slug: string
  is_primary: boolean
}

export interface UserToolDTO {
  id: string
  tool_id: string
  name: string
  slug: string
}

export const ProfileService = {
  async getProfile() {
    const { $api } = useApi()
    return await $api<ApiResponse<ProfileResponse>>(API_ENDPOINTS.PROFILE.ME)
  },

  async getProfileByUsername(username: string) {
    const { $api } = useApi()
    return await $api<ApiResponse<ProfileResponse>>(API_ENDPOINTS.PROFILE.BY_USERNAME(username))
  },

  async updateProfile(payload: UpdateProfileRequest) {
    const { $api } = useApi()
    return await $api<ApiResponse<ProfileResponse>>(API_ENDPOINTS.PROFILE.ME, {
      method: 'PATCH',
      body: payload
    })
  },

  async submitOnboarding(payload: SubmitOnboardingRequest) {
    const { $api } = useApi()
    return await $api<ApiResponse<null>>(API_ENDPOINTS.PROFILE.ONBOARDING, {
      method: 'POST',
      body: payload
    })
  },

  async checkOnboardingStatus(): Promise<boolean> {
    const { $api } = useApi()
    try {
      const response = await $api<ApiResponse<{ is_onboarded: boolean }>>(
        API_ENDPOINTS.PROFILE.ONBOARDING_STATUS
      )
      return !!response.data?.is_onboarded
    } catch (err) {
      console.error('Gagal mengecek status onboarding:', err)
      return false
    }
  },

  // --- User Skills & Tools (Centralized from useSkill.ts) ---

  async getMySkills() {
    const { $api } = useApi()
    return await $api<ApiResponse<UserSkillDTO[]>>(API_ENDPOINTS.PROFILE.MY_SKILLS)
  },

  async addSkill(payload: AddSkillRequest) {
    const { $api } = useApi()
    return await $api<ApiResponse<UserSkillResponse>>(API_ENDPOINTS.PROFILE.MY_SKILLS, {
      method: 'POST',
      body: payload
    })
  },

  async removeSkill(userSkillId: string) {
    const { $api } = useApi()
    return await $api<ApiResponse<null>>(API_ENDPOINTS.PROFILE.MY_SKILL_DETAIL(userSkillId), {
      method: 'DELETE'
    })
  },

  async setPrimarySkill(userSkillId: string) {
    const { $api } = useApi()
    return await $api<ApiResponse<null>>(API_ENDPOINTS.PROFILE.MY_SKILL_PRIMARY(userSkillId), {
      method: 'PATCH'
    })
  },

  async getMyTools() {
    const { $api } = useApi()
    return await $api<ApiResponse<UserToolDTO[]>>(API_ENDPOINTS.PROFILE.MY_TOOLS)
  },

  async addTool(payload: AddToolRequest) {
    const { $api } = useApi()
    return await $api<ApiResponse<UserToolResponse>>(API_ENDPOINTS.PROFILE.MY_TOOLS, {
      method: 'POST',
      body: payload
    })
  },

  async removeTool(userToolId: string) {
    const { $api } = useApi()
    return await $api<ApiResponse<null>>(API_ENDPOINTS.PROFILE.MY_TOOL_DETAIL(userToolId), {
      method: 'DELETE'
    })
  },

  // Delegated to CareerService and PortfolioService for domain cohesion
  getPublicCareers: CareerService.getPublicCareers,
  getPublicPortfolio: PortfolioService.getPublicPortfolio
}
