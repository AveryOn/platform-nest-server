import { Inject, Injectable } from '@nestjs/common'
import { and, eq, isNull } from 'drizzle-orm'
import { defineDb } from '~/infra/drizzle/drizzle.helpers'
import { DrizzleService } from '~/infra/drizzle/drizzle.service'
import type { Tx } from '~/infra/drizzle/drizzle.type'
import {
  projectRuleConfigsTable,
  projectRuleGroupConfigsTable,
  RuleGroupScope,
  ruleGroupsTable,
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
    @Inject(DrizzleService)
    private readonly drizzle: DrizzleService,
  ) {}

  /** Get project nodes */
  async getProjectRuleGroups(
    projectId: string,
    tx?: Tx,
  ): Promise<RuleTreeNodeBase[]> {
    const res = await defineDb(this.drizzle.db, tx)
      .select()
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
          eq(ruleGroupsTable.scope, RuleGroupScope.project),
          isNull(ruleGroupsTable.deletedAt),
        ),
      )

    return res.map((data) => ({
      id: data.rule_groups.id,
      name: data.rule_groups.name,
      orderIndex: data.rule_groups.orderIndex,
      parentGroupId: data.rule_groups.parentGroupId,
      type: data.rule_groups.type,
      description: data.rule_groups.description,
      projectId: projectId,
      createdAt: data.rule_groups.createdAt.toISOString(),
      updatedAt: data.rule_groups.updatedAt?.toISOString() ?? null,
      isHidden: !!data.project_rule_group_configs?.status,
    }))
  }

  /** Get project rules (leafs of tree) */
  async getProjectRules(
    projectId: string,
    tx?: Tx,
  ): Promise<RuleTreeLeaf[]> {
    const res = await defineDb(this.drizzle.db, tx)
      .select()
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
    return res.map((data) => ({
      id: data.rules.id,
      body: data.rules.body,
      metadata: data.rules.metadata as RuleMetadata,
      name: data.rules.name,
      orderIndex: data.rules.orderIndex,
      ruleGroupId: data.rules.ruleGroupId,
      createdAt: data.rules.createdAt.toISOString(),
      updatedAt: data.rules.updatedAt?.toISOString() ?? null,
    }))
  }
}
