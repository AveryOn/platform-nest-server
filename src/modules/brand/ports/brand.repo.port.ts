import type { TransactionContext } from '~/infra/transaction/application/transaction.type'
import type { BrandRawEntity } from '~/modules/brand/application/brand.type'

export const BRAND_REPO_PORT = Symbol('BRAND_REPO_PORT')

export abstract class BrandRepoPort {
  abstract getById(
    brandId: string,
    tx?: TransactionContext,
  ): Promise<BrandRawEntity | null>

  abstract findBrandOrFail(
    cmd: {
      brandId: string
      organizationId: string
    },
    tx?: TransactionContext,
  ): Promise<BrandRawEntity>

  abstract findBrandByProjectId(
    cmd: {
      projectId: string
      organizationId: string
    },
    tx?: TransactionContext,
  ): Promise<BrandRawEntity | null>
}
