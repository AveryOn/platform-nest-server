import { Inject, Injectable } from '@nestjs/common'
import { and, eq } from 'drizzle-orm'
import { defineDb } from '~/infra/drizzle/application/drizzle.helpers'
import type { Tx } from '~/infra/drizzle/application/drizzle.type'
import {
  DRIZZLE_PORT,
  type DrizzleServicePort,
} from '~/infra/drizzle/ports/drizzle.service.port'
import { brandsTable, projectsTable } from '~/infra/drizzle/schemas'
import type { BrandRawEntity } from '~/modules/brand/application/brand.type'
import type { BrandRepoPort } from '~/modules/brand/ports/brand.repo.port'

@Injectable()
export class BrandDrizzleRepo implements BrandRepoPort {
  constructor(
    @Inject(DRIZZLE_PORT)
    private readonly drizzle: DrizzleServicePort,
  ) {}
  async getByName(
    cmd: { name: string; organizationId: string },
    tx?: Tx,
  ): Promise<BrandRawEntity | null> {
    const db = defineDb(this.drizzle.db, tx)

    const [brand] = await db
      .select()
      .from(brandsTable)
      .where(
        and(
          eq(brandsTable.organizationId, cmd.organizationId),
          eq(brandsTable.name, cmd.name),
        ),
      )
      .limit(1)

    return brand ?? null
  }
  async create(
    cmd: {
      name: string
      organizationId: string
    },
    tx?: Tx,
  ): Promise<BrandRawEntity> {
    const db = defineDb(this.drizzle.db, tx)

    const [brand] = await db
      .insert(brandsTable)
      .values({
        name: cmd.name,
        organizationId: cmd.organizationId,
      })
      .returning()

    return brand
  }
  async findBrandByProjectId(
    cmd: { projectId: string; organizationId: string },
    tx?: Tx,
  ): Promise<BrandRawEntity | null> {
    const db = defineDb(this.drizzle.db, tx)

    const [row] = await db
      .select({
        brand: brandsTable,
      })
      .from(projectsTable)
      .innerJoin(
        brandsTable,
        and(
          eq(brandsTable.id, projectsTable.brandId),
          eq(brandsTable.organizationId, projectsTable.organizationId),
        ),
      )
      .where(
        and(
          eq(projectsTable.id, cmd.projectId),
          eq(projectsTable.organizationId, cmd.organizationId),
        ),
      )
      .limit(1)

    return row.brand as BrandRawEntity | null
  }
  async findBrandOrFail(
    cmd: { brandId: string; organizationId: string },
    tx?: Tx,
  ): Promise<BrandRawEntity> {
    const db = defineDb(this.drizzle.db, tx)

    const [brand] = await db
      .select()
      .from(brandsTable)
      .where(
        and(
          eq(brandsTable.id, cmd.brandId),
          eq(brandsTable.organizationId, cmd.organizationId),
        ),
      )
      .limit(1)

    if (!brand) {
      throw new Error('Brand not found')
    }

    return brand
  }

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
