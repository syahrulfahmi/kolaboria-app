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

export interface VerificationCooldown {
  verificationResendAvailableAt: string
}

export interface RegistrationResponse extends User, VerificationCooldown {}

export interface ResendVerificationResponse extends VerificationCooldown {}

export interface AuthResponsePayload {
  accessToken: string
  refreshToken: string
  user: User
  verificationResendAvailableAt?: string | null
}

export interface VerificationCooldownErrorDetails {
  verificationResendAvailableAt?: string
  retryAfterSeconds?: number
}

