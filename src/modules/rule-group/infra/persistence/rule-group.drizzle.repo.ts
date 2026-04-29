import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { and, asc, eq, inArray, isNull } from 'drizzle-orm'
import { defineDb } from '~/infra/drizzle/application/drizzle.helpers'
import type { Tx } from '~/infra/drizzle/application/drizzle.type'
import {
  DRIZZLE_PORT,
  type DrizzleServicePort,
} from '~/infra/drizzle/ports/drizzle.service.port'
import { projectsTable } from '~/infra/drizzle/schemas/projects'
import { ruleGroupsTable } from '~/infra/drizzle/schemas/rule-groups'
import { rulesTable } from '~/infra/drizzle/schemas/rules'

import {
  RuleGroupScope,
  RuleGroupType,
  type RuleGroupRawEntity,
  type RuleGroupRepoCmd,
  type RuleGroupRepoRes,
} from '~/modules/rule-group/application/rule-group.type'
import { RuleGroupRepoPort } from '~/modules/rule-group/ports/rule-group.repo.port'

@Injectable()
export class RuleGroupDrizzleRepo implements RuleGroupRepoPort {
  constructor(
    @Inject(DRIZZLE_PORT)
    private readonly drizzle: DrizzleServicePort,
  ) {}

  async create(
    cmd: RuleGroupRepoCmd.Create,
    tx?: Tx,
  ): Promise<RuleGroupRawEntity> {
    const db = defineDb(this.drizzle.db, tx)

    const [created] = await db
      .insert(ruleGroupsTable)
      .values({
        projectId: cmd.projectId,
        parentGroupId: cmd.parentGroupId ?? null,
        scope: RuleGroupScope.project,
        name: cmd.name,
        description: cmd.description ?? null,
        metadata: cmd.metadata ?? null,
        type: cmd.type ?? RuleGroupType.section,
        orderIndex: cmd.orderIndex,
      })
      .returning()
    return created
  }

  async patch(
    cmd: RuleGroupRepoCmd.Patch,
    tx?: Tx,
  ): Promise<RuleGroupRawEntity> {
    const db = defineDb(this.drizzle.db, tx)

    const [updated] = await db
      .update(ruleGroupsTable)
      .set(cmd.patch)
      .where(
        and(
          eq(ruleGroupsTable.id, cmd.groupId),
          isNull(ruleGroupsTable.deletedAt),
        ),
      )
      .returning()
    return updated
  }

  async deleteGroupRelations(
    cmd: RuleGroupRepoCmd.DeleteGroupRelations,
    tx?: Tx,
  ): Promise<RuleGroupRepoRes.DeleteGroupRelations> {
    const db = defineDb(this.drizzle.db, tx)

    const deletedAt = new Date()

    await db
      .update(rulesTable)
      .set({
        deletedAt,
      })
      .where(
        and(
          inArray(rulesTable.ruleGroupId, cmd.groupIds),
          isNull(rulesTable.deletedAt),
        ),
      )

    for (const id of [...cmd.groupIds].reverse()) {
      await db
        .update(ruleGroupsTable)
        .set({
          deletedAt,
        })
        .where(
          and(
            eq(ruleGroupsTable.id, id),
            isNull(ruleGroupsTable.deletedAt),
          ),
        )
    }

    return deletedAt
  }

  async applyGroupOrder(
    items: {
      id: string
      parentGroupId: string | null
      orderIndex: number
    }[],
    tx: Tx,
  ): Promise<RuleGroupRepoRes.ApplyGroupOrder> {
    const db = defineDb(this.drizzle.db, tx)
    if (items.length === 0) {
      return []
    }

    const uniqueItems = Array.from(
      new Map(items.map((item) => [item.id, item])).values(),
    )

    for (let index = 0; index < uniqueItems.length; index++) {
      const item = uniqueItems[index]

      await db
        .update(ruleGroupsTable)
        .set({
          orderIndex: -(index + 1),
        })
        .where(
          and(
            eq(ruleGroupsTable.id, item.id),
            isNull(ruleGroupsTable.deletedAt),
          ),
        )
    }

    for (const item of uniqueItems) {
      await db
        .update(ruleGroupsTable)
        .set({
          parentGroupId: item.parentGroupId,
          orderIndex: item.orderIndex,
        })
        .where(
          and(
            eq(ruleGroupsTable.id, item.id),
            isNull(ruleGroupsTable.deletedAt),
          ),
        )
    }

    return uniqueItems.map((item) => item.id)
  }

  async collectDescendantGroupIds(
    cmd: RuleGroupRepoCmd.CollectDescendantGroupIds,
    tx?: Tx,
  ): Promise<RuleGroupRepoRes.CollectDescendantGroupIds> {
    const db = defineDb(this.drizzle.db, tx)

    const result: string[] = []
    const queue = [cmd.groupId]

    while (queue.length > 0) {
      const currentId = queue.shift()

      if (!currentId) {
        continue
      }

      const children = await db
        .select()
        .from(ruleGroupsTable)
        .where(
          and(
            eq(ruleGroupsTable.parentGroupId, currentId),
            isNull(ruleGroupsTable.deletedAt),
          ),
        )
        .orderBy(asc(ruleGroupsTable.orderIndex))

      for (const child of children) {
        result.push(child.id)
        queue.push(child.id)
      }
    }

    return result
  }

  async findProjectOrFail(
    cmd: RuleGroupRepoCmd.FindProjectOrFail,
    tx?: Tx,
  ): Promise<RuleGroupRepoRes.FindProjectOrFail> {
    const db = defineDb(this.drizzle.db, tx)

    const [project] = await db
      .select()
      .from(projectsTable)
      .where(
        and(
          eq(projectsTable.id, cmd.projectId),
          isNull(projectsTable.deletedAt),
        ),
      )
      .limit(1)

    if (!project) {
      throw new NotFoundException('Project not found')
    }

    return project
  }

  async findActiveGroup(
    cmd: RuleGroupRepoCmd.FindActiveGroup,
    tx?: Tx,
  ): Promise<RuleGroupRepoRes.FindActiveGroup> {
    const db = defineDb(this.drizzle.db, tx)

    const [group] = await db
      .select()
      .from(ruleGroupsTable)
      .where(
        and(
          eq(ruleGroupsTable.id, cmd.groupId),
          isNull(ruleGroupsTable.deletedAt),
        ),
      )
      .limit(1)

    if (!group) {
      throw new NotFoundException('Rule group not found')
    }

    return group
  }

  async findActiveChildren(
    cmd: RuleGroupRepoCmd.FindActiveChildren,
    tx?: Tx,
  ): Promise<RuleGroupRepoRes.FindActiveChildren> {
    const db = defineDb(this.drizzle.db, tx)

    if (cmd.parentGroupId === null) {
      if (cmd.projectId === null) {
        return await db
          .select()
          .from(ruleGroupsTable)
          .where(
            and(
              isNull(ruleGroupsTable.projectId),
              isNull(ruleGroupsTable.parentGroupId),
              isNull(ruleGroupsTable.deletedAt),
            ),
          )
          .orderBy(asc(ruleGroupsTable.orderIndex))
      }

      return await db
        .select()
        .from(ruleGroupsTable)
        .where(
          and(
            eq(ruleGroupsTable.projectId, cmd.projectId),
            isNull(ruleGroupsTable.parentGroupId),
            isNull(ruleGroupsTable.deletedAt),
          ),
        )
        .orderBy(asc(ruleGroupsTable.orderIndex))
    }

    if (cmd.projectId === null) {
      return await db
        .select()
        .from(ruleGroupsTable)
        .where(
          and(
            isNull(ruleGroupsTable.projectId),
            eq(ruleGroupsTable.parentGroupId, cmd.parentGroupId),
            isNull(ruleGroupsTable.deletedAt),
          ),
        )
        .orderBy(asc(ruleGroupsTable.orderIndex))
    }

    return await db
      .select()
      .from(ruleGroupsTable)
      .where(
        and(
          eq(ruleGroupsTable.projectId, cmd.projectId),
          eq(ruleGroupsTable.parentGroupId, cmd.parentGroupId),
          isNull(ruleGroupsTable.deletedAt),
        ),
      )
      .orderBy(asc(ruleGroupsTable.orderIndex))
  }
}
