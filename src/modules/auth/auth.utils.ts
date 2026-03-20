import { and, eq, isNull } from 'drizzle-orm'
import { DrizzleService } from '~/infra/drizzle/drizzle.service'
import { projects } from '~/infra/drizzle/schemas'

export async function getSessionOrThrow() {
  // TODO IMPLEMENTS
  //   const session = await auth.api.getSession({
  //     headers: await headers(),
  //   })
  //   if (!session?.user) {
  //     throw new Error('Unauthorized')
  //   }
  //   if (!session.session?.activeOrganizationId) {
  //     throw new Error('No active organization')
  //   }
  //   return {
  //     user: session.user,
  //     session: session.session,
  //     activeOrganizationId: session.session.activeOrganizationId,
  //   }
}

export async function requireProjectAccess(
  organizationId: string,
  projectId: string,
  drizzle: DrizzleService,
) {
  const project = await drizzle.db.query.projects.findFirst({
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
