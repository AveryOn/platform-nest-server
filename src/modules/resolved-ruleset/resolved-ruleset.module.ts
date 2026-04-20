import { Module } from '@nestjs/common'
import { ResolvedRulesetController } from '~/modules/resolved-ruleset/infra/http/resolved-ruleset.controller'

@Module({
  controllers: [ResolvedRulesetController],
  exports: [],
})
export class ResolvedRulesetModule {}
