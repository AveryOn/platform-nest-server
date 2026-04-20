import { Module } from '@nestjs/common'
import { RuleGroupController } from '~/modules/rule-group/infra/http/rule-group.controller'

@Module({
  controllers: [RuleGroupController],
  exports: [],
})
export class RuleGroupModule {}
