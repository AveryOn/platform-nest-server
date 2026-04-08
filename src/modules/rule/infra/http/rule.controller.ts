import { Controller, Get, Inject, Post } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { ApiSwaggerTag } from '~/shared/const/app.const'
import { RULE_PORT, type RuleServicePort } from '~/modules/rule/ports/rule.service.port'

@ApiTags(ApiSwaggerTag.Rule)
@Controller({ path: 'rules', version: '1' })
export class RuleController {
  constructor(
    @Inject(RULE_PORT)
    private ruleService: RuleServicePort,
  ) {}
}
