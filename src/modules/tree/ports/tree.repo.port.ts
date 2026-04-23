import type { Tx } from '~/infra/drizzle/drizzle.type'
import type {
  RuleTreeLeaf,
  RuleTreeNode,
} from '~/modules/tree/application/tree.type'

export const TREE_REPO_PORT = Symbol('TREE_REPO_PORT')

export abstract class TreeRepoPort {
  abstract getProjectRootNodes(
    projectId: string,
    tx?: Tx,
  ): Promise<RuleTreeNode[]>
  abstract getProjectRules(
    projectId: string,
    tx?: Tx,
  ): Promise<RuleTreeLeaf[]>
}
