import { Inject } from '@nestjs/common'
import {
  DRIZZLE_PORT,
  type DrizzleServicePort,
} from '~/infra/drizzle/ports/drizzle.service.port'
import type { ExportRepoPort } from '~/modules/export/ports/export.repo.port'

export class ExportDrizzleRepo implements ExportRepoPort {
  constructor(
    @Inject(DRIZZLE_PORT)
    private readonly drizzle: DrizzleServicePort,
  ) {}
}
