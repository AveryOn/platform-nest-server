import { Module } from '@nestjs/common'
import { RuleGroupService } from '~/modules/rule-group/application/rule-group.service'
import { RuleGroupController } from '~/modules/rule-group/infra/http/rule-group.controller'
import { RuleGroupDrizzleRepo } from '~/modules/rule-group/infra/persistence/rule-group.drizzle.repo'
import { RULE_GROUP_REPO_PORT } from '~/modules/rule-group/ports/rule-group.repo.port'
import { RULE_GROUP_SERVICE_PORT } from '~/modules/rule-group/ports/rule-group.service.port'

@Module({
  controllers: [RuleGroupController],
  providers: [
    {
      provide: RULE_GROUP_SERVICE_PORT,
      useClass: RuleGroupService,
    },
    {
      provide: RULE_GROUP_REPO_PORT,
      useClass: RuleGroupDrizzleRepo,
    },
  ],
  exports: [RULE_GROUP_SERVICE_PORT],
})
export class RuleGroupModule {}
