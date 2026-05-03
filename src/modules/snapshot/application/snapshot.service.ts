import { Inject, Injectable } from '@nestjs/common'
import { AppError } from '~/core/error/app-error'
import { ErrorEnum } from '~/core/error/app-error.dict'
import { LOGGER_PORT } from '~/core/logger/logger.port'
import type { AppLoggerService } from '~/core/logger/logger.service'
import type { TransactionContext } from '~/infra/transaction/application/transaction.type'
import {
  TX_PORT,
  type TransactionPort,
} from '~/infra/transaction/ports/transaction.port'
import {
  BRAND_REPO_PORT,
  type BrandRepoPort,
} from '~/modules/brand/ports/brand.repo.port'
import {
  PROJECT_REPO_PORT,
  type ProjectRepoPort,
} from '~/modules/project/ports/project.repo.port'
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

    @Inject(BRAND_REPO_PORT)
    private readonly brandRepo: BrandRepoPort,

    @Inject(PROJECT_REPO_PORT)
    private readonly projectRepo: ProjectRepoPort,

    @Inject(SNAPSHOT_PAYLOAD_BUILDER_PORT)
    private readonly payloadBuilder: SnapshotPayloadBuilderPort,

    @Inject(LOGGER_PORT)
    private readonly logger: AppLoggerService,

    @Inject(TX_PORT)
    private readonly transaction: TransactionPort<TransactionContext>,
  ) {}

  async create(
    cmd: ProjectSnapshotReqCmd.Create,
  ): Promise<ProjectSnapshotRes.Create> {
    const payload = await this.payloadBuilder.build({
      projectId: cmd.projectId,
      organizationId: cmd.organizationId,
    })

    const hash = buildSnapshotHash(payload)

    return await this.transaction.run(async (tx) => {
      await this.checkProjectOrFail(
        { organizationId: cmd.organizationId, projectId: cmd.projectId },
        tx,
      )
      const latestSnapshot = await this.snapshotRepo.getLatest(
        {
          projectId: cmd.projectId,
        },
        tx,
      )

      if (
        cmd.skipIfUnchanged === true &&
        latestSnapshot !== null &&
        latestSnapshot.hash === hash
      ) {
        return latestSnapshot
      }

      const version = await this.snapshotRepo.getNextVersion(
        {
          projectId: cmd.projectId,
        },
        tx,
      )

      return await this.snapshotRepo.create(
        {
          projectId: cmd.projectId,
          version,
          payload,
          hash,
          comment: cmd.comment,
        },
        tx,
      )
    })
  }

  async getList(
    cmd: ProjectSnapshotReqCmd.GetList,
  ): Promise<ProjectSnapshotRes.GetList> {
    return await this.transaction.run(async (tx) => {
      await this.checkProjectOrFail(
        { organizationId: cmd.organizationId, projectId: cmd.projectId },
        tx,
      )

      return await this.snapshotRepo.getList(cmd, tx)
    })
  }

  async getById(
    cmd: ProjectSnapshotReqCmd.GetById,
  ): Promise<ProjectSnapshotRes.GetById> {
    const snapshot = await this.transaction.run(async (tx) => {
      await this.checkProjectOrFail(
        { organizationId: cmd.organizationId, projectId: cmd.projectId },
        tx,
      )

      return await this.snapshotRepo.getById(cmd, tx)
    })

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
    const snapshot = await this.transaction.run(async (tx) => {
      await this.checkProjectOrFail(
        { organizationId: cmd.organizationId, projectId: cmd.projectId },
        tx,
      )

      return await this.snapshotRepo.getByVersion(cmd, tx)
    })

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
    const snapshotPayload = await this.transaction.run(async (tx) => {
      await this.checkProjectOrFail(
        { organizationId: cmd.organizationId, projectId: cmd.projectId },
        tx,
      )

      return await this.snapshotRepo.getPayload(cmd, tx)
    })

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
    return await this.transaction.run(async (tx) => {
      await this.checkProjectOrFail(
        { organizationId: cmd.organizationId, projectId: cmd.projectId },
        tx,
      )

      const latestSnapshot = await this.snapshotRepo.getLatest(
        { projectId: cmd.projectId },
        tx,
      )

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
        organizationId: cmd.organizationId,
      })

      const currentHash = buildSnapshotHash(payload)
      const isOutdated = latestSnapshot.hash !== currentHash

      return {
        projectId: cmd.projectId,
        hasSnapshots: true,
        isOutdated,
        latestSnapshotId: latestSnapshot.id,
        latestVersion: latestSnapshot.version,
        lastCreatedAt: latestSnapshot.createdAt,
      }
    })
  }

  private async checkProjectOrFail(
    cmd: {
      projectId: string
      organizationId: string
    },
    tx?: TransactionContext,
  ) {
    const brand = await this.brandRepo.findBrandByProjectId(
      {
        projectId: cmd.projectId,
        organizationId: cmd.organizationId,
      },
      tx,
    )

    if (!brand) {
      throw new AppError(ErrorEnum.SOURCE_NOT_FOUND, this.logger).log(
        'Brand not found',
      )
    }

    await this.projectRepo.findProjectOrFail(
      {
        brandId: brand.id,
        organizationId: cmd.organizationId,
        projectId: cmd.projectId,
      },
      tx,
    )
  }
}
