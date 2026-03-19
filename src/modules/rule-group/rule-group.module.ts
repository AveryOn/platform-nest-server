import { Module } from '@nestjs/common'
import { RULE_GROUP_PORT } from '~/modules/rule-group/ports/rule-group.service.port'
import { RuleGroupController } from '~/modules/rule-group/infra/http/rule-group.controller'
import { RULE_GROUP_REPO_PORT } from '~/modules/rule-group/ports/rule-group.repo.port'
import { RuleGroupDrizzleRepo } from '~/modules/rule-group/infra/persistance/rule-group.drizzle.repo'
import { RuleGroupService } from '~/modules/rule-group/application/rule-group.service'

@Module({
  controllers: [RuleGroupController],
  providers: [
    {
      provide: RULE_GROUP_PORT,
      useClass: RuleGroupService,
    },
    {
      provide: RULE_GROUP_REPO_PORT,
      useClass: RuleGroupDrizzleRepo,
    },
  ],
  exports: [RULE_GROUP_PORT],
})
export class RuleGroupModule {}
