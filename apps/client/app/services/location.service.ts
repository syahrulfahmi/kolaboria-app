import type { ApiResponse } from '../types/api'

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

export const LocationService = {
  async searchLocations(query: string): Promise<SearchLocationResponse[]> {
    const { $api } = useApi()
    try {
      const res = await $api<ApiResponse<SearchLocationResponse[]>>('/master-data/locations/search', {
        query: { q: query }
      })
      return res.data || []
    } catch (err) {
      console.error('Failed to search locations:', err)
      return []
    }
  },

  async getLocationDetail(villageId: number): Promise<LocationDetailResponse | null> {
    const { $api } = useApi()
    try {
      const res = await $api<ApiResponse<LocationDetailResponse>>(`/master-data/locations/${villageId}`)
      return res.data || null
    } catch (err) {
      console.error(`Failed to get location detail for villageId ${villageId}:`, err)
      return null
    }
  }
}
