import { Inject, Injectable } from "@nestjs/common"
import { RuleServicePort } from "~/modules/rule/ports/rule.service.port"
import { RULE_REPO_PORT, type RuleRepoPort } from "~/modules/rule/ports/rule.repo.port"


@Injectable()
export class RuleService implements RuleServicePort {
  constructor (
    @Inject(RULE_REPO_PORT)
    private readonly ruleRepo: RuleRepoPort,
  ) {}

}
