// --- Request ---
export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  fullName: string
}

// --- Response ---
export interface User {
  id: string
  name: string
  email: string
  username: string
  emailVerifiedAt: string | null
  isActive: boolean
  createdAt: string
}

