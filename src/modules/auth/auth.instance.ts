import { betterAuth, type BetterAuthOptions } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { organization } from 'better-auth/plugins'
import type { NodePgDatabase } from 'drizzle-orm/node-postgres'

import * as schema from '~/infra/drizzle/schemas'
import { env } from '~/core/env'

function getTrustedOrigins() {
  const origins = new Set<string>()
  const add = (v?: string) => v && origins.add(v)

  env.CORS_ORIGIN.forEach((origin) => add(origin))

  return Array.from(origins)
}

export function createBetterAuth(db: NodePgDatabase<typeof schema>) {
  const config = {
    database: drizzleAdapter(db, {
      provider: 'pg',
      usePlural: true,
    }),

    baseURL: env.BETTER_AUTH_URL,
    secret: env.BETTER_AUTH_SECRET,

    emailAndPassword: {
      enabled: true,
      minPasswordLength: 8,
    },

    socialProviders: {
      google: {
        clientId: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
      },
    },

    trustedOrigins: getTrustedOrigins(),

    advanced: {
      defaultCookieAttributes: {
        httpOnly: true,
        secure: env.NODE_ENV === 'production',
      },
    },

    account: {
      accountLinking: {
        enabled: true,
        trustedProviders: ['google'],
      },
    },

    session: {
      cookieCache: {
        enabled: true,
        maxAge: 5 * 60,
      },
    },

    plugins: [organization()],
  } satisfies BetterAuthOptions

  return betterAuth(config)
}

export type BetterAuthInstance = ReturnType<typeof createBetterAuth>