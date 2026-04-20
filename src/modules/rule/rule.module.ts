import { Module } from '@nestjs/common'
import { RuleController } from '~/modules/rule/infra/http/rule.controller'

@Module({
  controllers: [RuleController],
  exports: [],
})
export class RuleModule {}
