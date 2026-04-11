import { betterAuth } from 'better-auth'
import { betterAuthConfig } from '~/modules/auth/infra/better-auth.config'

export const auth = betterAuth(betterAuthConfig)
