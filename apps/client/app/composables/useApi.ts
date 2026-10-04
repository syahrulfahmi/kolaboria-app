import { defu } from 'defu'
import type { UseFetchOptions } from 'nuxt/app'
import type { ApiResponse } from '../types/api'
import type { RefreshAuthResponsePayload } from '../types/auth'
import { API_ENDPOINTS } from '../constants/api-endpoints'
import { assertApiResponse, getApiErrorStatus, toUserFacingError } from '../utils/error'

// Composable untuk declarative data fetching (SSR-safe, auto-reactive)
export const useApiFetch = <T = unknown>(
  url: string | (() => string),
  options: UseFetchOptions<ApiResponse<T>> = {}
) => {
  const config = useRuntimeConfig()
  const accessToken = useCookie('auth_token')

  const defaults: UseFetchOptions<ApiResponse<T>> = {
    baseURL: config.public.apiBaseUrl,
    key: typeof url === 'function' ? url() : url,
    onRequest({ options }) {
      const headers = new Headers(options.headers)
      if (accessToken.value) {
        headers.set('Authorization', `Bearer ${accessToken.value}`)
      }
      options.headers = headers
    },
    onResponse({ response }) {
      if (response.ok) assertApiResponse(response._data)
    },
    onRequestError({ error }) {
      throw toUserFacingError(error)
    },
    async onResponseError({ response }) {
      if (response.status === 401) {
        // Token kedaluwarsa atau tidak valid
        await handleTokenExpiry()
      }
      throw toUserFacingError({ status: response.status, data: response._data })
    }
  }

  return useFetch(url, defu(options, defaults))
}

// Composable untuk actions / event-based request (client-side only)
export const useApi = () => {
  const config = useRuntimeConfig()
  const accessToken = useCookie('auth_token')
  const refreshToken = useCookie('auth_refresh_token')

  // Wrapper $api dengan penanganan refresh token otomatis saat status 401
  const $api = async <T = unknown>(
    request: Parameters<typeof $fetch>[0],
    opts: Parameters<typeof $fetch>[1] = {}
  ): Promise<T> => {
    try {
      const headers = new Headers(opts.headers)
      if (accessToken.value) headers.set('Authorization', `Bearer ${accessToken.value}`)
      return assertApiResponse(await $fetch<T>(request, {
        baseURL: config.public.apiBaseUrl,
        ...opts,
        headers
      }))
    } catch (err: unknown) {
      if (getApiErrorStatus(err) === 401) {
        const success = await refreshAccessToken()
        if (success) {
          const retryHeaders = new Headers(opts.headers)
          if (accessToken.value) retryHeaders.set('Authorization', `Bearer ${accessToken.value}`)
          try {
            return assertApiResponse(await $fetch<T>(request, {
              baseURL: config.public.apiBaseUrl,
              ...opts,
              headers: retryHeaders
            }))
          } catch (retryError: unknown) {
            throw toUserFacingError(retryError)
          }
        } else {
          forceLogout()
        }
      }
      throw toUserFacingError(err)
    }
  }

  // Helper fungsi untuk melakukan request token refresh
  async function refreshAccessToken(): Promise<boolean> {
    if (!refreshToken.value) return false
    try {
      const response = await $fetch<ApiResponse<RefreshAuthResponsePayload>>(
        API_ENDPOINTS.AUTH.REFRESH,
        {
        baseURL: config.public.apiBaseUrl,
        method: 'POST',
        body: { refreshToken: refreshToken.value }
        }
      )
      if (response.data?.access_token && response.data.refresh_token) {
        accessToken.value = response.data.access_token
        refreshToken.value = response.data.refresh_token
        return true
      }
      return false
    } catch {
      return false
    }
  }

  function forceLogout() {
    accessToken.value = null
    refreshToken.value = null
    navigateTo('/login')
  }

  return { $api, refreshAccessToken, forceLogout }
}

// Shared helper untuk error handling token kedaluwarsa global
async function handleTokenExpiry() {
  const accessToken = useCookie('auth_token')
  const refreshToken = useCookie('auth_refresh_token')
  const config = useRuntimeConfig()

  if (refreshToken.value) {
    try {
      const response = await $fetch<ApiResponse<RefreshAuthResponsePayload>>(
        API_ENDPOINTS.AUTH.REFRESH,
        {
        baseURL: config.public.apiBaseUrl,
        method: 'POST',
        body: { refreshToken: refreshToken.value }
        }
      )
      if (response.data?.access_token && response.data.refresh_token) {
        accessToken.value = response.data.access_token
        refreshToken.value = response.data.refresh_token
        // Reload page untuk memicu re-fetch dengan token baru
        window.location.reload()
      }
    } catch {
      accessToken.value = null
      refreshToken.value = null
      navigateTo('/login')
    }
  } else {
    navigateTo('/login')
  }
}
