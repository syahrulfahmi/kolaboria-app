import type { LoginRequest, RegisterRequest } from '../types/auth'

export const AuthService = {
  async login(client: any, payload: LoginRequest) {
    const { error } = await client.auth.signInWithPassword({
      email: payload.email,
      password: payload.password
    })
    if (error) throw error
  },

  async logout(client: any) {
    const { error } = await client.auth.signOut()
    if (error) throw error
  },

  async register(client: any, payload: RegisterRequest) {
    const { error } = await client.auth.signUp({
      email: payload.email,
      password: payload.password,
      options: {
        data: {
          full_name: payload.fullName
        },
        emailRedirectTo: `${window.location.origin}/login`
      }
    })
    if (error) throw error
  },

  async loginWithGoogle(client: any) {
    const { error } = await client.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/confirm`
      }
    })
    if (error) throw error
  }
}
