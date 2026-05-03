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
import type {
  ProjectReqCmd,
  ProjectRes,
} from '~/modules/project/application/project.type'
import {
  PROJECT_REPO_PORT,
  type ProjectRepoPort,
} from '~/modules/project/ports/project.repo.port'
import type { ProjectServicePort } from '~/modules/project/ports/project.service.port'
import {
  TEMPLATE_REPO_PORT,
  type TemplateRepoPort,
} from '~/modules/template/ports/template.repo.port'
import { OperationStatus } from '~/shared/const/app.const'

@Injectable()
export class ProjectService implements ProjectServicePort {
  constructor(
    @Inject(BRAND_REPO_PORT)
    private readonly brandRepo: BrandRepoPort,

    @Inject(PROJECT_REPO_PORT)
    private readonly projectRepo: ProjectRepoPort,

    @Inject(TEMPLATE_REPO_PORT)
    private readonly templateRepo: TemplateRepoPort,

    @Inject(LOGGER_PORT)
    private readonly logger: AppLoggerService,

    @Inject(TX_PORT)
    private readonly transaction: TransactionPort<TransactionContext>,
  ) {}
  async getList(cmd: ProjectReqCmd.GetList): Promise<ProjectRes.GetList> {
    if (cmd.brandId) {
      // Brand checks
      await this.checkBrandOrFail({
        organizationId: cmd.organizationId,
        brandId: cmd.brandId,
      })

      return await this.projectRepo.getList({
        ...cmd,
        organizationId: cmd.organizationId,
      })
    }
    return await this.projectRepo.getList({
      ...cmd,
      organizationId: cmd.organizationId,
    })
  }

  async getById(cmd: ProjectReqCmd.GetById): Promise<ProjectRes.GetById> {
    const project = await this.projectRepo.getById({
      ...cmd,
      organizationId: cmd.organizationId,
    })

    if (!project) {
      throw new AppError(ErrorEnum.SOURCE_NOT_FOUND, this.logger).log(
        'Project not found',
      )
    }

    return project
  }

  async create(cmd: ProjectReqCmd.Create): Promise<ProjectRes.Create> {
    return await this.transaction.run(async (tx) => {
      if (cmd.templateSnapshotId) {
        const snapshot = await this.templateRepo.getSnapshotById(
          { templateSnapshotId: cmd.templateSnapshotId },
          tx,
        )
        if (!snapshot) {
          throw new AppError(ErrorEnum.SOURCE_NOT_FOUND, this.logger).log(
            'There is no snapshot for this ID.',
          )
        }
      }
      // Brand checks
      await this.checkBrandOrFail({
        organizationId: cmd.organizationId,
        brandId: cmd.brandId,
        brandIdRequired: true,
      })

      return await this.projectRepo.create(
        { ...cmd, organizationId: cmd.organizationId },
        tx,
      )
    })
  }

  async update(cmd: ProjectReqCmd.Update): Promise<ProjectRes.Update> {
    return await this.transaction.run(async (tx) => {
      const project = await this.projectRepo.getById(
        { ...cmd, organizationId: cmd.organizationId },
        tx,
      )
      if (!project) {
        throw new AppError(ErrorEnum.SOURCE_NOT_FOUND, this.logger).log(
          'Project not found',
        )
      }

      if (cmd.templateSnapshotId) {
        const snapshot = await this.templateRepo.getSnapshotById(
          { templateSnapshotId: cmd.templateSnapshotId },
          tx,
        )
        if (!snapshot) {
          throw new AppError(ErrorEnum.SOURCE_NOT_FOUND, this.logger).log(
            'There is no snapshot for this ID.',
          )
        }
      }
      // Brand checks
      await this.checkBrandOrFail(
        {
          organizationId: cmd.organizationId,
          brandId: cmd.brandId,
          brandIdRequired: false,
        },
        tx,
      )

      return await this.projectRepo.update(
        { ...cmd, organizationId: cmd.organizationId },
        tx,
      )
    })
  }

  async delete(cmd: ProjectReqCmd.Delete): Promise<ProjectRes.Delete> {
    return await this.transaction.run(async (tx) => {
      const project = await this.projectRepo.getById(
        { ...cmd, organizationId: cmd.organizationId },
        tx,
      )

      if (!project) {
        throw new AppError(ErrorEnum.SOURCE_NOT_FOUND, this.logger).log(
          'Project not found',
        )
      }

      const result = await this.projectRepo.delete(
        { ...cmd, organizationId: cmd.organizationId },
        tx,
      )

      return {
        archivedAt: result.archivedAt,
        projectId: cmd.projectId,
        status: OperationStatus.success,
      }
    })
  }

  private async checkBrandOrFail(
    params: {
      brandId?: string
      organizationId: string
      brandIdRequired?: boolean
    },
    tx?: TransactionContext,
  ): Promise<void> {
    if (params.brandId) {
      const brand = await this.brandRepo.getById(params.brandId, tx)
      if (!brand) {
        throw new AppError(ErrorEnum.SOURCE_NOT_FOUND, this.logger).log(
          'Brand is not found',
        )
      }
      if (brand.organizationId !== params.organizationId) {
        throw new AppError(ErrorEnum.FORBIDDEN, this.logger).log(
          'Brand does not belong to organization',
        )
      }
    } else if (params.brandIdRequired === true) {
      throw new AppError(ErrorEnum.SOURCE_NOT_FOUND, this.logger).log(
        'Brand is not found',
      )
    }
  }
}
