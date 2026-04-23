import { Inject, Injectable } from '@nestjs/common'
import { and, eq } from 'drizzle-orm'
import { defineDb } from '~/infra/drizzle/drizzle.helpers'
import { DrizzleService } from '~/infra/drizzle/drizzle.service'
import type { Tx } from '~/infra/drizzle/drizzle.type'
import { rulesTable } from '~/infra/drizzle/schemas'
import { RuleGroupType } from '~/modules/rule-group/application/rule-group.type'
import type { RuleTreeNode } from '~/modules/tree/application/tree.type'
import type { TreeRepoPort } from '~/modules/tree/ports/tree.repo.port'

@Injectable()
export class TreeDrizzleRepo implements TreeRepoPort {
  constructor(
    @Inject(DrizzleService)
    private readonly drizzle: DrizzleService,
  ) {}

  async getProjectRootNodes(
    projectId: string,
    _tx?: Tx,
  ): Promise<RuleTreeNode[]> {
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

  /** Get project rules */
  async getProjectRules(projectId: string, tx?: Tx): Promise<any[]> {
    return defineDb(this.drizzle.db, tx)
      .select({
        id: rulesTable.id,
      })
      .from(rulesTable)
      .where(
        and(
          eq(rulesTable.projectId, projectId),
          eq(rulesTable.projectId, projectId),
        ),
      )
  }
}
