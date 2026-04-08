import { and, eq, isNull } from 'drizzle-orm'
import { DrizzleService } from '~/infra/drizzle/drizzle.service'
import { projectsTable } from '~/infra/drizzle/schemas'

export async function requireProjectAccess(
  organizationId: string,
  projectId: string,
  drizzle: DrizzleService,
) {
  const project = await drizzle.db.query.projects.findFirst({
    where: and(
      eq(projectsTable.id, projectId),
      eq(projectsTable.organizationId, organizationId),
      isNull(projectsTable.deletedAt),
    ),
  })

  if (!project) {
    throw new Error('Project not found')
  }

  return project
}
