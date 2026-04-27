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
  getList(
    cmd: ProjectSnapshotReqCmd.GetList,
  ): Promise<ProjectSnapshotRes.GetList> {
    throw new Error('Method not implemented.')
  }
  getById(
    cmd: ProjectSnapshotReqCmd.GetById,
  ): Promise<ProjectSnapshotRes.GetById> {
    throw new Error('Method not implemented.')
  }
  getByVersion(
    cmd: ProjectSnapshotReqCmd.GetByVersion,
  ): Promise<ProjectSnapshotRes.GetByVersion> {
    throw new Error('Method not implemented.')
  }
  getPayload(
    cmd: ProjectSnapshotReqCmd.GetPayload,
  ): Promise<ProjectSnapshotRes.GetPayload> {
    throw new Error('Method not implemented.')
  }
  getStatus(
    cmd: ProjectSnapshotReqCmd.GetStatus,
  ): Promise<ProjectSnapshotRes.GetStatus> {
    throw new Error('Method not implemented.')
  }
}
