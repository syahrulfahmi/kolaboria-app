export interface ApiResponse<T = unknown> {
  status: number
  message: string
  data?: T
}

export interface ApiErrorResponse {
  status: number
  message: string
  errors?: Record<string, string[]> | string
}

export interface PaginatedMeta {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
}

export interface ApiPaginatedResponse<T = unknown> {
  status: number
  message: string
  data: T[]
  meta: PaginatedMeta
}
