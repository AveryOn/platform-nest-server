import type { RuleEntity, RuleServiceCmd } from '~/modules/rule/application/rule.type'

export const RULE_REPO_PORT = Symbol('RULE_REPO_PORT')

export abstract class RuleRepoPort {
  abstract create(cmd: RuleServiceCmd.Create): Promise<RuleEntity>
  abstract getByIdOrFail(ruleId: string): Promise<RuleEntity>
  abstract patch(cmd: RuleServiceCmd.Patch): Promise<void>
  abstract move(cmd: RuleServiceCmd.Move): Promise<void>
  abstract reorderInGroup(cmd: RuleServiceCmd.ReorderInGroup): Promise<void>
  abstract remove(ruleId: string): Promise<Date>
}
