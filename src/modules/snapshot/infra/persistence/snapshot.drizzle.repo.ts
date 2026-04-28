import { Inject, Injectable } from '@nestjs/common'
import { and, count, desc, eq, max } from 'drizzle-orm'
import { defineDb } from '~/infra/drizzle/application/drizzle.helpers'
import type { DrizzleService } from '~/infra/drizzle/application/drizzle.service'
import type { Tx } from '~/infra/drizzle/application/drizzle.type'
import { DRIZZLE_PORT } from '~/infra/drizzle/ports/drizzle.service.port'
import { projectRuleSnapshotsTable } from '~/infra/drizzle/schemas'
import type {
    ProjectSnapshotEntity,
    ProjectSnapshotRes,
    SnapshotPayload,
    SnapshotRepoCmd,
} from '~/modules/snapshot/application/snapshot.type'
import { type SnapshotRepoPort } from '~/modules/snapshot/ports/snapshot.repo.port'
import {
    PAGINATOR_PORT,
    type PaginatorServicePort,
} from '~/shared/paginator/ports/paginator.service.port'

@Injectable()
export class SnapshotDrizzleRepo implements SnapshotRepoPort {
  constructor(
    @Inject(PAGINATOR_PORT)
    private readonly paginator: PaginatorServicePort,

    @Inject(DRIZZLE_PORT)
    private readonly drizzle: DrizzleService,
  ) {}

  async create(
    cmd: SnapshotRepoCmd.Create,
    tx?: Tx,
  ): Promise<ProjectSnapshotEntity> {
    const db = defineDb(this.drizzle.db, tx)

    const [snapshot] = await db
      .insert(projectRuleSnapshotsTable)
      .values({
        projectId: cmd.projectId,
        version: cmd.version,
        payload: cmd.payload,
        hash: cmd.hash,
        comment: cmd.comment ?? null,
      })
      .returning()

    return this.toEntity(snapshot)
  }

  async getList(
    cmd: SnapshotRepoCmd.GetList,
    tx?: Tx,
  ): Promise<ProjectSnapshotRes.GetList> {
    const db = defineDb(this.drizzle.db, tx)

    const { skip, take } = this.paginator.config({
      limit: cmd.limit,
      page: cmd.page,
    })

    const [totalRow] = await db
      .select({
        total: count(),
      })
      .from(projectRuleSnapshotsTable)
      .where(eq(projectRuleSnapshotsTable.projectId, cmd.projectId))

    const rows = await db
      .select()
      .from(projectRuleSnapshotsTable)
      .where(eq(projectRuleSnapshotsTable.projectId, cmd.projectId))
      .orderBy(desc(projectRuleSnapshotsTable.version))
      .limit(take)
      .offset(skip)

    const total = totalRow?.total ?? 0
    const paginator = this.paginator.response({
      data: rows,
      total,
    })
    const data = rows.map((row) => this.toEntity(row))

    return {
      data,
      paginator,
    }
  }

  async getById(
    cmd: SnapshotRepoCmd.GetById,
    tx?: Tx,
  ): Promise<ProjectSnapshotEntity | null> {
    const db = defineDb(this.drizzle.db, tx)

    const [snapshot] = await db
      .select()
      .from(projectRuleSnapshotsTable)
      .where(
        and(
          eq(projectRuleSnapshotsTable.projectId, cmd.projectId),
          eq(projectRuleSnapshotsTable.id, cmd.snapshotId),
        ),
      )
      .limit(1)

    return snapshot ? this.toEntity(snapshot) : null
  }

  async getByVersion(
    cmd: SnapshotRepoCmd.GetByVersion,
    tx?: Tx,
  ): Promise<ProjectSnapshotEntity | null> {
    const db = defineDb(this.drizzle.db, tx)

    const [snapshot] = await db
      .select()
      .from(projectRuleSnapshotsTable)
      .where(
        and(
          eq(projectRuleSnapshotsTable.projectId, cmd.projectId),
          eq(projectRuleSnapshotsTable.version, cmd.version),
        ),
      )
      .limit(1)

    return snapshot ? this.toEntity(snapshot) : null
  }

  async getPayload(
    cmd: SnapshotRepoCmd.GetPayload,
    tx?: Tx,
  ): Promise<ProjectSnapshotRes.GetPayload | null> {
    const db = defineDb(this.drizzle.db, tx)

    const [snapshot] = await db
      .select()
      .from(projectRuleSnapshotsTable)
      .where(
        and(
          eq(projectRuleSnapshotsTable.projectId, cmd.projectId),
          eq(projectRuleSnapshotsTable.id, cmd.snapshotId),
        ),
      )
      .limit(1)

    if (!snapshot) {
      return null
    }

    return {
      snapshotId: snapshot.id,
      projectId: snapshot.projectId,
      version: snapshot.version,
      payload: snapshot.payload as SnapshotPayload,
    }
  }

  async getLatest(
    cmd: SnapshotRepoCmd.GetLatest,
    tx?: Tx,
  ): Promise<ProjectSnapshotEntity | null> {
    const db = defineDb(this.drizzle.db, tx)

    const [snapshot] = await db
      .select()
      .from(projectRuleSnapshotsTable)
      .where(eq(projectRuleSnapshotsTable.projectId, cmd.projectId))
      .orderBy(desc(projectRuleSnapshotsTable.version))
      .limit(1)

    return snapshot ? this.toEntity(snapshot) : null
  }

  async getNextVersion(
    cmd: SnapshotRepoCmd.GetNextVersion,
    tx?: Tx,
  ): Promise<number> {
    const db = defineDb(this.drizzle.db, tx)

    const [row] = await db
      .select({
        version: max(projectRuleSnapshotsTable.version),
      })
      .from(projectRuleSnapshotsTable)
      .where(eq(projectRuleSnapshotsTable.projectId, cmd.projectId))

    return (row?.version ?? 0) + 1
  }

  private toEntity(
    row: typeof projectRuleSnapshotsTable.$inferSelect,
  ): ProjectSnapshotEntity {
    return {
      id: row.id,
      projectId: row.projectId,
      comment: row.comment,
      version: row.version,
      hash: row.hash,
      createdAt: row.createdAt.toISOString(),
    }
  }
}
