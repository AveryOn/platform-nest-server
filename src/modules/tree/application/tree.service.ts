import { Inject, Injectable } from '@nestjs/common'
import { RuleGroupType } from '~/infra/drizzle/schemas'
import type {
  RuleTreeLeaf,
  RuleTreeNode,
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
  ) {}

  async getEditorTree(
    cmd: TreeServiceCmd.GetTree,
  ): Promise<TreeServiceResult.GetTree> {
    const rule: RuleTreeLeaf = {
      id: 'b9cbfc46-f42f-4a9c-9e5f-d3d5b88d9ec7',
      ruleGroupId: '8fd2dbff-e5e7-4781-b22c-b17d061ee8d7',
      name: 'When to use',
      body: 'Use button for primary actions.',
      metadata: {
        tags: ['button', 'usage'],
      },
      orderIndex: 0,
      createdAt: '2026-04-20T12:00:00.000Z',
      updatedAt: '2026-04-20T12:30:00.000Z',
    }

    const childNode: RuleTreeNode = {
      id: '8fd2dbff-e5e7-4781-b22c-b17d061ee8d7',
      projectId: cmd.projectId,
      parentGroupId: '7c917903-d8f3-445b-bec8-122c4cf3a411',
      name: 'Button',
      description: 'Rules for button component',
      type: RuleGroupType.component,
      orderIndex: 0,
      isHidden: false,
      createdAt: '2026-04-20T12:00:00.000Z',
      updatedAt: '2026-04-20T12:30:00.000Z',
      rules: [rule],
      children: [],
    }

    const rootNode: RuleTreeNode = {
      id: '7c917903-d8f3-445b-bec8-122c4cf3a411',
      projectId: cmd.projectId,
      parentGroupId: null,
      name: 'Components',
      description: 'Component rules',
      type: RuleGroupType.category,
      orderIndex: 0,
      isHidden: false,
      createdAt: '2026-04-20T12:00:00.000Z',
      updatedAt: '2026-04-20T12:30:00.000Z',
      rules: [],
      children: [childNode],
    }
    return Promise.resolve({
      projectId: cmd.projectId,
      includeHidden: cmd.includeHidden ?? true,
      includeMetadata: cmd.includeMetadata ?? true,
      tree: [rootNode],
    })
  }
}
