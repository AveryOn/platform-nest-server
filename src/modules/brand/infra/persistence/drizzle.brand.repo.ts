import { Inject, Injectable } from '@nestjs/common'
import { eq } from 'drizzle-orm'
import { defineDb } from '~/infra/drizzle/application/drizzle.helpers'
import type { Tx } from '~/infra/drizzle/application/drizzle.type'
import {
  DRIZZLE_PORT,
  type DrizzleServicePort,
} from '~/infra/drizzle/ports/drizzle.service.port'
import { brandsTable } from '~/infra/drizzle/schemas'
import type { BrandRawEntity } from '~/modules/brand/application/brand.type'
import type { BrandRepoPort } from '~/modules/brand/ports/brand.repo.port'

@Injectable()
export class BrandDrizzleRepo implements BrandRepoPort {
  constructor(
    @Inject(DRIZZLE_PORT)
    private readonly drizzle: DrizzleServicePort,
  ) {}

  async getById(
    brandId: string,
    tx?: Tx,
  ): Promise<BrandRawEntity | null> {
    const db = defineDb(this.drizzle.db, tx)

    const [brand] = await db
      .select()
      .from(brandsTable)
      .where(eq(brandsTable.id, brandId))
      .limit(1)

    return brand
  }
}
