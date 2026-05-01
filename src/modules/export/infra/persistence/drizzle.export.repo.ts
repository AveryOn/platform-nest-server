import { Inject, Injectable } from '@nestjs/common'
import {
  DRIZZLE_PORT,
  type DrizzleServicePort,
} from '~/infra/drizzle/ports/drizzle.service.port'
import { ExportRepoPort } from '~/modules/export/ports/export.repo.port'

@Injectable()
export class ExportDrizzleRepo implements ExportRepoPort {
  constructor(
    @Inject(DRIZZLE_PORT)
    private readonly drizzle: DrizzleServicePort,
  ) {}
}
