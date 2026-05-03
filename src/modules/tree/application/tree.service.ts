import { Inject, Injectable } from '@nestjs/common'
import { AppError } from '~/core/error/app-error'
import { ErrorEnum } from '~/core/error/app-error.dict'
import { LOGGER_PORT } from '~/core/logger/logger.port'
import type { AppLoggerService } from '~/core/logger/logger.service'
import type { TransactionContext } from '~/infra/transaction/application/transaction.type'
import {
  TX_PORT,
  type TransactionPort,
} from '~/infra/transaction/ports/transaction.port'
import {
  BRAND_REPO_PORT,
  type BrandRepoPort,
} from '~/modules/brand/ports/brand.repo.port'
import {
  PROJECT_REPO_PORT,
  type ProjectRepoPort,
} from '~/modules/project/ports/project.repo.port'
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

    @Inject(PROJECT_REPO_PORT)
    private readonly projectRepo: ProjectRepoPort,

    @Inject(BRAND_REPO_PORT)
    private readonly brandRepo: BrandRepoPort,

    @Inject(TX_PORT)
    private readonly tx: TransactionPort<TransactionContext>,

    @Inject(LOGGER_PORT)
    private readonly logger: AppLoggerService,
  ) {}

  async getEditorTree(
    cmd: TreeServiceCmd.GetTree,
  ): Promise<TreeServiceResult.GetTree> {
    const [rules, groups] = await this.tx.run(async (tx) => {
      const brand = await this.brandRepo.findBrandByProjectId(
        {
          organizationId: cmd.organizationId,
          projectId: cmd.projectId,
        },
        tx,
      )
      if (!brand) {
        throw new AppError(ErrorEnum.SOURCE_NOT_FOUND, this.logger)
      }

      await this.projectRepo.findProjectOrFail(
        {
          projectId: cmd.projectId,
          brandId: brand.id,
          organizationId: cmd.organizationId,
        },
        tx,
      )

      return await Promise.all([
        this.treeRepo.getProjectRules(cmd.projectId, tx),
        this.treeRepo.getProjectRuleGroups(cmd.projectId, tx),
      ])
    })

    const includeHidden = cmd.includeHidden ?? true

    const visibleGroups = includeHidden
      ? groups
      : groups.filter((group) => !group.isHidden)

    const visibleRules = includeHidden
      ? rules
      : rules.filter((rule) => !rule.isHidden)

    const tree = this.buildTree(visibleGroups, visibleRules)

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
