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
  BrandEntity,
  BrandRawEntity,
} from '~/modules/brand/application/brand.type'
import {
  BRAND_REPO_PORT,
  type BrandRepoPort,
} from '~/modules/brand/ports/brand.repo.port'
import type { BrandServicePort } from '~/modules/brand/ports/brand.service.port'

@Injectable()
export class BrandService implements BrandServicePort {
  constructor(
    @Inject(BRAND_REPO_PORT)
    private readonly brandRepo: BrandRepoPort,

    @Inject(TX_PORT)
    private readonly transaction: TransactionPort<TransactionContext>,

    @Inject(LOGGER_PORT)
    private readonly logger: AppLoggerService,
  ) {}
  async create(cmd: {
    name: string
    organizationId: string
  }): Promise<BrandEntity> {
    return await this.transaction.run(async (tx) => {
      //  Check if already exists
      const existingBrand = await this.brandRepo.getByName(cmd, tx)
      if (existingBrand) {
        throw new AppError(ErrorEnum.CONFLICT, this.logger).log(
          'A brand with this name already exists',
        )
      }

      const created = await this.brandRepo.create(cmd, tx)

      return this.toItemResult(created)
    })
  }

  async getById(brandId: string): Promise<BrandEntity> {
    const rawBrand = await this.brandRepo.getById(brandId)
    if (!rawBrand) {
      throw new AppError(ErrorEnum.SOURCE_NOT_FOUND, this.logger).log(
        'Brand is not found',
      )
    }

    return this.toItemResult(rawBrand)
  }

  private toItemResult(entity: BrandRawEntity): BrandEntity {
    return {
      id: entity.id,
      name: entity.name,
      organizationId: entity.organizationId,
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt ? entity.updatedAt.toISOString() : null,
    }
  }
}
