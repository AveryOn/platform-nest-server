import { Injectable } from '@nestjs/common'
import {
  createBetterAuth,
  type BetterAuthInstance,
} from '~/modules/auth/auth.instance'
import { DrizzleService } from '~/infra/drizzle/drizzle.service'
import { Request } from 'express'
import { toWebHeaders } from '~/shared/helpers/http.helpers'
import { and, eq, isNull } from 'drizzle-orm'
import {
  members,
  organizations,
  projects,
  sessions,
} from '~/infra/drizzle/schemas'
import { createId } from '~/shared/crypto/hash.crypto'
import { slugify } from '~/shared/utils/string'

@Injectable()
export class AuthService {
  public readonly auth: BetterAuthInstance

  constructor(private readonly drizzle: DrizzleService) {
    this.auth = createBetterAuth(this.drizzle.db)
  }

  private async createOrganizationForUser(userId: string, userName: string) {
    const orgId = createId()
    const orgName = userName ? `${userName}'s Organization` : 'My Organization'
    const orgSlug = slugify(orgName)

    await this.drizzle.db.insert(organizations).values({
      id: orgId,
      name: orgName,
      slug: orgSlug,
      createdAt: new Date(),
    })

    await this.drizzle.db.insert(members).values({
      id: createId(),
      organizationId: orgId,
      userId,
      role: 'owner',
      createdAt: new Date(),
    })

    return orgId
  }

  async ensureOrganization(req: Request) {
    const sessionData = await this.auth.api.getSession({
      headers: toWebHeaders(req),
    })

    if (!sessionData?.user || !sessionData?.session) {
      throw new Error('Unauthorized')
    }

    if (sessionData.session.activeOrganizationId) {
      return sessionData.session.activeOrganizationId
    }

    const existingMember = await this.drizzle.db.query.members.findFirst({
      where: eq(members.userId, sessionData.user.id),
    })

    let orgId: string
    if (existingMember) {
      orgId = existingMember.organizationId
    } else {
      orgId = await this.createOrganizationForUser(
        sessionData.user.id,
        sessionData.user.name || '',
      )
    }

    // Update session directly in database
    await this.drizzle.db
      .update(sessions)
      .set({ activeOrganizationId: orgId })
      .where(eq(sessions.id, sessionData.session.id))

    // Also update via API to sync the cookie
    await this.auth.api.setActiveOrganization({
      body: { organizationId: orgId },
      headers: toWebHeaders(req),
    })

    return orgId
  }

  public async requireProjectAccess(organizationId: string, projectId: string) {
    const project = await this.drizzle.db.query.projects.findFirst({
      where: and(
        eq(projects.id, projectId),
        eq(projects.organizationId, organizationId),
        isNull(projects.deletedAt),
      ),
    })

    if (!project) {
      throw new Error('Project not found')
    }

    return project
  }
}
