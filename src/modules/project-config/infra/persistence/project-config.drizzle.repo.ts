import { Inject, Injectable } from '@nestjs/common'
import {
  DRIZZLE_PORT,
  type DrizzleServicePort,
} from '~/infra/drizzle/ports/drizzle.service.port'
import type { ProjectConfigRepoPort } from '~/modules/project-config/ports/project-config.repo.port'

@Injectable()
export class ProjectConfigDrizzleRepo implements ProjectConfigRepoPort {
  constructor(
    @Inject(DRIZZLE_PORT)
    private readonly drizzle: DrizzleServicePort,
  ) {}
}
