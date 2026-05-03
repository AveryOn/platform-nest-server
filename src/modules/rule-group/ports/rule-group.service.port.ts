import {
  type RuleGroupServiceCmd,
  type RuleGroupServiceResult,
} from '~/modules/rule-group/application/rule-group.type'

export const RULE_GROUP_SERVICE_PORT = Symbol('RULE_GROUP_SERVICE_PORT')

export abstract class RuleGroupServicePort {
  abstract create(
    cmd: RuleGroupServiceCmd.Create,
  ): Promise<RuleGroupServiceResult.Item>

  abstract getById(
    cmd: RuleGroupServiceCmd.GetById,
  ): Promise<RuleGroupServiceResult.Item>

  abstract patch(
    cmd: RuleGroupServiceCmd.Patch,
  ): Promise<RuleGroupServiceResult.Update>

  abstract move(
    cmd: RuleGroupServiceCmd.Move,
  ): Promise<RuleGroupServiceResult.Move>

  abstract reorderChildren(
    cmd: RuleGroupServiceCmd.ReorderChildren,
  ): Promise<RuleGroupServiceResult.ReorderChildren>

  abstract reorderRoot(
    cmd: RuleGroupServiceCmd.ReorderRoot,
  ): Promise<RuleGroupServiceResult.ReorderRoot>

  abstract delete(
    cmd: RuleGroupServiceCmd.Delete,
  ): Promise<RuleGroupServiceResult.Delete>
}
