import { Controller, Inject } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { RULE_PORT, type RuleServicePort } from '~/modules/rule/ports/rule.service.port'
import { ApiSwaggerTag } from '~/shared/const/app.const'

@ApiTags(ApiSwaggerTag.Rule)
@Controller({ path: 'rules', version: '1' })
export class RuleController {
  constructor(
    @Inject(RULE_PORT)
    private ruleService: RuleServicePort,
  ) {}
}
