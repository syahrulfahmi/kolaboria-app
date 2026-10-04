import {
  MasterService,
  type SearchLocationResponse,
  type LocationInfo,
  type LocationDetailResponse
} from './master.service'

/**
 * LocationService - Backward compatible proxy to MasterService
 * @deprecated Use MasterService directly
 */
export const LocationService = {
  searchLocations: MasterService.searchLocations,
  getLocationDetail: MasterService.getLocationDetail
}

export type { SearchLocationResponse, LocationInfo, LocationDetailResponse }
