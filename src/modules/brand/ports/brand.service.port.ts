import type { BrandEntity } from '~/modules/brand/application/brand.type'

export const BRAND_SERVICE_PORT = Symbol('BRAND_SERVICE_PORT')

export abstract class BrandServicePort {
  abstract getById(brandId: string): Promise<BrandEntity>
}
