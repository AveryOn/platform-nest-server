import { type BetterAuthOptions } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { organization } from 'better-auth/plugins'

import { db } from '~/infra/drizzle/client'
import { eq } from 'drizzle-orm'
import { members } from '~/infra/drizzle/schemas'
import { env } from '~/core/env'

export async function getInitialOrganizationId(userId: string): Promise<string | null> {
  const member = await db.query.members.findFirst({
    where: eq(members.userId, userId),
  })
  return member ? member.organizationId : null
}

export const baseAuthConfig = {
  database: drizzleAdapter(db, { provider: 'pg', usePlural: true }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
  },
  // trustedOrigins: [...env.CORS_ORIGIN],
  trustedOrigins: ['*'],
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },
  databaseHooks: {
    session: {
      create: {
        before: async (session) => {
          const organizationId = await getInitialOrganizationId(session.userId)

          return {
            data: {
              ...session,
              activeOrganizationId: organizationId ?? null,
            },
          }
        },
      },
    },
  },
  plugins: [organization()],
} satisfies BetterAuthOptions
