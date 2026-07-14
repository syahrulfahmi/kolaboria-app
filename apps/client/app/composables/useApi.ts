import { defu } from 'defu'
import type { UseFetchOptions } from 'nuxt/app'
import type { ApiResponse } from '../types/api'

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
      options.headers = options.headers || {}
      if (accessToken.value) {
        // @ts-ignore
        options.headers['Authorization'] = `Bearer ${accessToken.value}`
      }
    },
    async onResponseError({ response }) {
      if (response.status === 401) {
        // Token kedaluwarsa atau tidak valid
        await handleTokenExpiry()
      }
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
      const headers = {
        ...(opts.headers || {}),
        ...(accessToken.value
          ? { Authorization: `Bearer ${accessToken.value}` }
          : {})
      }
      return await $fetch<T>(request, {
        baseURL: config.public.apiBaseUrl,
        ...opts,
        headers
      })
    } catch (err: unknown) {
      if (
        err &&
        typeof err === 'object' &&
        ('statusCode' in err || 'status' in err)
      ) {
        // @ts-ignore
        const status = err.statusCode || err.status
        if (status === 401) {
          const success = await refreshAccessToken()
          if (success) {
            const retryHeaders = {
              ...(opts.headers || {}),
              ...(accessToken.value
                ? { Authorization: `Bearer ${accessToken.value}` }
                : {})
            }
            return await $fetch<T>(request, {
              baseURL: config.public.apiBaseUrl,
              ...opts,
              headers: retryHeaders
            })
          } else {
            forceLogout()
          }
        }
      }
      throw err
    }
  }

  // Helper fungsi untuk melakukan request token refresh
  async function refreshAccessToken(): Promise<boolean> {
    if (!refreshToken.value) return false
    try {
      const response = await $fetch<
        ApiResponse<{ accessToken: string; refreshToken: string }>
      >('/auth/refresh', {
        baseURL: config.public.apiBaseUrl,
        method: 'POST',
        body: { refreshToken: refreshToken.value }
      })
      if (response.data) {
        accessToken.value = response.data.accessToken
        refreshToken.value = response.data.refreshToken
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
      const response = await $fetch<
        ApiResponse<{ accessToken: string; refreshToken: string }>
      >('/auth/refresh', {
        baseURL: config.public.apiBaseUrl,
        method: 'POST',
        body: { refreshToken: refreshToken.value }
      })
      if (response.data) {
        accessToken.value = response.data.accessToken
        refreshToken.value = response.data.refreshToken
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
