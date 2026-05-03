import type { Request } from 'express'

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

export type AuthRequest = Request & {
  user: {
    id: string
    email?: string
    name?: string | null
  }

  session: {
    id: string
    userId: string
    activeOrganizationId?: string | null
  }

  activeOrganizationId: string | null
}

export type AuthReqPayload = {
  user: AuthRequest['user']
  session: AuthRequest['session']
  activeOrganizationId: string | null
}

export type OrgAuthReqPayload = {
  user: AuthRequest['user']
  session: AuthRequest['session']
  activeOrganizationId: string
}
