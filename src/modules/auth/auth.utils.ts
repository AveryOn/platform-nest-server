import { and, eq, isNull } from 'drizzle-orm'
import { DrizzleService } from '~/infra/drizzle/drizzle.service'
import { projects } from '~/infra/drizzle/schemas'

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
