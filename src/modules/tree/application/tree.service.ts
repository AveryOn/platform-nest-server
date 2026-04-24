import { Inject, Injectable } from '@nestjs/common'
import type { TransactionContext } from '~/infra/transaction/application/transaction.type'
import {
  TX_PORT,
  type TransactionPort,
} from '~/infra/transaction/ports/transaction.port'
import type {
  RuleTreeLeaf,
  RuleTreeNode,
  RuleTreeNodeBase,
  TreeServiceCmd,
  TreeServiceResult,
} from '~/modules/tree/application/tree.type'
import {
  TREE_REPO_PORT,
  type TreeRepoPort,
} from '~/modules/tree/ports/tree.repo.port'
import type { TreeServicePort } from '~/modules/tree/ports/tree.service.port'

@Injectable()
export class TreeService implements TreeServicePort {
  constructor(
    @Inject(TREE_REPO_PORT)
    private readonly treeRepo: TreeRepoPort,

    @Inject(TX_PORT)
    private readonly tx: TransactionPort<TransactionContext>,
  ) {}

  async getEditorTree(
    cmd: TreeServiceCmd.GetTree,
  ): Promise<TreeServiceResult.GetTree> {
    const [rules, groups] = await this.tx.run(async (tx) => {
      return await Promise.all([
        this.treeRepo.getProjectRules(cmd.projectId, tx),
        this.treeRepo.getProjectRuleGroups(cmd.projectId, tx),
      ])
    })

    const tree = this.buildTree(groups, rules)

    return Promise.resolve({
      projectId: cmd.projectId,
      includeHidden: cmd.includeHidden ?? true,
      includeMetadata: cmd.includeMetadata ?? true,
      tree: tree,
    })
  }

  private buildTree(
    groups: RuleTreeNodeBase[],
    rules: RuleTreeLeaf[],
  ): RuleTreeNode[] {
    const rulesByGroupId = new Map<string, RuleTreeLeaf[]>()
    const groupsByParentId = new Map<string | null, RuleTreeNodeBase[]>()

    for (const rule of rules) {
      const groupRules = rulesByGroupId.get(rule.ruleGroupId) ?? []
      groupRules.push(rule)
      rulesByGroupId.set(rule.ruleGroupId, groupRules)
    }

    for (const group of groups) {
      const siblingGroups =
        groupsByParentId.get(group.parentGroupId) ?? []
      siblingGroups.push(group)
      groupsByParentId.set(group.parentGroupId, siblingGroups)
    }

    const sortByOrderIndex = <T extends { orderIndex: number }>(
      items: T[],
    ): T[] => {
      return items.sort((a, b) => a.orderIndex - b.orderIndex)
    }

    const buildNode = (group: RuleTreeNodeBase): RuleTreeNode => {
      const directRules = rulesByGroupId.get(group.id) ?? []
      const directChildren = groupsByParentId.get(group.id) ?? []

      return {
        ...group,
        rules: sortByOrderIndex(directRules),
        children: sortByOrderIndex(directChildren).map(buildNode),
      }
    }

    const rootGroups = groupsByParentId.get(null) ?? []

    return sortByOrderIndex(rootGroups).map(buildNode)
  }
}
