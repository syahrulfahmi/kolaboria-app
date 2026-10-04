export interface ApiResponse<T = unknown> {
  status: number
  message: string
  data?: T
  meta?: ApiPaginationMeta
}

export interface ApiErrorResponse {
  status: number
  message: string
  errors?: Record<string, string[]> | string
}

export interface ApiPaginationMeta {
  page: number
  limit: number
  total: number
  total_pages: number
}

export interface ApiPaginatedResponse<T = unknown> extends ApiResponse<T[]> {
  data: T[]
  meta: ApiPaginationMeta
}
