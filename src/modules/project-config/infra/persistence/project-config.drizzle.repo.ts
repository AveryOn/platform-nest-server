// src/modules/project-config/infra/persistence/project-config.drizzle.repo.ts

import { Inject, Injectable } from '@nestjs/common'
import { and, eq } from 'drizzle-orm'
import { defineDb } from '~/infra/drizzle/application/drizzle.helpers'
import type { Tx } from '~/infra/drizzle/application/drizzle.type'
import {
  DRIZZLE_PORT,
  type DrizzleServicePort,
} from '~/infra/drizzle/ports/drizzle.service.port'
import {
  projectRuleConfigsTable,
  projectRuleGroupConfigsTable,
  projectsTable,
  ruleGroupsTable,
  rulesTable,
} from '~/infra/drizzle/schemas'
import type {
  ProjectConfigRepoCmd,
  ProjectConfigRepoRes,
  ProjectConfigStatus,
} from '~/modules/project-config/application/project-config.type'
import type { ProjectConfigRepoPort } from '~/modules/project-config/ports/project-config.repo.port'

@Injectable()
export class ProjectConfigDrizzleRepo implements ProjectConfigRepoPort {
  constructor(
    @Inject(DRIZZLE_PORT)
    private readonly drizzle: DrizzleServicePort,
  ) {}
  async getProjectById(
    cmd: ProjectConfigRepoCmd.getProjectById,
    tx?: Tx,
  ): Promise<ProjectConfigRepoRes.getProjectById | null> {
    const db = defineDb(this.drizzle.db, tx)
    const [project] = await db
      .select({
        id: projectsTable.id,
      })
      .from(projectsTable)
      .where(eq(projectsTable.id, cmd.projectId))
      .limit(1)

    return project ?? null
  }

  async getRuleGroupInProject(
    cmd: ProjectConfigRepoCmd.getRuleGroupInProject,
    tx?: Tx,
  ): Promise<ProjectConfigRepoRes.getRuleGroupInProject | null> {
    const db = defineDb(this.drizzle.db, tx)
    const [ruleGroup] = await db
      .select({
        id: ruleGroupsTable.id,
      })
      .from(ruleGroupsTable)
      .where(
        and(
          eq(ruleGroupsTable.id, cmd.groupId),
          eq(ruleGroupsTable.projectId, cmd.projectId),
        ),
      )
      .limit(1)

    return ruleGroup ?? null
  }

  async getRuleInProject(
    cmd: ProjectConfigRepoCmd.getRuleInProject,
    tx?: Tx,
  ): Promise<ProjectConfigRepoRes.getRuleInProject | null> {
    const db = defineDb(this.drizzle.db, tx)
    const [rule] = await db
      .select({
        id: rulesTable.id,
      })
      .from(rulesTable)
      .innerJoin(
        ruleGroupsTable,
        eq(rulesTable.ruleGroupId, ruleGroupsTable.id),
      )
      .where(
        and(
          eq(rulesTable.id, cmd.ruleId),
          eq(ruleGroupsTable.projectId, cmd.projectId),
        ),
      )
      .limit(1)

    return rule ?? null
  }

  async upsertRuleGroupConfig(
    cmd: ProjectConfigRepoCmd.upsertRuleGroupConfig,
    tx?: Tx,
  ): Promise<ProjectConfigRepoRes.upsertRuleGroupConfig> {
    const db = defineDb(this.drizzle.db, tx)
    const [config] = await db
      .insert(projectRuleGroupConfigsTable)
      .values({
        projectId: cmd.projectId,
        ruleGroupId: cmd.groupId,
        status: cmd.status,
      })
      .onConflictDoUpdate({
        target: [
          projectRuleGroupConfigsTable.projectId,
          projectRuleGroupConfigsTable.ruleGroupId,
        ],
        set: {
          status: cmd.status,
          updatedAt: new Date(),
        },
      })
      .returning({
        projectId: projectRuleGroupConfigsTable.projectId,
        ruleGroupId: projectRuleGroupConfigsTable.ruleGroupId,
        status: projectRuleGroupConfigsTable.status,
        updatedAt: projectRuleGroupConfigsTable.updatedAt,
      })

    return {
      projectId: config.projectId,
      ruleGroupId: config.ruleGroupId,
      status: config.status as ProjectConfigStatus,
      updatedAt: config.updatedAt,
    }
  }

  async upsertRuleConfig(
    cmd: ProjectConfigRepoCmd.upsertRuleConfig,
    tx?: Tx,
  ): Promise<ProjectConfigRepoRes.upsertRuleConfig> {
    const db = defineDb(this.drizzle.db, tx)
    const [config] = await db
      .insert(projectRuleConfigsTable)
      .values({
        projectId: cmd.projectId,
        ruleId: cmd.ruleId,
        status: cmd.status,
      })
      .onConflictDoUpdate({
        target: [
          projectRuleConfigsTable.projectId,
          projectRuleConfigsTable.ruleId,
        ],
        set: {
          status: cmd.status,
          updatedAt: new Date(),
        },
      })
      .returning({
        projectId: projectRuleConfigsTable.projectId,
        ruleId: projectRuleConfigsTable.ruleId,
        status: projectRuleConfigsTable.status,
        updatedAt: projectRuleConfigsTable.updatedAt,
      })

    return {
      projectId: config.projectId,
      ruleId: config.ruleId,
      status: config.status as ProjectConfigStatus,
      updatedAt: config.updatedAt,
    }
  }
}
