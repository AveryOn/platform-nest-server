// src/modules/template/infra/persistence/template.drizzle.repo.ts

import { Inject, Injectable } from '@nestjs/common'
import { count, desc, eq } from 'drizzle-orm'
import { defineDb } from '~/infra/drizzle/application/drizzle.helpers'
import type { Tx } from '~/infra/drizzle/application/drizzle.type'
import {
  DRIZZLE_PORT,
  type DrizzleServicePort,
} from '~/infra/drizzle/ports/drizzle.service.port'
import {
  templateSnapshotsTable,
  templatesTable,
} from '~/infra/drizzle/schemas'
import type {
  TemplateRepoCmd,
  TemplateRepoRes,
} from '~/modules/template/application/template.type'
import type { TemplateRepoPort } from '~/modules/template/ports/template.repo.port'
import {
  PAGINATOR_PORT,
  type PaginatorServicePort,
} from '~/shared/paginator/ports/paginator.service.port'

@Injectable()
export class TemplateDrizzleRepo implements TemplateRepoPort {
  constructor(
    @Inject(DRIZZLE_PORT)
    private readonly drizzle: DrizzleServicePort,

    @Inject(PAGINATOR_PORT)
    private readonly paginator: PaginatorServicePort,
  ) {}

  async getList(
    cmd: TemplateRepoCmd.getList,
    tx?: Tx,
  ): Promise<TemplateRepoRes.getList> {
    const db = defineDb(this.drizzle.db, tx)
    const { skip, take } = this.paginator.config({
      limit: cmd.limit,
      page: cmd.page,
    })

    const [totalRow] = await db
      .select({
        total: count(),
      })
      .from(templatesTable)

    const data = await db
      .select({
        id: templatesTable.id,
        slug: templatesTable.slug,
        name: templatesTable.name,
        description: templatesTable.description,
        createdAt: templatesTable.createdAt,
        updatedAt: templatesTable.updatedAt,
      })
      .from(templatesTable)
      .orderBy(desc(templatesTable.createdAt))
      .offset(skip)
      .limit(take)

    const paginator = this.paginator.response({
      data,
      total: totalRow.total,
    })
    return {
      data,
      paginator,
    }
  }

  async getById(
    cmd: TemplateRepoCmd.getById,
    tx?: Tx,
  ): Promise<TemplateRepoRes.getById> {
    const db = defineDb(this.drizzle.db, tx)

    const [template] = await db
      .select({
        id: templatesTable.id,
        slug: templatesTable.slug,
        name: templatesTable.name,
        description: templatesTable.description,
        createdAt: templatesTable.createdAt,
        updatedAt: templatesTable.updatedAt,
      })
      .from(templatesTable)
      .where(eq(templatesTable.id, cmd.templateId))
      .limit(1)

    return template ?? null
  }

  async getSnapshotList(
    cmd: TemplateRepoCmd.getSnapshotList,
    tx?: Tx,
  ): Promise<TemplateRepoRes.getSnapshotList> {
    const db = defineDb(this.drizzle.db, tx)

    const { skip, take } = this.paginator.config({
      limit: cmd.limit,
      page: cmd.page,
    })

    const [totalRow] = await db
      .select({
        total: count(),
      })
      .from(templateSnapshotsTable)
      .where(eq(templateSnapshotsTable.templateId, cmd.templateId))

    const data = await db
      .select({
        id: templateSnapshotsTable.id,
        templateId: templateSnapshotsTable.templateId,
        version: templateSnapshotsTable.version,
        hash: templateSnapshotsTable.hash,
        createdAt: templateSnapshotsTable.createdAt,
      })
      .from(templateSnapshotsTable)
      .where(eq(templateSnapshotsTable.templateId, cmd.templateId))
      .orderBy(desc(templateSnapshotsTable.version))
      .offset(skip)
      .limit(take)

    const paginator = this.paginator.response({
      data,
      total: totalRow.total,
    })

    return {
      data,
      paginator,
    }
  }
}
