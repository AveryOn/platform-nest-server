import { Inject, Injectable } from '@nestjs/common'
import type {
  ProjectSnapshotReqCmd,
  ProjectSnapshotRes,
} from '~/modules/snapshot/application/snapshot.type'
import {
  SNAPSHOT_REPO_PORT,
  type SnapshotRepoPort,
} from '~/modules/snapshot/ports/snapshot.repo.port'
import type { SnapshotServicePort } from '~/modules/snapshot/ports/snapshot.service.port'

@Injectable()
export class SnapashotService implements SnapshotServicePort {
  constructor(
    @Inject(SNAPSHOT_REPO_PORT)
    private readonly snapshotRepo: SnapshotRepoPort,
  ) {}

  async create(
    cmd: ProjectSnapshotReqCmd.Create,
  ): Promise<ProjectSnapshotRes.Create> {
    return await Promise.resolve({
      id: crypto.randomUUID(),
      projectId: cmd.projectId,
      version: 2,
      hash: '4ae7c3b6ac0beff671efa0e5b9f9b2f7ff38e44b6d7af1b70987f2c8472f5520',
      createdAt: new Date().toISOString(),
    })
  }

  async getList(
    cmd: ProjectSnapshotReqCmd.GetList,
  ): Promise<ProjectSnapshotRes.GetList> {
    return await Promise.resolve({
      data: [
        {
          id: '4d52ad0c-5506-4fd0-a6c9-0da4bbf8f8bb',
          projectId: cmd.projectId,
          version: 1,
          hash: 'f8ac10f23c5b5bc1167bda84b833e5c057a77d2f2f5a9174709b4f0c2d7fcb45',
          createdAt: '2026-04-20T12:45:00.000Z',
        },
      ],
      paginator: {
        limit: 1,
        page: 1,
        total: 1,
        totalPages: 1,
      },
    })
  }
  async getById(
    cmd: ProjectSnapshotReqCmd.GetById,
  ): Promise<ProjectSnapshotRes.GetById> {
    return await Promise.resolve({
      id: cmd.snapshotId,
      projectId: cmd.projectId,
      version: 1,
      hash: 'f8ac10f23c5b5bc1167bda84b833e5c057a77d2f2f5a9174709b4f0c2d7fcb45',
      createdAt: '2026-04-20T12:45:00.000Z',
    })
  }
  async getByVersion(
    cmd: ProjectSnapshotReqCmd.GetByVersion,
  ): Promise<ProjectSnapshotRes.GetByVersion> {
    return await Promise.resolve({
      id: '4d52ad0c-5506-4fd0-a6c9-0da4bbf8f8bb',
      projectId: cmd.projectId,
      version: cmd.version,
      hash: 'f8ac10f23c5b5bc1167bda84b833e5c057a77d2f2f5a9174709b4f0c2d7fcb45',
      createdAt: '2026-04-20T12:45:00.000Z',
    })
  }
  async getPayload(
    cmd: ProjectSnapshotReqCmd.GetPayload,
  ): Promise<ProjectSnapshotRes.GetPayload> {
    return await Promise.resolve({
      snapshotId: cmd.snapshotId,
      projectId: cmd.projectId,
      version: 1,
      payload: {
        rules: [
          {
            id: 'b9cbfc46-f42f-4a9c-9e5f-d3d5b88d9ec7',
            name: 'When to use',
            body: 'Use button for primary actions.',
            path: ['Components', 'Button', 'When to use'],
            orderKey: '0001.0001.0001',
          },
        ],
      },
    })
  }
  async getStatus(
    cmd: ProjectSnapshotReqCmd.GetStatus,
  ): Promise<ProjectSnapshotRes.GetStatus> {
    return await Promise.resolve({
      projectId: cmd.projectId,
      hasSnapshots: true,
      isOutdated: false,
      latestSnapshotId: '4d52ad0c-5506-4fd0-a6c9-0da4bbf8f8bb',
      latestVersion: 1,
      lastCreatedAt: '2026-04-20T12:45:00.000Z',
    })
  }
}
