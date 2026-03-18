import { betterAuth } from 'better-auth'
import { baseAuthConfig } from './auth.config'
import { env } from '~/core/env'

export const auth = betterAuth({
  ...baseAuthConfig,
  baseURL: env.BETTER_AUTH_URL,
  secret: env.BETTER_AUTH_SECRET,
})