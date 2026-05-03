import { Inject, Injectable } from '@nestjs/common'
import { and, count, desc, eq } from 'drizzle-orm'
import { defineDb } from '~/infra/drizzle/application/drizzle.helpers'
import type { Tx } from '~/infra/drizzle/application/drizzle.type'
import {
  DRIZZLE_PORT,
  type DrizzleServicePort,
} from '~/infra/drizzle/ports/drizzle.service.port'
import { apiKeysTable } from '~/infra/drizzle/schemas'
import {
  ApiKeyStatus,
  type ApiKeyRawEntity,
  type ApiKeyRepoCmd,
  type ApiKeyRepoRes,
} from '~/modules/api-key/application/api-key.type'
import type { ApiKeyRepoPort } from '~/modules/api-key/ports/api-key.repo.port'
import {
  PAGINATOR_PORT,
  type PaginatorServicePort,
} from '~/shared/paginator/ports/paginator.service.port'

@Injectable()
export class ApiKeyDrizzleRepo implements ApiKeyRepoPort {
  constructor(
    @Inject(DRIZZLE_PORT)
    private readonly drizzle: DrizzleServicePort,

    @Inject(PAGINATOR_PORT)
    private readonly paginator: PaginatorServicePort,
  ) {}

  async create(
    cmd: ApiKeyRepoCmd.Create,
    tx?: Tx,
  ): Promise<ApiKeyRepoRes.Create> {
    const db = defineDb(this.drizzle.db, tx)

    const [apiKey] = await db
      .insert(apiKeysTable)
      .values({
        name: cmd.name,
        brandId: cmd.brandId,
        projectId: cmd.projectId ?? null,
        organizationId: cmd.organizationId,
        createdByUserId: cmd.createdByUserId,
        keyHash: cmd.keyHash,
        keyPrefix: cmd.keyPrefix,
        scopes: cmd.scopes,
        expiresAt: cmd.expiresAt ?? null,
      })
      .returning()

    return apiKey as ApiKeyRawEntity
  }

  async getList(
    cmd: ApiKeyRepoCmd.GetList,
    tx?: Tx,
  ): Promise<ApiKeyRepoRes.GetList> {
    const db = defineDb(this.drizzle.db, tx)

    const { skip, take } = this.paginator.config({
      limit: cmd.limit,
      page: cmd.page,
    })

    const where = and(
      eq(apiKeysTable.organizationId, cmd.organizationId),
      cmd.brandId ? eq(apiKeysTable.brandId, cmd.brandId) : undefined,
      cmd.projectId
        ? eq(apiKeysTable.projectId, cmd.projectId)
        : undefined,
      cmd.status ? eq(apiKeysTable.status, cmd.status) : undefined,
    )

    const [totalRow] = await db
      .select({
        total: count(),
      })
      .from(apiKeysTable)
      .where(where)

    const rows = await db
      .select()
      .from(apiKeysTable)
      .where(where)
      .orderBy(desc(apiKeysTable.createdAt))
      .limit(take)
      .offset(skip)

    const paginatorMeta = this.paginator.response({
      data: rows,
      total: totalRow?.total ?? 0,
    })

    return {
      data: rows as ApiKeyRawEntity[],
      paginator: paginatorMeta,
    }
  }

  async getById(
    cmd: ApiKeyRepoCmd.GetById,
    tx?: Tx,
  ): Promise<ApiKeyRepoRes.GetById> {
    const db = defineDb(this.drizzle.db, tx)

    const [apiKey] = await db
      .select()
      .from(apiKeysTable)
      .where(
        and(
          eq(apiKeysTable.id, cmd.apiKeyId),
          eq(apiKeysTable.organizationId, cmd.organizationId),
        ),
      )
      .limit(1)

    return apiKey as ApiKeyRawEntity | null
  }

  async findByName(
    cmd: ApiKeyRepoCmd.FindByName,
    tx?: Tx,
  ): Promise<ApiKeyRepoRes.FindByName> {
    const db = defineDb(this.drizzle.db, tx)

    const [apiKey] = await db
      .select()
      .from(apiKeysTable)
      .where(
        and(
          eq(apiKeysTable.name, cmd.name),
          eq(apiKeysTable.organizationId, cmd.organizationId),
        ),
      )
      .limit(1)

    return (apiKey as ApiKeyRawEntity | undefined) ?? null
  }

  async revoke(
    cmd: ApiKeyRepoCmd.Revoke,
    tx?: Tx,
  ): Promise<ApiKeyRepoRes.Revoke> {
    const db = defineDb(this.drizzle.db, tx)

    const [apiKey] = await db
      .update(apiKeysTable)
      .set({
        status: ApiKeyStatus.Revoked,
        revokedAt: new Date(),
      })
      .where(
        and(
          eq(apiKeysTable.id, cmd.apiKeyId),
          eq(apiKeysTable.organizationId, cmd.organizationId),
        ),
      )
      .returning()

    return apiKey as ApiKeyRawEntity | null
  }

  async findByHash(
    cmd: ApiKeyRepoCmd.FindByHash,
    tx?: Tx,
  ): Promise<ApiKeyRepoRes.FindByHash> {
    const db = defineDb(this.drizzle.db, tx)

    const [apiKey] = await db
      .select()
      .from(apiKeysTable)
      .where(
        and(
          eq(apiKeysTable.keyHash, cmd.keyHash),
          eq(apiKeysTable.keyPrefix, cmd.keyPrefix),
        ),
      )
      .limit(1)

    return (apiKey as ApiKeyRawEntity | undefined) ?? null
  }

  async markUsed(cmd: ApiKeyRepoCmd.MarkUsed, tx?: Tx): Promise<void> {
    const db = defineDb(this.drizzle.db, tx)

    await db
      .update(apiKeysTable)
      .set({
        lastUsedAt: new Date(),
        lastUsedIp: cmd.ip ?? null,
        lastUsedUa: cmd.userAgent ?? null,
      })
      .where(eq(apiKeysTable.id, cmd.apiKeyId))
  }
}
