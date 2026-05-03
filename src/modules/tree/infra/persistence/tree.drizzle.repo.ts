import { Inject, Injectable } from '@nestjs/common'
import { and, eq, isNull } from 'drizzle-orm'
import { defineDb } from '~/infra/drizzle/application/drizzle.helpers'
import type { Tx } from '~/infra/drizzle/application/drizzle.type'
import {
  DRIZZLE_PORT,
  type DrizzleServicePort,
} from '~/infra/drizzle/ports/drizzle.service.port'
import {
  projectRuleConfigsTable,
  projectRuleGroupConfigsTable,
  ruleGroupsTable,
  RuleScope,
  rulesTable,
} from '~/infra/drizzle/schemas'
import type { RuleMetadata } from '~/modules/rule/application/rule.type'
import type {
  RuleTreeLeaf,
  RuleTreeNodeBase,
} from '~/modules/tree/application/tree.type'
import type { TreeRepoPort } from '~/modules/tree/ports/tree.repo.port'

@Injectable()
export class TreeDrizzleRepo implements TreeRepoPort {
  constructor(
    @Inject(DRIZZLE_PORT)
    private readonly drizzle: DrizzleServicePort,
  ) {}

  /** Get project nodes */
  async getProjectRuleGroups(
    projectId: string,
    tx?: Tx,
  ): Promise<RuleTreeNodeBase[]> {
    const res = await defineDb(this.drizzle.db, tx)
      .select({
        config: projectRuleGroupConfigsTable,
        group: ruleGroupsTable,
      })
      .from(ruleGroupsTable)
      .leftJoin(
        projectRuleGroupConfigsTable,
        and(
          eq(
            projectRuleGroupConfigsTable.ruleGroupId,
            ruleGroupsTable.id,
          ),
          eq(projectRuleGroupConfigsTable.projectId, projectId),
        ),
      )
      .where(
        and(
          eq(ruleGroupsTable.projectId, projectId),
          eq(ruleGroupsTable.scope, RuleScope.project),
          isNull(ruleGroupsTable.deletedAt),
        ),
      )

    return res.map(({ config, group }) => ({
      id: group.id,
      name: group.name,
      orderIndex: group.orderIndex,
      parentGroupId: group.parentGroupId,
      type: group.type,
      description: group.description,
      projectId: projectId,
      createdAt: group.createdAt.toISOString(),
      updatedAt: group.updatedAt?.toISOString() ?? null,
      isHidden: config?.status === 'hidden',
    }))
  }

  /** Get project rules (leafs of tree) */
  async getProjectRules(
    projectId: string,
    tx?: Tx,
  ): Promise<RuleTreeLeaf[]> {
    const res = await defineDb(this.drizzle.db, tx)
      .select({
        rule: rulesTable,
        config: projectRuleConfigsTable,
      })
      .from(rulesTable)
      .leftJoin(
        projectRuleConfigsTable,
        and(
          eq(projectRuleConfigsTable.ruleId, rulesTable.id),
          eq(projectRuleConfigsTable.projectId, projectId),
        ),
      )
      .where(
        and(
          eq(rulesTable.projectId, projectId),
          isNull(rulesTable.deletedAt),
        ),
      )
    return res.map(({ config, rule }) => ({
      id: rule.id,
      body: rule.body,
      metadata: rule.metadata as RuleMetadata,
      name: rule.name,
      orderIndex: rule.orderIndex,
      ruleGroupId: rule.ruleGroupId,
      createdAt: rule.createdAt.toISOString(),
      updatedAt: rule.updatedAt?.toISOString() ?? null,
      isHidden: config?.status === 'hidden',
    }))
  }
}
