export interface AuthUser {
  id: string
  email: string
  name: string
  emailVerified: boolean
  image?: string | null
  createdAt?: string | Date
  updatedAt?: string | Date
}

export interface AuthSession {
  id: string
  token: string
  userId: string
  expiresAt: string | Date
  createdAt?: string | Date
  updatedAt?: string | Date
  ipAddress?: string | null
  userAgent?: string | null
  activeOrganizationId?: string | null
}

export interface SessionContext {
  session: AuthSession | null
  user: AuthUser | null
}
