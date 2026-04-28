import { Inject, Injectable } from '@nestjs/common'
import {
  TX_PORT,
  type TransactionPort,
} from '~/infra/transaction/ports/transaction.port'
import type {
  ProjectReqCmd,
  ProjectRes,
} from '~/modules/project/application/project.type'
import {
  PROJECT_REPO_PORT,
  type ProjectRepoPort,
} from '~/modules/project/ports/project.repo.port'
import type { ProjectServicePort } from '~/modules/project/ports/project.service.port'

@Injectable()
export class ProjectService implements ProjectServicePort {
  constructor(
    @Inject(PROJECT_REPO_PORT)
    private readonly projectRepo: ProjectRepoPort,

    @Inject(TX_PORT)
    private readonly transaction: TransactionPort,
  ) {}

  async getList(cmd: ProjectReqCmd.GetList): Promise<ProjectRes.GetList> {
    const example = this.transaction.run(async (tx) => {
      return await this.projectRepo.getList({}, tx)
    })
    return await Promise.resolve({
      data: [
        {
          id: '550e8400-e29b-41d4-a716-446655440000',
          name: 'Main Design System',
          slug: 'main',
          description: 'Main product project',
          brandId: 'c6f33564-2c64-4f7c-bb6f-6e3d7ef21671',
          organizationId: 'org_123456',
          templateSnapshotId: '2c0c5af8-7d26-4dd4-a8d6-2f8b0658f1a2',
          isArchived: false,
          createdAt: '2026-04-20T12:00:00.000Z',
          updatedAt: null,
          deletedAt: null,
        },
      ],
      paginator: {
        total: 1,
        limit: 1,
        page: 1,
        totalPages: 1,
      },
    })
  }

  async getById(cmd: ProjectReqCmd.GetById): Promise<ProjectRes.GetById> {
    return await Promise.resolve({
      id: cmd.projectId,
      name: 'Main Design System',
      slug: 'main',
      description: 'Main product project',
      brandId: 'c6f33564-2c64-4f7c-bb6f-6e3d7ef21671',
      organizationId: 'org_123456',
      templateSnapshotId: '2c0c5af8-7d26-4dd4-a8d6-2f8b0658f1a2',
      isArchived: false,
      createdAt: '2026-04-20T12:00:00.000Z',
      updatedAt: '2026-04-20T12:30:00.000Z',
      deletedAt: null,
    })
  }

  async create(cmd: ProjectReqCmd.Create): Promise<ProjectRes.Create> {
    return await Promise.resolve({
      id: crypto.randomUUID(),
      name: cmd.name,
      slug: 'main',
      description: cmd.description ?? null,
      brandId: cmd.brandId ?? null,
      organizationId: 'org_123456',
      templateSnapshotId: cmd.templateSnapshotId ?? null,
      isArchived: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: null,
    })
  }

  async update(cmd: ProjectReqCmd.Update): Promise<ProjectRes.Update> {
    return await Promise.resolve({
      status: 'success',
      projectId: cmd.projectId,
    })
  }

  async delete(cmd: ProjectReqCmd.Delete): Promise<ProjectRes.Delete> {
    return await Promise.resolve({
      status: 'success',
      projectId: cmd.projectId,
      archivedAt: new Date().toISOString(),
    })
  }
}
