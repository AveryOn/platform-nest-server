import { Inject, Injectable } from '@nestjs/common'
import { RuleGroupServicePort } from '~/modules/rule-group/ports/rule-group.service.port'
import {
  RULE_GROUP_REPO_PORT,
  type RuleGroupRepoPort,
} from '~/modules/rule-group/ports/rule-group.repo.port'

@Injectable()
export class RuleGroupService implements RuleGroupServicePort {
  constructor(
    @Inject(RULE_GROUP_REPO_PORT)
    private readonly ruleGroupRepo: RuleGroupRepoPort,
  ) {}
}
