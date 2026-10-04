import { useApi } from '../composables/useApi'
import { API_ENDPOINTS } from '../constants/api-endpoints'
import type { ApiPaginatedResponse, ApiResponse } from '../types/api'
import type { Skill, Tool } from '../types/skill'

const MASTER_PAGE_SIZE = 100

interface MasterItem {
  id: string
  name: string
  slug: string
}

interface SearchLocationDto {
  village_id: number
  village: string
  district: string
  regency: string
  province: string
  postal_code: string
}

interface LocationInfoDto {
  id: number
  name: string
}

interface LocationDetailDto {
  province: LocationInfoDto
  regency: LocationInfoDto
  district: LocationInfoDto
  village: LocationInfoDto
  postal_code: string
}

export interface SearchLocationResponse {
  villageId: number
  village: string
  district: string
  regency: string
  province: string
  postalCode: string
}

export interface LocationInfo {
  id: number
  name: string
}

export interface LocationDetailResponse {
  province: LocationInfo
  regency: LocationInfo
  district: LocationInfo
  village: LocationInfo
  postalCode: string
}

async function getAllMasterItems<T extends MasterItem>(endpoint: string): Promise<T[]> {
  const { $api } = useApi()
  const items: T[] = []
  let page = 1
  let totalPages = 1

  while (page <= totalPages) {
    const response = await $api<ApiPaginatedResponse<T>>(endpoint, {
      query: { page, limit: MASTER_PAGE_SIZE }
    })

    items.push(...response.data)
    totalPages = response.meta.total_pages
    page += 1
  }

  return items
}

export const MasterService = {
  async getSkills(): Promise<Skill[]> {
    return getAllMasterItems<Skill>(API_ENDPOINTS.MASTER.SKILLS)
  },

  async getTools(): Promise<Tool[]> {
    return getAllMasterItems<Tool>(API_ENDPOINTS.MASTER.TOOLS)
  },

  async getContributionRoles(): Promise<MasterItem[]> {
    return getAllMasterItems<MasterItem>(API_ENDPOINTS.MASTER.CONTRIBUTION_ROLES)
  },

  async searchLocations(query: string): Promise<SearchLocationResponse[]> {
    const { $api } = useApi()
    const normalizedQuery = query.trim()
    if (normalizedQuery.length < 2) return []

    try {
      const response = await $api<ApiResponse<SearchLocationDto[]>>(
        API_ENDPOINTS.MASTER.LOCATIONS_SEARCH,
        { query: { q: normalizedQuery } }
      )

      return (response.data ?? []).map((location) => ({
        villageId: location.village_id,
        village: location.village,
        district: location.district,
        regency: location.regency,
        province: location.province,
        postalCode: location.postal_code
      }))
    } catch (error: unknown) {
      console.error('Failed to search locations:', error)
      return []
    }
  },

  async getLocationDetail(villageId: number): Promise<LocationDetailResponse | null> {
    const { $api } = useApi()
    try {
      const response = await $api<ApiResponse<LocationDetailDto>>(
        API_ENDPOINTS.MASTER.LOCATION_DETAIL(villageId)
      )
      const location = response.data
      if (!location) return null

      return {
        province: location.province,
        regency: location.regency,
        district: location.district,
        village: location.village,
        postalCode: location.postal_code
      }
    } catch (error: unknown) {
      console.error(`Failed to get location detail for villageId ${villageId}:`, error)
      return null
    }
  }
}
