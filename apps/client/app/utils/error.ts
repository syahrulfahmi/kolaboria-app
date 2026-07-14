import type { FetchError } from 'ofetch'
import type { ApiErrorResponse } from '../types/api'

/**
 * Mengambil pesan error kustom dari response API Go secara aman.
 * Jika tidak ditemukan custom message dari server, akan fall back ke pesan error HTTP default.
 */
export const getApiErrorMessage = (
  err: unknown,
  fallback = 'Terjadi kesalahan pada server. Silakan coba lagi.'
): string => {
  if (err && typeof err === 'object') {
    const fetchErr = err as FetchError<ApiErrorResponse>
    
    // Cek status code (dari status HTTP, statusCode HTTP, atau dari body response)
    const status = fetchErr.status || fetchErr.statusCode || fetchErr.data?.status
    
    // Jika status >= 500 (Internal Server Error), sembunyikan detail dan kembalikan fallback general
    if (status && status >= 500) {
      return fallback
    }
    
    // 1. Periksa apakah server mengembalikan format JSON error standar kita
    if (fetchErr.data && typeof fetchErr.data === 'object' && fetchErr.data.message) {
      const msg = fetchErr.data.message
      
      // Tambahan safety check untuk mendeteksi raw SQL/DB constraint error message
      if (
        msg.includes('SQLSTATE') ||
        msg.includes('violates check constraint') ||
        msg.startsWith('ERROR:')
      ) {
        return fallback
      }
      
      return msg
    }
    
    // 2. Jika tidak ada, gunakan default error message dari FetchError
    if (fetchErr.message) {
      return fetchErr.message
    }
  }
  
  // 3. Fallback jika err bukan object atau tidak terdefinisi
  return fallback
}
