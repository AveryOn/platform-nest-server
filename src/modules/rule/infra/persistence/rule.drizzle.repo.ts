import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { and, asc, eq, isNull } from 'drizzle-orm'
import { defineDb } from '~/infra/drizzle/application/drizzle.helpers'
import type { Tx } from '~/infra/drizzle/application/drizzle.type'
import {
  DRIZZLE_PORT,
  type DrizzleServicePort,
} from '~/infra/drizzle/ports/drizzle.service.port'
import { ruleGroupsTable } from '~/infra/drizzle/schemas/rule-groups'
import { rulesTable } from '~/infra/drizzle/schemas/rules'

import {
  RuleEntity,
  RuleScope,
  RuleServiceCmd,
  RuleServiceRes,
} from '~/modules/rule/application/rule.type'
import { RuleRepoPort } from '~/modules/rule/ports/rule.repo.port'
import { OperationStatus } from '~/shared/const/app.const'

@Injectable()
export class RuleDrizzleRepo implements RuleRepoPort {
  constructor(
    @Inject(DRIZZLE_PORT)
    private readonly drizzle: DrizzleServicePort,
  ) {}

  async create(cmd: RuleServiceCmd.Create, tx?: Tx): Promise<RuleEntity> {
    const db = defineDb(this.drizzle.db, tx)

    const group = await this.findActiveGroup(cmd.ruleGroupId, tx)

    const [created] = await db
      .insert(rulesTable)
      .values({
        ruleGroupId: cmd.ruleGroupId,
        projectId: group.projectId,
        scope: group.scope,
        name: cmd.name,
        body: cmd.body,
        metadata: cmd.metadata ?? null,
        orderIndex: cmd.orderIndex,
      })
      .returning()

    if (!created) {
      throw new ConflictException('Rule was not created')
    }

    return this.toEntity(created)
  }

  async getById(
    cmd: RuleServiceCmd.GetById,
    tx?: Tx,
  ): Promise<RuleEntity> {
    const rule = await this.findActiveRule(cmd.ruleId, tx)

    return this.toEntity(rule)
  }

  async patch(cmd: RuleServiceCmd.Patch, tx?: Tx): Promise<RuleEntity> {
    const db = defineDb(this.drizzle.db, tx)

    await this.findActiveRule(cmd.ruleId, tx)

    const patch: Partial<typeof rulesTable.$inferInsert> = {}

    if (cmd.name !== undefined) {
      patch.name = cmd.name
    }

    if (cmd.body !== undefined) {
      patch.body = cmd.body
    }

    if (cmd.metadata !== undefined) {
      patch.metadata = cmd.metadata
    }

    const [updated] = await db
      .update(rulesTable)
      .set(patch)
      .where(
        and(eq(rulesTable.id, cmd.ruleId), isNull(rulesTable.deletedAt)),
      )
      .returning()

    if (!updated) {
      throw new NotFoundException('Rule not found')
    }

    return this.toEntity(updated)
  }

  async move(
    cmd: RuleServiceCmd.Move,
    tx?: Tx,
  ): Promise<RuleServiceRes.Move> {
    if (tx) {
      return await this.moveTx(cmd, tx)
    }

    return await this.drizzle.db.transaction(async (trx) => {
      return await this.moveTx(cmd, trx)
    })
  }

  async reorderInGroup(
    cmd: RuleServiceCmd.ReorderInGroup,
    tx?: Tx,
  ): Promise<RuleServiceRes.ReorderInGroup> {
    if (tx) {
      return await this.reorderInGroupTx(cmd, tx)
    }

    return await this.drizzle.db.transaction(async (trx) => {
      return await this.reorderInGroupTx(cmd, trx)
    })
  }

  async delete(
    cmd: RuleServiceCmd.Delete,
    tx?: Tx,
  ): Promise<RuleServiceRes.Delete> {
    const db = defineDb(this.drizzle.db, tx)

    await this.findActiveRule(cmd.ruleId, tx)

    const deletedAt = new Date()

    const [deleted] = await db
      .update(rulesTable)
      .set({
        deletedAt,
      })
      .where(
        and(eq(rulesTable.id, cmd.ruleId), isNull(rulesTable.deletedAt)),
      )
      .returning()

    if (!deleted) {
      throw new NotFoundException('Rule not found')
    }

    return {
      status: OperationStatus.success,
      ruleId: deleted.id,
      deletedAt: deletedAt.toISOString(),
    }
  }

  private async moveTx(
    cmd: RuleServiceCmd.Move,
    tx: Tx,
  ): Promise<RuleServiceRes.Move> {
    const rule = await this.findActiveRule(cmd.ruleId, tx)
    const targetGroup = await this.findActiveGroup(cmd.targetGroupId, tx)

    if (rule.projectId !== targetGroup.projectId) {
      throw new ConflictException(
        'Cross-project rule move is not allowed',
      )
    }

    if (rule.scope !== targetGroup.scope) {
      throw new ConflictException('Cross-scope rule move is not allowed')
    }

    if (rule.ruleGroupId === cmd.targetGroupId) {
      const currentRules = await this.findActiveRulesByGroup(
        rule.ruleGroupId,
        tx,
      )

      const nextRules = currentRules.filter((item) => item.id !== rule.id)

      if (cmd.orderIndex > nextRules.length) {
        throw new ConflictException('Invalid rule order index')
      }

      nextRules.splice(cmd.orderIndex, 0, rule)

      const affectedIds = await this.applyRuleOrder(
        nextRules.map((item, index) => ({
          id: item.id,
          ruleGroupId: item.ruleGroupId,
          orderIndex: index,
        })),
        tx,
      )

      return {
        status: OperationStatus.success,
        ruleId: rule.id,
        affectedIds,
      }
    }

    const sourceRules = (
      await this.findActiveRulesByGroup(rule.ruleGroupId, tx)
    ).filter((item) => item.id !== rule.id)

    const targetRules = await this.findActiveRulesByGroup(
      cmd.targetGroupId,
      tx,
    )

    if (cmd.orderIndex > targetRules.length) {
      throw new ConflictException('Invalid rule order index')
    }

    targetRules.splice(cmd.orderIndex, 0, {
      ...rule,
      ruleGroupId: cmd.targetGroupId,
    })

    const affectedIds = await this.applyRuleOrder(
      [
        ...sourceRules.map((item, index) => ({
          id: item.id,
          ruleGroupId: item.ruleGroupId,
          orderIndex: index,
        })),
        ...targetRules.map((item, index) => ({
          id: item.id,
          ruleGroupId: item.ruleGroupId,
          orderIndex: index,
        })),
      ],
      tx,
    )

    return {
      status: OperationStatus.success,
      ruleId: rule.id,
      affectedIds,
    }
  }

  private async reorderInGroupTx(
    cmd: RuleServiceCmd.ReorderInGroup,
    tx: Tx,
  ): Promise<RuleServiceRes.ReorderInGroup> {
    await this.findActiveGroup(cmd.groupId, tx)

    const ids = cmd.items.map((item) => item.id)
    const uniqueIds = new Set(ids)

    if (ids.length !== uniqueIds.size) {
      throw new ConflictException(
        'Reorder input contains duplicate rule ids',
      )
    }

    const orderIndexes = cmd.items.map((item) => item.orderIndex)
    const uniqueOrderIndexes = new Set(orderIndexes)

    if (orderIndexes.length !== uniqueOrderIndexes.size) {
      throw new ConflictException(
        'Reorder input contains duplicate order indexes',
      )
    }

    const currentRules = await this.findActiveRulesByGroup(
      cmd.groupId,
      tx,
    )
    const currentIds = new Set(currentRules.map((item) => item.id))

    if (cmd.items.length !== currentRules.length) {
      throw new ConflictException(
        'Reorder input must contain all direct rules from the group',
      )
    }

    for (const id of ids) {
      if (!currentIds.has(id)) {
        throw new ConflictException(
          'Reorder input contains foreign or missing rule',
        )
      }
    }

    const affectedIds = await this.applyRuleOrder(
      cmd.items.map((item) => ({
        id: item.id,
        ruleGroupId: cmd.groupId,
        orderIndex: item.orderIndex,
      })),
      tx,
    )

    return {
      status: OperationStatus.success,
      groupId: cmd.groupId,
      affectedIds,
    }
  }

  private async applyRuleOrder(
    items: {
      id: string
      ruleGroupId: string
      orderIndex: number
    }[],
    tx: Tx,
  ): Promise<string[]> {
    if (items.length === 0) {
      return []
    }

    const uniqueItems = Array.from(
      new Map(items.map((item) => [item.id, item])).values(),
    )

    for (let index = 0; index < uniqueItems.length; index++) {
      const item = uniqueItems[index]

      await tx
        .update(rulesTable)
        .set({
          orderIndex: -(index + 1),
        })
        .where(
          and(eq(rulesTable.id, item.id), isNull(rulesTable.deletedAt)),
        )
    }

    for (const item of uniqueItems) {
      await tx
        .update(rulesTable)
        .set({
          ruleGroupId: item.ruleGroupId,
          orderIndex: item.orderIndex,
        })
        .where(
          and(eq(rulesTable.id, item.id), isNull(rulesTable.deletedAt)),
        )
    }

    return uniqueItems.map((item) => item.id)
  }

  private async findActiveRule(id: string, tx?: Tx) {
    const db = defineDb(this.drizzle.db, tx)

    const [rule] = await db
      .select()
      .from(rulesTable)
      .where(and(eq(rulesTable.id, id), isNull(rulesTable.deletedAt)))
      .limit(1)

    if (!rule) {
      throw new NotFoundException('Rule not found')
    }

    return rule
  }

  private async findActiveGroup(id: string, tx?: Tx) {
    const db = defineDb(this.drizzle.db, tx)

    const [group] = await db
      .select()
      .from(ruleGroupsTable)
      .where(
        and(
          eq(ruleGroupsTable.id, id),
          isNull(ruleGroupsTable.deletedAt),
        ),
      )
      .limit(1)

    if (!group) {
      throw new NotFoundException('Rule group not found')
    }

    return group
  }

  private async findActiveRulesByGroup(groupId: string, tx?: Tx) {
    const db = defineDb(this.drizzle.db, tx)

    return await db
      .select()
      .from(rulesTable)
      .where(
        and(
          eq(rulesTable.ruleGroupId, groupId),
          isNull(rulesTable.deletedAt),
        ),
      )
      .orderBy(asc(rulesTable.orderIndex))
  }

  private toEntity(record: typeof rulesTable.$inferSelect): RuleEntity {
    return {
      id: record.id,
      ruleGroupId: record.ruleGroupId,
      projectId: record.projectId,
      scope: record.scope as RuleScope,
      name: record.name,
      body: record.body,
      metadata: record.metadata as RuleEntity['metadata'],
      orderIndex: record.orderIndex,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      deletedAt: record.deletedAt,
    }
  }
}
