import { Injectable } from '@nestjs/common'
import { DrizzleService } from '~/infra/drizzle/drizzle.service'
import { RuleRepoPort } from '~/modules/rule/ports/rule.repo.port'

@Injectable()
export class RuleDrizzleRepo implements RuleRepoPort {
  constructor(private readonly drizzle: DrizzleService) {}
}
