import type { TransactionContext } from '~/infra/transaction/application/transaction.type'
import type {
  RuleEntity,
  RuleServiceCmd,
  RuleServiceRes,
} from '~/modules/rule/application/rule.type'

export const RULE_REPO_PORT = Symbol('RULE_REPO_PORT')

export abstract class RuleRepoPort {
  abstract create(
    cmd: RuleServiceCmd.Create,
    tx?: TransactionContext,
  ): Promise<RuleEntity>

  abstract getById(
    cmd: RuleServiceCmd.GetById,
    tx?: TransactionContext,
  ): Promise<RuleEntity>

  abstract patch(
    cmd: RuleServiceCmd.Patch,
    tx?: TransactionContext,
  ): Promise<RuleEntity>

  abstract move(
    cmd: RuleServiceCmd.Move,
    tx?: TransactionContext,
  ): Promise<RuleServiceRes.Move>

  abstract reorderInGroup(
    cmd: RuleServiceCmd.ReorderInGroup,
    tx?: TransactionContext,
  ): Promise<RuleServiceRes.ReorderInGroup>

  abstract delete(
    cmd: RuleServiceCmd.Delete,
    tx?: TransactionContext,
  ): Promise<RuleServiceRes.Delete>
}
