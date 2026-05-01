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

@Injectable()
export class ProjectService implements ProjectServicePort {
  constructor(
    @Inject(BRAND_REPO_PORT)
    private readonly brandRepo: BrandRepoPort,

    @Inject(PROJECT_REPO_PORT)
    private readonly projectRepo: ProjectRepoPort,

    @Inject(LOGGER_PORT)
    private readonly logger: AppLoggerService,

    @Inject(TX_PORT)
    private readonly transaction: TransactionPort<TransactionContext>,
  ) {}

  async getList(cmd: ProjectReqCmd.GetList): Promise<ProjectRes.GetList> {
    if (cmd.brandId) {
      return await this.transaction.run(async (tx) => {
        const brand = await this.brandRepo.getById(cmd.brandId!, tx)
        if (!brand) {
          throw new AppError(ErrorEnum.SOURCE_NOT_FOUND, this.logger).log(
            'Brand is not found',
          )
        }
        if (brand.organizationId !== cmd.organizationId) {
          throw new AppError(ErrorEnum.FORBIDDEN, this.logger).log(
            'Brand does not belong to organization',
          )
        }
        return await this.projectRepo.getList(cmd, tx)
      })
    }
    return await this.projectRepo.getList(cmd)
  }

  async getById(cmd: ProjectReqCmd.GetById): Promise<ProjectRes.GetById> {
    const project = await this.projectRepo.getById(cmd)

    if (!project) {
      throw new AppError(ErrorEnum.SOURCE_NOT_FOUND, this.logger).log(
        'Project not found',
      )
    }

    return project
  }

  async create(cmd: ProjectReqCmd.Create): Promise<ProjectRes.Create> {
    return await this.transaction.run(async (tx) => {
      const brand = await this.brandRepo.getById(cmd.brandId, tx)
      if (!brand) {
        throw new AppError(ErrorEnum.SOURCE_NOT_FOUND, this.logger).log(
          'Brand is not found',
        )
      }
      if (brand.organizationId !== cmd.organizationId) {
        throw new AppError(ErrorEnum.FORBIDDEN, this.logger).log(
          'Brand does not belong to organization',
        )
      }

      return await this.projectRepo.create(cmd, tx)
    })
  }

  async update(cmd: ProjectReqCmd.Update): Promise<ProjectRes.Update> {
    return await this.transaction.run(async (tx) => {
      const project = await this.projectRepo.getById(
        {
          organizationId: cmd.organizationId,
          projectId: cmd.projectId,
        },
        tx,
      )

      if (!project) {
        throw new AppError(ErrorEnum.SOURCE_NOT_FOUND, this.logger).log(
          'Project not found',
        )
      }

      return await this.projectRepo.update(cmd, tx)
    })
  }

  async delete(cmd: ProjectReqCmd.Delete): Promise<ProjectRes.Delete> {
    const project = await this.projectRepo.getById({
      organizationId: cmd.organizationId,
      projectId: cmd.projectId,
    })

    if (!project) {
      throw new AppError(ErrorEnum.SOURCE_NOT_FOUND, this.logger).log(
        'Project not found',
      )
    }

    return await this.projectRepo.delete(cmd)
  }
}
