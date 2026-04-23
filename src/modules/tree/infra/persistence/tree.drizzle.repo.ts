import { Inject, Injectable } from '@nestjs/common'
import { DrizzleService } from '~/infra/drizzle/drizzle.service'
import { RuleGroupType } from '~/modules/rule-group/application/rule-group.type'
import type { TreeRepoPort } from '~/modules/tree/ports/tree.repo.port'
import type { RuleTreeNode } from '../../application/tree.type'

@Injectable()
export class TreeDrizzleRepo implements TreeRepoPort {
  constructor(
    @Inject(DrizzleService)
    private readonly drizzle: DrizzleService,
  ) {}

  async getRootNodesByProject(projectId: string): Promise<RuleTreeNode[]> {
    return await Promise.resolve([
      {
        id: '7c917903-d8f3-445b-bec8-122c4cf3a411',
        projectId: projectId,
        parentGroupId: null,
        name: 'Components',
        description: 'Component rules',
        type: RuleGroupType.category,
        orderIndex: 0,
        isHidden: false,
        createdAt: '2026-04-20T12:00:00.000Z',
        updatedAt: '2026-04-20T12:30:00.000Z',
        rules: [],
        children: [],
      },
    ])
  }
}
