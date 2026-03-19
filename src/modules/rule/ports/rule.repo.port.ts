import {
  CreateRuleRecord,
  Rule,
  UpdateRuleRecord,
} from '~/modules/rule/application/rule.types'

export const RULE_REPO_PORT = Symbol('RULE_REPO_PORT')

export interface RuleRepoPort {
  create(input: CreateRuleRecord): Promise<Rule>
  update(
    projectId: string,
    ruleId: string,
    input: UpdateRuleRecord,
  ): Promise<Rule | null>
  findById(projectId: string, ruleId: string): Promise<Rule | null>
  softDelete(projectId: string, ruleId: string): Promise<void>
  reorder(
    projectId: string,
    groupId: string,
    orderedIds: string[],
  ): Promise<void>
}
