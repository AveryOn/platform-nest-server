import { Inject, Injectable } from '@nestjs/common'
import { and, eq, inArray, isNull } from 'drizzle-orm'
import type { Tx } from '~/infra/drizzle/application/drizzle.type'
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
    @Inject(TX_PORT)
    private readonly transaction: TransactionPort<Tx>,
  ) {}

  async getProjectResolvedRulesetData(cmd: {
    projectId: string
    organizationId: string
  }): Promise<ResolvedRulesetRawData> {
    return await this.transaction.run(async (tx) => {
      const [project] = await tx
        .select({
          id: projectsTable.id,
        })
        .from(projectsTable)
        .where(
          and(
            eq(projectsTable.id, cmd.projectId),
            eq(projectsTable.organizationId, cmd.organizationId),
            isNull(projectsTable.deletedAt),
          ),
        )
        .limit(1)

      if (!project) {
        return {
          project: null,
          ruleGroups: [],
          rules: [],
          ruleGroupConfigs: [],
          ruleConfigs: [],
        }
      }

      const projectGroups = await tx
        .select({
          id: ruleGroupsTable.id,
          projectId: ruleGroupsTable.projectId,
          parentGroupId: ruleGroupsTable.parentGroupId,
          name: ruleGroupsTable.name,
          orderIndex: ruleGroupsTable.orderIndex,
        })
        .from(ruleGroupsTable)
        .where(
          and(
            eq(ruleGroupsTable.projectId, cmd.projectId),
            isNull(ruleGroupsTable.deletedAt),
          ),
        )

      const groupIds = projectGroups.map((group) => group.id)

      const projectRules =
        groupIds.length === 0
          ? []
          : await tx
              .select({
                id: rulesTable.id,
                projectId: rulesTable.projectId,
                ruleGroupId: rulesTable.ruleGroupId,
                name: rulesTable.name,
                body: rulesTable.body,
                metadata: rulesTable.metadata,
                orderIndex: rulesTable.orderIndex,
                createdAt: rulesTable.createdAt,
                updatedAt: rulesTable.updatedAt,
              })
              .from(rulesTable)
              .where(
                and(
                  inArray(rulesTable.ruleGroupId, groupIds),
                  eq(rulesTable.projectId, cmd.projectId),
                  isNull(rulesTable.deletedAt),
                ),
              )

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
                and(
                  eq(
                    projectRuleGroupConfigsTable.projectId,
                    cmd.projectId,
                  ),
                  inArray(
                    projectRuleGroupConfigsTable.ruleGroupId,
                    groupIds,
                  ),
                ),
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
              .where(
                and(
                  eq(projectRuleConfigsTable.projectId, cmd.projectId),
                  inArray(projectRuleConfigsTable.ruleId, ruleIds),
                ),
              )

      return {
        project,
        ruleGroups: projectGroups,
        rules: projectRules,
        ruleGroupConfigs: groupConfigs,
        ruleConfigs,
      } as ResolvedRulesetRawData
    })
  }
}
