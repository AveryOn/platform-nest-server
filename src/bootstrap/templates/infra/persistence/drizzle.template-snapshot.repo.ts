import { Inject, Injectable } from '@nestjs/common'
import { desc, eq } from 'drizzle-orm'

import type {
  CreateTemplateSnapshotCmd,
  TemplateSnapshotRecord,
} from '~/bootstrap/templates/application/service/template.types'
import type { TemplateSnapshotRepoPort } from '~/bootstrap/templates/ports/template-snapshot.repo.port'
import { defineDb } from '~/infra/drizzle/application/drizzle.helpers'
import type { Tx } from '~/infra/drizzle/application/drizzle.type'
import {
  DRIZZLE_PORT,
  type DrizzleServicePort,
} from '~/infra/drizzle/ports/drizzle.service.port'
import { templateSnapshotsTable } from '~/infra/drizzle/schemas/template-snapshots'

@Injectable()
export class DrizzleTemplateSnapshotRepo implements TemplateSnapshotRepoPort {
  constructor(
    @Inject(DRIZZLE_PORT)
    private readonly drizzle: DrizzleServicePort,
  ) {}

  async findLatestByTemplateId(
    templateId: string,
    tx?: Tx,
  ): Promise<TemplateSnapshotRecord | null> {
    const db = defineDb(this.drizzle.db, tx)

    const [snapshot] = await db
      .select()
      .from(templateSnapshotsTable)
      .where(eq(templateSnapshotsTable.templateId, templateId))
      .orderBy(desc(templateSnapshotsTable.version))
      .limit(1)

    return (snapshot as TemplateSnapshotRecord | undefined) ?? null
  }

  async create(
    cmd: CreateTemplateSnapshotCmd,
    tx?: Tx,
  ): Promise<TemplateSnapshotRecord> {
    const db = defineDb(this.drizzle.db, tx)

    const [snapshot] = await db
      .insert(templateSnapshotsTable)
      .values({
        templateId: cmd.templateId,
        version: cmd.version,
        payload: cmd.payload,
        hash: cmd.hash,
      })
      .returning()

    return snapshot as TemplateSnapshotRecord
  }
}
