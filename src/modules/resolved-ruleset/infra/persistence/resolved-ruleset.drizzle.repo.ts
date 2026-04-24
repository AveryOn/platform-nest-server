import { Inject, Injectable } from '@nestjs/common'
import { eq, inArray } from 'drizzle-orm'
import type { Tx } from '~/infra/drizzle/drizzle.type'
import {
  projectRuleConfigsTable,
  projectRuleGroupConfigsTable,
  projectsTable,
  ruleGroupsTable,
  rulesTable,
} from '~/infra/drizzle/schemas'
import {
  TX_PORT,
  type TransactionPort,
} from '~/infra/transaction/ports/transaction.port'
import type { ResolvedRulesetRawData } from '~/modules/resolved-ruleset/application/resolved-ruleset.type'
import { type ResolvedRulesetRepoPort } from '~/modules/resolved-ruleset/ports/resolved-ruleset.repo.port'

@Injectable()
export class ResolvedRulesetDrizzleRepo implements ResolvedRulesetRepoPort {
  constructor(
    @Inject(TX_PORT) private readonly transaction: TransactionPort<Tx>,
  ) {}

  async getProjectResolvedRulesetData(
    projectId: string,
  ): Promise<ResolvedRulesetRawData> {
    return await this.transaction.run(async (tx) => {
      const [project] = await tx
        .select({
          id: projectsTable.id,
        })
        .from(projectsTable)
        .where(eq(projectsTable.id, projectId))
        .limit(1)

      const projectGroups = await tx
        .select({
          id: ruleGroupsTable.id,
          projectId: ruleGroupsTable.projectId,
          parentGroupId: ruleGroupsTable.parentGroupId,
          name: ruleGroupsTable.name,
          orderIndex: ruleGroupsTable.orderIndex,
        })
        .from(ruleGroupsTable)
        .where(eq(ruleGroupsTable.projectId, projectId))

      const groupIds = projectGroups.map((group) => group.id)

      const projectRules =
        groupIds.length === 0
          ? []
          : await tx
              .select({
                id: rulesTable.id,
                projectId: ruleGroupsTable.projectId,
                ruleGroupId: rulesTable.ruleGroupId,
                name: rulesTable.name,
                body: rulesTable.body,
                metadata: rulesTable.metadata,
                orderIndex: rulesTable.orderIndex,
                createdAt: rulesTable.createdAt,
                updatedAt: rulesTable.updatedAt,
              })
              .from(rulesTable)
              .innerJoin(
                ruleGroupsTable,
                eq(rulesTable.ruleGroupId, ruleGroupsTable.id),
              )
              .where(inArray(rulesTable.ruleGroupId, groupIds))

      const groupConfigs =
        groupIds.length === 0
          ? []
          : await tx
              .select({
                projectId: projectRuleGroupConfigsTable.projectId,
                ruleGroupId: projectRuleGroupConfigsTable.ruleGroupId,
                status: projectRuleGroupConfigsTable.status,
              })
              .from(projectRuleGroupConfigsTable)
              .where(
                eq(projectRuleGroupConfigsTable.projectId, projectId),
              )

      const ruleIds = projectRules.map((rule) => rule.id)

      const ruleConfigs =
        ruleIds.length === 0
          ? []
          : await tx
              .select({
                projectId: projectRuleConfigsTable.projectId,
                ruleId: projectRuleConfigsTable.ruleId,
                status: projectRuleConfigsTable.status,
              })
              .from(projectRuleConfigsTable)
              .where(eq(projectRuleConfigsTable.projectId, projectId))
      return {
        project: project ?? null,
        ruleGroups: projectGroups,
        rules: projectRules,
        ruleGroupConfigs: groupConfigs,
        ruleConfigs,
      } as ResolvedRulesetRawData
    })
  }
}
