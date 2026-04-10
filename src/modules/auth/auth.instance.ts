import { betterAuth, type BetterAuthOptions } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { organization } from 'better-auth/plugins'
import type { NodePgDatabase } from 'drizzle-orm/node-postgres'
import type { Request as ExpressRequest, Response as ExpressResponse } from 'express'

import { env } from '~/core/env'
import type * as schema from '~/infra/drizzle/schemas'
import { NodeEnv } from '~/shared/const/app.const'

function getTrustedOrigins(): string[] {
  return [...new Set(env.CORS_ORIGIN)]
}

export function createBetterAuth(db: NodePgDatabase<typeof schema>) {
  const config = {
    database: drizzleAdapter(db, {
      provider: 'pg',
      usePlural: true,
    }),

    baseURL: env.BETTER_AUTH_URL,
    secret: env.BETTER_AUTH_SECRET,

    trustedOrigins: getTrustedOrigins(),

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

    advanced: {
      defaultCookieAttributes: {
        httpOnly: true,
        secure: env.NODE_ENV === NodeEnv.production,
      },
    },

    session: {
      cookieCache: {
        enabled: true,
        maxAge: 60 * 5,
      },
    },

    plugins: [organization()],
  } satisfies BetterAuthOptions

  return betterAuth(config)
}

export type BetterAuthInstance = ReturnType<typeof createBetterAuth>

export async function betterAuthExpressHandler(
  req: ExpressRequest,
  res: ExpressResponse,
  auth: BetterAuthInstance,
) {
  const url = `${req.protocol}://${req.get('host')}${req.originalUrl}`

  const headers = new Headers()

  for (const [key, value] of Object.entries(req.headers)) {
    if (Array.isArray(value)) {
      for (const item of value) headers.append(key, item)
      continue
    }

    if (typeof value === 'string') {
      headers.append(key, value)
    }
  }

  let body: BodyInit | undefined

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    const contentType = String(req.headers['content-type'] ?? '')

    if (contentType.includes('application/json')) {
      body = JSON.stringify(req.body ?? {})
    } else if (contentType.includes('application/x-www-form-urlencoded')) {
      body = new URLSearchParams(req.body ?? {}).toString()
    } else if (typeof req.body === 'string') {
      body = req.body
    }
  }

  const request = new Request(url, {
    method: req.method,
    headers,
    body,
  })

  const response = await auth.handler(request)

  res.status(response.status)

  response.headers.forEach((value, key) => {
    res.setHeader(key, value)
  })

  res.send(await response.text())
}
