import type { TransactionContext } from '~/infra/transaction/application/transaction.type'
import type {
  RuleGroupRepoCmd,
  RuleGroupRepoRes,
} from '~/modules/rule-group/application/rule-group.type'

export const RULE_GROUP_REPO_PORT = Symbol('RULE_GROUP_REPO_PORT')

export abstract class RuleGroupRepoPort {
  abstract create(
    cmd: RuleGroupRepoCmd.Create,
    tx?: TransactionContext,
  ): Promise<RuleGroupRepoRes.Create>

  abstract patch(
    cmd: RuleGroupRepoCmd.Patch,
    tx?: TransactionContext,
  ): Promise<RuleGroupRepoRes.Patch>

  abstract deleteGroupRelations(
    cmd: RuleGroupRepoCmd.DeleteGroupRelations,
    tx?: TransactionContext,
  ): Promise<RuleGroupRepoRes.DeleteGroupRelations>

  abstract findProjectOrFail(
    cmd: RuleGroupRepoCmd.FindProjectOrFail,
    tx?: TransactionContext,
  ): Promise<RuleGroupRepoRes.FindProjectOrFail>

  abstract findActiveGroup(
    cmd: RuleGroupRepoCmd.FindActiveGroup,
    tx?: TransactionContext,
  ): Promise<RuleGroupRepoRes.FindActiveGroup>

  abstract findActiveChildren(
    cmd: RuleGroupRepoCmd.FindActiveChildren,
    tx?: TransactionContext,
  ): Promise<RuleGroupRepoRes.FindActiveChildren>

  abstract collectDescendantGroupIds(
    cmd: RuleGroupRepoCmd.CollectDescendantGroupIds,
    tx?: TransactionContext,
  ): Promise<RuleGroupRepoRes.CollectDescendantGroupIds>

  abstract applyGroupOrder(
    cmd: RuleGroupRepoCmd.ApplyGroupOrder,
    tx?: TransactionContext,
  ): Promise<RuleGroupRepoRes.ApplyGroupOrder>
}
