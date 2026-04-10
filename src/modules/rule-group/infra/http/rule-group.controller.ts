import { Controller, Inject } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import {
  RULE_GROUP_PORT,
  type RuleGroupServicePort,
} from '~/modules/rule-group/ports/rule-group.service.port'
import { ApiSwaggerTag } from '~/shared/const/app.const'

@ApiTags(ApiSwaggerTag.RuleGroup)
@Controller({ path: 'rule-groups', version: '1' })
export class RuleGroupController {
  constructor(
    @Inject(RULE_GROUP_PORT)
    private ruleGroupService: RuleGroupServicePort,
  ) {}
}
