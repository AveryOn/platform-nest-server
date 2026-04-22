import { Module } from '@nestjs/common'
import { RuleService } from '~/modules/rule/application/rule.service'
import { RuleController } from '~/modules/rule/infra/http/rule.controller'
import { RuleDrizzleRepo } from '~/modules/rule/infra/persistence/rule.drizzle.repo'
import { RULE_REPO_PORT } from '~/modules/rule/ports/rule.repo.port'
import { RULE_SERVICE_PORT } from '~/modules/rule/ports/rule.service.port'

@Module({
  controllers: [RuleController],
  providers: [
    {
      provide: RULE_SERVICE_PORT,
      useClass: RuleService,
    },
    {
      provide: RULE_REPO_PORT,
      useClass: RuleDrizzleRepo,
    },
  ],
  exports: [RULE_SERVICE_PORT],
})
export class RuleModule {}
