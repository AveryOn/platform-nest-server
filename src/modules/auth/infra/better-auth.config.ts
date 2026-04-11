import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { bearer, openAPI, organization } from 'better-auth/plugins'

import { env } from '~/core/env'
import { db } from '~/infra/drizzle/client'
import * as schema from '~/infra/drizzle/schemas/auth-schema'

export const betterAuthConfig = {
  appName: 'UI Rules',
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL,
  basePath: env.BETTER_AUTH_BASE_PATH,

  database: drizzleAdapter(db, {
    provider: 'pg',
    usePlural: true,
    schema,
  }),

  trustedOrigins: env.CORS_ORIGIN,

  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },

  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },

  advanced: {
    cookiePrefix: 'better-auth',
    crossSubDomainCookies: {
      enabled: false,
    },
  },

  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
  },

  plugins: [organization(), bearer(), openAPI()],
}
