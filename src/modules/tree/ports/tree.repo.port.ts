import type { RuleTreeNode } from '~/modules/tree/application/tree.type'

export const TREE_REPO_PORT = Symbol('TREE_REPO_PORT')

export abstract class TreeRepoPort {
  abstract getRootNodesByProject(projectId: string): Promise<RuleTreeNode[]>
}
