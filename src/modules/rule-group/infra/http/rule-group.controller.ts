import { Controller, Get, Inject } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { ApiSwaggerTag } from '~/shared/const/app.const'
import {
  RULE_GROUP_PORT,
  type RuleGroupServicePort,
} from '~/modules/rule-group/ports/rule-group.service.port'

@ApiTags(ApiSwaggerTag.RuleGroup)
@Controller({ path: 'rule-groups', version: '1' })
export class RuleGroupController {
  constructor(
    @Inject(RULE_GROUP_PORT)
    private ruleGroupService: RuleGroupServicePort,
  ) {}
}
