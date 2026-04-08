import { Injectable } from '@nestjs/common'
import { ProjectServicePort } from '~/modules/project/ports/project.service.port'
import { Project, UpdateProjectInput } from '~/modules/project/application/project.types'
import { createId } from '~/shared/crypto/hash.crypto'
import { slugify } from '~/shared/utils/string'
import { CreateProjectDto } from '../infra/http/project.dto'
import { DrizzleService } from '~/infra/drizzle/drizzle.service'
import { projectsTable } from '~/infra/drizzle/schemas'
import { stampTemplate } from './project.stamper.service'
import { and, eq, isNull } from 'drizzle-orm'
import { requireProjectAccess } from '~/modules/auth/auth.utils'

@Injectable()
export class ProjectService implements ProjectServicePort {
  constructor(
    // TODO ЗАМЕНИТЬ НА РЕАЛИЗАЦИЮ /infra/persistance
    private readonly drizzle: DrizzleService,
  ) {}
  async create(data: CreateProjectDto, activeOrganizationId: string): Promise<Project> {
    const projectId = createId()
    const projectSlug = slugify(data.name)

    await this.drizzle.db.insert(projectsTable).values({
      id: projectId,
      organizationId: activeOrganizationId,
      name: data.name,
      slug: projectSlug,
      description: data.description ?? null,
    })

    if (data.templateSlug) {
      await stampTemplate(projectId, data.templateSlug, this.drizzle)
    }

    const project = await this.drizzle.db.query.projects.findFirst({
      where: eq(projectsTable.id, projectId),
    })

    return project!
  }

  async list(activeOrganizationId: string): Promise<Project[]> {
    const projectsList = await this.drizzle.db.query.projects.findMany({
      where: and(
        eq(projectsTable.organizationId, activeOrganizationId),
        isNull(projectsTable.deletedAt),
      ),
      orderBy: (projects, { desc }) => [desc(projects.createdAt)],
    })

    return projectsList
  }

  async getById(activeOrganizationId: string, projectId: string) {
    return await requireProjectAccess(activeOrganizationId, projectId, this.drizzle)
  }

  async update(
    activeOrganizationId: string,
    projectId: string,
    data: UpdateProjectInput,
  ): Promise<Project> {
    await requireProjectAccess(activeOrganizationId, projectId, this.drizzle)

    const updateData: Partial<typeof projectsTable.$inferInsert> = {}
    if (data.name !== undefined) {
      updateData.name = data.name
      updateData.slug = slugify(data.name)
    }
    if (data.description !== undefined) {
      updateData.description = data.description
    }

    await this.drizzle.db
      .update(projectsTable)
      .set(updateData)
      .where(eq(projectsTable.id, projectId))

    const project = await this.drizzle.db.query.projects.findFirst({
      where: eq(projectsTable.id, projectId),
    })

    return project!
  }

  async delete(activeOrganizationId: string, projectId: string) {
    await requireProjectAccess(activeOrganizationId, projectId, this.drizzle)

    await this.drizzle.db
      .update(projectsTable)
      .set({ deletedAt: new Date() })
      .where(eq(projectsTable.id, projectId))

    return { success: true }
  }
}
