import { Inject, Injectable } from '@nestjs/common'
import {
  DRIZZLE_PORT,
  type DrizzleServicePort,
} from '~/infra/drizzle/ports/drizzle.service.port'
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
}
