/** Pesan UI yang dikendalikan frontend. Jangan tambahkan exception mentah di sini. */
export const ERROR_MESSAGES = {
  general: 'Ada kendala saat memproses permintaanmu. Silakan coba lagi.',
  unavailable: 'Layanan sedang mengalami kendala. Silakan coba beberapa saat lagi.',
  validation: 'Ada informasi yang belum sesuai. Periksa isianmu lalu coba lagi.',
  session: 'Silakan masuk kembali untuk melanjutkan.',
  forbidden: 'Kamu belum bisa melakukan tindakan ini dengan akunmu.',
  missing: 'Informasi yang kamu cari belum tersedia atau sudah dipindahkan.',
  conflict: 'Perubahan belum bisa disimpan. Muat ulang informasi lalu coba lagi.',
  tooLarge: 'Ukuran berkas terlalu besar. Pilih berkas yang lebih kecil lalu coba lagi.',
  rateLimit: 'Tunggu sebentar sebelum mencoba lagi.',
  network: 'Belum bisa terhubung. Periksa koneksi internetmu lalu coba lagi.',
  timeout: 'Permintaanmu memerlukan waktu lebih lama. Silakan coba lagi.',
  credentials: 'Email atau kata sandi belum sesuai. Periksa kembali lalu coba lagi.',
  emailRegistered: 'Email ini sudah terdaftar. Silakan masuk atau gunakan email lain.',
  emailVerified: 'Email kamu sudah diverifikasi. Silakan masuk untuk melanjutkan.',
  emailUnverified: 'Verifikasi email kamu terlebih dahulu sebelum masuk.',
  accountInactive: 'Akunmu belum bisa digunakan. Hubungi tim Kolaboria untuk bantuan.',
  linkExpired: 'Tautan ini sudah kedaluwarsa. Silakan minta tautan baru.',
  linkInvalid: 'Tautan ini belum bisa digunakan. Silakan minta tautan baru.',
  linkUsed: 'Tautan ini sudah digunakan. Silakan masuk atau minta tautan baru.',
  slugTaken: 'Alamat project ini sudah digunakan. Pilih alamat lain.'
} as const

export type ErrorMessageKey = keyof typeof ERROR_MESSAGES

export const HTTP_ERROR_MESSAGES: Readonly<Partial<Record<number, ErrorMessageKey>>> = {
  400: 'validation',
  401: 'session',
  403: 'forbidden',
  404: 'missing',
  408: 'timeout',
  409: 'conflict',
  410: 'missing',
  413: 'tooLarge',
  422: 'validation',
  429: 'rateLimit'
}

// Exact matches only. Unknown text always falls back; never forward backend copy.
// Add stable backend codes here when the API exposes them.
export const API_ERROR_MESSAGES: Readonly<Record<string, ErrorMessageKey>> = {
  'invalid credentials': 'credentials',
  'email already registered': 'emailRegistered',
  'email already verified': 'emailVerified',
  'email not verified': 'emailUnverified',
  'email is not verified': 'emailUnverified',
  'account is inactive': 'accountInactive',
  'token has expired': 'linkExpired',
  'token is invalid': 'linkInvalid',
  'token has already been used': 'linkUsed',
  'verification email cooldown active': 'rateLimit',
  'slug already taken': 'slugTaken'
}

export const ERROR_PAGE_CONTENT = {
  missing: {
    title: 'Halaman ini belum tersedia',
    message: 'Periksa kembali alamat halaman atau lanjutkan dari beranda.'
  },
  forbidden: {
    title: 'Halaman ini belum bisa dibuka',
    message: 'Pastikan kamu masuk dengan akun yang memiliki akses ke halaman ini.'
  },
  general: {
    title: 'Ada kendala membuka halaman',
    message: 'Silakan coba beberapa saat lagi atau lanjutkan dari beranda.'
  }
} as const
