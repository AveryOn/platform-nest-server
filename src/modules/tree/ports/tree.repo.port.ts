import type { TransactionContext } from '~/modules/transaction/application/transaction.type'
import type {
  RuleTreeLeaf,
  RuleTreeNodeBase,
} from '~/modules/tree/application/tree.type'

export const TREE_REPO_PORT = Symbol('TREE_REPO_PORT')

export abstract class TreeRepoPort {
  abstract getProjectRuleGroups(
    projectId: string,
    tx?: TransactionContext,
  ): Promise<RuleTreeNodeBase[]>
  abstract getProjectRules(
    projectId: string,
    tx?: TransactionContext,
  ): Promise<RuleTreeLeaf[]>
}
