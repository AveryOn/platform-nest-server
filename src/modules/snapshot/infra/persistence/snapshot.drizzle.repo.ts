import { Inject, Injectable } from '@nestjs/common'
import type { DrizzleService } from '~/infra/drizzle/application/drizzle.service'
import { DRIZZLE_SERVICE_PORT } from '~/infra/drizzle/ports/drizzle.service.port'
import { projectRuleSnapshotsTable } from '~/infra/drizzle/schemas'
import { type SnapshotRepoPort } from '~/modules/snapshot/ports/snapshot.repo.port'
import {
  PAGINATOR_PORT,
  type PaginatorServicePort,
} from '~/shared/paginator/ports/paginator.service.port'

@Injectable()
export class SnapashotDrizzleRepo implements SnapshotRepoPort {
  constructor(
    @Inject(PAGINATOR_PORT)
    private readonly paginator: PaginatorServicePort,

    @Inject(DRIZZLE_SERVICE_PORT)
    private readonly drizzle: DrizzleService,
  ) {}

  examplePaginatorUse(dto: { limit: number; page: number }) {
    const { skip, take } = this.paginator.config({
      limit: dto.limit,
      page: dto.page,
    })
    this.drizzle.db.select({}).from(projectRuleSnapshotsTable)
  }
}
