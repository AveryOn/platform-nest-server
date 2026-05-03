import {
  type RuleServiceCmd,
  type RuleServiceRes,
} from '~/modules/rule/application/rule.type'

export const RULE_SERVICE_PORT = Symbol('RULE_SERVICE_PORT')

export abstract class RuleServicePort {
  abstract create(
    cmd: RuleServiceCmd.Create,
  ): Promise<RuleServiceRes.Item>

  abstract getById(
    cmd: RuleServiceCmd.GetById,
  ): Promise<RuleServiceRes.Item>

  abstract patch(
    cmd: RuleServiceCmd.Patch,
  ): Promise<RuleServiceRes.Update>

  abstract move(cmd: RuleServiceCmd.Move): Promise<RuleServiceRes.Move>

  abstract reorderInGroup(
    cmd: RuleServiceCmd.ReorderInGroup,
  ): Promise<RuleServiceRes.ReorderInGroup>

  abstract delete(
    cmd: RuleServiceCmd.Delete,
  ): Promise<RuleServiceRes.Delete>
}
