import { z } from 'zod'
import type { CurrentUserResponse } from '../types/auth'

const contextSchema = z.object({
  id: z.string().uuid().optional(),
  username: z.string().min(1).optional(),
  name: z.string(),
  email: z.string().email(),
  email_verified_at: z.string().nullable(),
  is_active: z.boolean(),
  created_at: z.string(),
  system_role: z.enum(['user', 'admin']).default('user'),
  initiable_organizations: z.array(z.object({
    id: z.string().uuid(),
    name: z.string().trim().min(1),
    slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  })).default([])
}).refine(value => new Set(value.initiable_organizations.map(org => org.id)).size === value.initiable_organizations.length)

// Old servers can still hydrate ordinary accounts; absent/invalid privileges
// never become administrative or organizational access.
export const parseCurrentUserContext = (input: unknown): CurrentUserResponse => {
  const result = contextSchema.safeParse(input)
  if (!result.success) throw new Error('Data akun belum dapat dibaca.')
  return {
    ...result.data,
    initiable_organizations: result.data.system_role === 'admin' ? result.data.initiable_organizations : []
  }
}
