import type {
  RuleGroupEntity,
  RuleGroupServiceCmd,
} from '~/modules/rule-group/application/rule-group.type'

export const RULE_GROUP_REPO_PORT = Symbol('RULE_GROUP_REPO_PORT')

export abstract class RuleGroupRepoPort {
  abstract create(cmd: RuleGroupServiceCmd.Create): Promise<RuleGroupEntity>
  abstract getByIdOrFail(groupId: string): Promise<RuleGroupEntity>
  abstract patch(cmd: RuleGroupServiceCmd.Patch): Promise<void>
  abstract move(cmd: RuleGroupServiceCmd.Move): Promise<void>
  abstract reorderChildren(cmd: RuleGroupServiceCmd.ReorderChildren): Promise<void>
  abstract reorderRoot(cmd: RuleGroupServiceCmd.ReorderRoot): Promise<void>
  abstract remove(groupId: string): Promise<Date>
}
