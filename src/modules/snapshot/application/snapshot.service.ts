import { Inject, Injectable } from '@nestjs/common'
import { AppError } from '~/core/error/app-error'
import { ErrorEnum } from '~/core/error/app-error.dict'
import { LOGGER_PORT } from '~/core/logger/logger.port'
import type { AppLoggerService } from '~/core/logger/logger.service'
import type {
  ProjectSnapshotReqCmd,
  ProjectSnapshotRes,
} from '~/modules/snapshot/application/snapshot.type'
import {
  SNAPSHOT_PAYLOAD_BUILDER_PORT,
  type SnapshotPayloadBuilderPort,
} from '~/modules/snapshot/ports/snapshot-payload-builder.port'
import {
  SNAPSHOT_REPO_PORT,
  type SnapshotRepoPort,
} from '~/modules/snapshot/ports/snapshot.repo.port'
import type { SnapshotServicePort } from '~/modules/snapshot/ports/snapshot.service.port'
import { buildSnapshotHash } from '~/shared/crypto/hash.crypto'

@Injectable()
export class SnapshotService implements SnapshotServicePort {
  constructor(
    @Inject(SNAPSHOT_REPO_PORT)
    private readonly snapshotRepo: SnapshotRepoPort,

    @Inject(SNAPSHOT_PAYLOAD_BUILDER_PORT)
    private readonly payloadBuilder: SnapshotPayloadBuilderPort,

    @Inject(LOGGER_PORT)
    private readonly logger: AppLoggerService,
  ) {}

  async create(
    cmd: ProjectSnapshotReqCmd.Create,
  ): Promise<ProjectSnapshotRes.Create> {
    const payload = await this.payloadBuilder.build({
      projectId: cmd.projectId,
    })

    const hash = buildSnapshotHash(payload)

    const latestSnapshot = await this.snapshotRepo.getLatest({
      projectId: cmd.projectId,
    })

    if (
      cmd.skipIfUnchanged === true &&
      latestSnapshot !== null &&
      latestSnapshot.hash === hash
    ) {
      return latestSnapshot
    }

    const version = await this.snapshotRepo.getNextVersion({
      projectId: cmd.projectId,
    })

    return await this.snapshotRepo.create({
      projectId: cmd.projectId,
      version,
      payload,
      hash,
      comment: cmd.comment,
    })
  }

  async getList(
    cmd: ProjectSnapshotReqCmd.GetList,
  ): Promise<ProjectSnapshotRes.GetList> {
    return await this.snapshotRepo.getList(cmd)
  }

  async getById(
    cmd: ProjectSnapshotReqCmd.GetById,
  ): Promise<ProjectSnapshotRes.GetById> {
    const snapshot = await this.snapshotRepo.getById(cmd)

    if (snapshot === null) {
      throw new AppError(ErrorEnum.SOURCE_NOT_FOUND, this.logger, {}).log(
        'Snapshot not found',
      )
    }
    return snapshot
  }

  async getByVersion(
    cmd: ProjectSnapshotReqCmd.GetByVersion,
  ): Promise<ProjectSnapshotRes.GetByVersion> {
    const snapshot = await this.snapshotRepo.getByVersion(cmd)

    if (snapshot === null) {
      throw new AppError(ErrorEnum.SOURCE_NOT_FOUND, this.logger, {}).log(
        'Snapshot not found',
      )
    }
    return snapshot
  }

  async getPayload(
    cmd: ProjectSnapshotReqCmd.GetPayload,
  ): Promise<ProjectSnapshotRes.GetPayload> {
    const snapshotPayload = await this.snapshotRepo.getPayload(cmd)

    if (snapshotPayload === null) {
      throw new AppError(ErrorEnum.SOURCE_NOT_FOUND, this.logger, {}).log(
        'Snapshot not found',
      )
    }
    return snapshotPayload
  }

  async getStatus(
    cmd: ProjectSnapshotReqCmd.GetStatus,
  ): Promise<ProjectSnapshotRes.GetStatus> {
    const latestSnapshot = await this.snapshotRepo.getLatest({
      projectId: cmd.projectId,
    })

    if (latestSnapshot === null) {
      return {
        projectId: cmd.projectId,
        hasSnapshots: false,
        isOutdated: true,
        latestSnapshotId: null,
        latestVersion: null,
        lastCreatedAt: null,
      }
    }

    const payload = await this.payloadBuilder.build({
      projectId: cmd.projectId,
    })
    const currentHash = buildSnapshotHash(payload)
    const isOutdated = latestSnapshot.hash !== currentHash

    return {
      projectId: cmd.projectId,
      hasSnapshots: true,
      isOutdated: isOutdated,
      latestSnapshotId: latestSnapshot.id,
      latestVersion: latestSnapshot.version,
      lastCreatedAt: latestSnapshot.createdAt,
    }
  }
}
