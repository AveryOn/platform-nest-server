import { Inject, Injectable } from '@nestjs/common'
import { eq } from 'drizzle-orm'

import type {
  CreateTemplateCmd,
  TemplateRecord,
  UpdateTemplateMetaCmd,
} from '~/bootstrap/templates/application/service/template.types'
import type { TemplateRepoPort } from '~/bootstrap/templates/ports/template.repo.port'
import { defineDb } from '~/infra/drizzle/application/drizzle.helpers'
import type { Tx } from '~/infra/drizzle/application/drizzle.type'
import {
  DRIZZLE_PORT,
  type DrizzleServicePort,
} from '~/infra/drizzle/ports/drizzle.service.port'
import { templatesTable } from '~/infra/drizzle/schemas/templates'

@Injectable()
export class DrizzleTemplateRepo implements TemplateRepoPort {
  constructor(
    @Inject(DRIZZLE_PORT)
    private readonly drizzle: DrizzleServicePort,
  ) {}

  async findBySlug(
    slug: string,
    tx?: Tx,
  ): Promise<TemplateRecord | null> {
    const db = defineDb(this.drizzle.db, tx)

    const [template] = await db
      .select()
      .from(templatesTable)
      .where(eq(templatesTable.slug, slug))
      .limit(1)

    return template ?? null
  }

  async create(cmd: CreateTemplateCmd, tx?: Tx): Promise<TemplateRecord> {
    const db = defineDb(this.drizzle.db, tx)

    const [template] = await db
      .insert(templatesTable)
      .values({
        slug: cmd.slug,
        name: cmd.name,
        description: cmd.description,
      })
      .returning()

    return template
  }

  async updateMeta(
    cmd: UpdateTemplateMetaCmd,
    tx?: Tx,
  ): Promise<TemplateRecord> {
    const db = defineDb(this.drizzle.db, tx)

    const [template] = await db
      .update(templatesTable)
      .set({
        name: cmd.name,
        description: cmd.description,
      })
      .where(eq(templatesTable.id, cmd.id))
      .returning()

    return template
  }
}
