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
import type {
  TemplateEntity,
  TemplateReqCmd,
  TemplateRes,
  TemplateSnapshotEntity,
} from '~/modules/template/application/template.type'
import {
  TEMPLATE_REPO_PORT,
  type TemplateRepoPort,
} from '~/modules/template/ports/template.repo.port'
import type { TemplateServicePort } from '~/modules/template/ports/template.service.port'

@Injectable()
export class TemplateService implements TemplateServicePort {
  constructor(
    @Inject(TEMPLATE_REPO_PORT)
    private readonly templateRepo: TemplateRepoPort,

    @Inject(TX_PORT)
    private readonly transaction: TransactionPort<TransactionContext>,

    @Inject(LOGGER_PORT)
    private readonly logger: AppLoggerService,
  ) {}

  async getList(
    cmd: TemplateReqCmd.getList,
  ): Promise<TemplateRes.getList> {
    return await this.transaction.run(async (tx) => {
      const result = await this.templateRepo.getList(cmd, tx)

      return {
        data: result.data.map((template) => this.mapTemplate(template)),
        paginator: result.paginator,
      }
    })
  }

  async getSnapshotList(
    cmd: TemplateReqCmd.getSnapshotList,
  ): Promise<TemplateRes.getSnapshotList> {
    return await this.transaction.run(async (tx) => {
      const template = await this.templateRepo.getById(
        {
          templateId: cmd.templateId,
        },
        tx,
      )

      if (!template) {
        throw new AppError(ErrorEnum.SOURCE_NOT_FOUND, this.logger).log(
          'Template not found',
        )
      }

      const result = await this.templateRepo.getSnapshotList(cmd, tx)

      const data = result.data.map((snapshot) =>
        this.mapTemplateSnapshot(snapshot),
      )
      const paginator = result.paginator

      return { data, paginator }
    })
  }

  async getById(
    cmd: TemplateReqCmd.getById,
  ): Promise<TemplateRes.getById> {
    const template = await this.templateRepo.getById(cmd)

    if (!template) {
      throw new AppError(ErrorEnum.SOURCE_NOT_FOUND, this.logger).log(
        'Template not found',
      )
    }

    return this.mapTemplate(template)
  }

  private mapTemplate(input: {
    id: string
    slug: string
    name: string
    description: string | null
    createdAt: Date | string
    updatedAt: Date | string | null
  }): TemplateEntity {
    return {
      id: input.id,
      slug: input.slug,
      name: input.name,
      description: input.description,
      createdAt: this.toIsoString(input.createdAt)!,
      updatedAt: this.toIsoString(input.updatedAt),
    }
  }

  private mapTemplateSnapshot(input: {
    id: string
    templateId: string
    version: number
    hash: string
    createdAt: Date | string
  }): TemplateSnapshotEntity {
    return {
      id: input.id,
      templateId: input.templateId,
      version: input.version,
      hash: input.hash,
      createdAt: this.toIsoString(input.createdAt)!,
    }
  }

  private toIsoString(value: Date | string | null): string | null {
    if (!value) {
      return null
    }
    return value instanceof Date ? value.toISOString() : value
  }
}
