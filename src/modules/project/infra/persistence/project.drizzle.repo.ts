import { Inject, Injectable } from '@nestjs/common'
import { and, count, desc, eq, ilike, isNull } from 'drizzle-orm'
import { defineDb } from '~/infra/drizzle/application/drizzle.helpers'
import type { Tx } from '~/infra/drizzle/application/drizzle.type'
import {
  DRIZZLE_PORT,
  type DrizzleServicePort,
} from '~/infra/drizzle/ports/drizzle.service.port'
import { projectsTable } from '~/infra/drizzle/schemas'
import type {
  ProjectEntity,
  ProjectRawEntity,
  ProjectRepoCmd,
  ProjectRepoRes,
} from '~/modules/project/application/project.type'
import type { ProjectRepoPort } from '~/modules/project/ports/project.repo.port'
import { OperationStatus } from '~/shared/const/app.const'
import {
  PAGINATOR_PORT,
  type PaginatorServicePort,
} from '~/shared/paginator/ports/paginator.service.port'

@Injectable()
export class ProjectDrizzleRepo implements ProjectRepoPort {
  constructor(
    @Inject(DRIZZLE_PORT)
    private readonly drizzle: DrizzleServicePort,

    @Inject(PAGINATOR_PORT)
    private readonly paginator: PaginatorServicePort,
  ) {}

  async findProjectOrFail(
    cmd: ProjectRepoCmd.FindProjectOrFail,
    tx?: Tx,
  ): Promise<ProjectRawEntity> {
    const db = defineDb(this.drizzle.db, tx)

    const [project] = await db
      .select()
      .from(projectsTable)
      .where(
        and(
          eq(projectsTable.id, cmd.projectId),
          eq(projectsTable.organizationId, cmd.organizationId),
          isNull(projectsTable.deletedAt),
        ),
      )
      .limit(1)

    if (!project) {
      throw new Error('Project not found')
    }
    return project
  }

  async getList(
    cmd: ProjectRepoCmd.GetList,
    tx?: Tx,
  ): Promise<ProjectRepoRes.GetList> {
    const db = defineDb(this.drizzle.db, tx)
    const { skip, take } = this.paginator.config({
      limit: cmd.limit,
      page: cmd.page,
    })

    const where = and(
      eq(projectsTable.organizationId, cmd.organizationId),
      cmd.brandId ? eq(projectsTable.brandId, cmd.brandId) : undefined,
      cmd.search
        ? ilike(projectsTable.name, `%${cmd.search}%`)
        : undefined,
      cmd.includeArchived ? undefined : isNull(projectsTable.deletedAt),
    )

    const data = await db
      .select()
      .from(projectsTable)
      .where(where)
      .orderBy(desc(projectsTable.createdAt))
      .limit(take)
      .offset(skip)

    const [{ total }] = await db
      .select({
        total: count(),
      })
      .from(projectsTable)
      .where(where)

    const paginator = this.paginator.response({
      data,
      total,
    })

    return {
      data: data.map((project) => this.toEntity(project)),
      paginator,
    }
  }
  async getById(
    cmd: ProjectRepoCmd.GetById,
    tx?: Tx,
  ): Promise<ProjectRepoRes.GetById> {
    const db = defineDb(this.drizzle.db, tx)

    const [project] = await db
      .select()
      .from(projectsTable)
      .where(
        and(
          eq(projectsTable.id, cmd.projectId),
          eq(projectsTable.organizationId, cmd.organizationId),
        ),
      )
      .limit(1)

    if (!project) {
      return null
    }

    return this.toEntity(project)
  }

  async create(
    cmd: ProjectRepoCmd.Create,
    tx?: Tx,
  ): Promise<ProjectRepoRes.Create> {
    const db = defineDb(this.drizzle.db, tx)

    const [project] = await db
      .insert(projectsTable)
      .values({
        name: cmd.name,
        slug: cmd.slug,
        description: cmd.description ?? null,
        brandId: cmd.brandId,
        organizationId: cmd.organizationId,
        templateSnapshotId: cmd.templateSnapshotId ?? null,
        updatedAt: null,
      })
      .returning()

    return this.toEntity(project)
  }

  async update(
    cmd: ProjectRepoCmd.Update,
    tx?: Tx,
  ): Promise<ProjectRepoRes.Update> {
    const db = defineDb(this.drizzle.db, tx)

    await db
      .update(projectsTable)
      .set({
        name: cmd.name,
        description: cmd.description,
        templateSnapshotId: cmd.templateSnapshotId,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(projectsTable.id, cmd.projectId),
          eq(projectsTable.organizationId, cmd.organizationId),
        ),
      )

    return {
      status: OperationStatus.success,
      projectId: cmd.projectId,
    }
  }
  async delete(
    cmd: ProjectRepoCmd.Delete,
    tx?: Tx,
  ): Promise<ProjectRepoRes.Delete> {
    const db = defineDb(this.drizzle.db, tx)
    const archivedAt = new Date()

    await db
      .update(projectsTable)
      .set({
        deletedAt: archivedAt,
        updatedAt: archivedAt,
      })
      .where(
        and(
          eq(projectsTable.id, cmd.projectId),
          eq(projectsTable.organizationId, cmd.organizationId),
        ),
      )

    return {
      status: OperationStatus.success,
      projectId: cmd.projectId,
      archivedAt: archivedAt.toISOString(),
    }
  }

  private toEntity(
    project: typeof projectsTable.$inferSelect,
  ): ProjectEntity {
    return {
      id: project.id,
      name: project.name,
      slug: project.slug,
      description: project.description,
      brandId: project.brandId,
      organizationId: project.organizationId,
      templateSnapshotId: project.templateSnapshotId,
      isArchived: project.deletedAt !== null,
      createdAt: project.createdAt.toISOString(),
      updatedAt: project.updatedAt?.toISOString() ?? null,
      deletedAt: project.deletedAt?.toISOString() ?? null,
    }
  }
}
