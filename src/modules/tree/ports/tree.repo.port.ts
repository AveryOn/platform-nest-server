import type { Tx } from '~/infra/drizzle/drizzle.type'
import type {
  RuleTreeLeaf,
  RuleTreeNodeBase,
} from '~/modules/tree/application/tree.type'

export const TREE_REPO_PORT = Symbol('TREE_REPO_PORT')

export abstract class TreeRepoPort {
  abstract getProjectRuleGroups(
    projectId: string,
    tx?: Tx,
  ): Promise<RuleTreeNodeBase[]>
  abstract getProjectRules(
    projectId: string,
    tx?: Tx,
  ): Promise<RuleTreeLeaf[]>
}
