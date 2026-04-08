import { Injectable } from '@nestjs/common'
import { RuleGroupServicePort } from '~/modules/rule-group/ports/rule-group.service.port'
import { requireProjectAccess } from '~/modules/auth/auth.utils'
import { DrizzleService } from '~/infra/drizzle/drizzle.service'
import {
  RuleGroupCreateInput,
  RuleGroupReorderInput,
  RuleGroupUpdateInput,
} from './rule-group.types'
import { createId } from '~/shared/crypto/hash.crypto'
import { ruleGroupsTable } from '~/infra/drizzle/schemas'

import { and, eq, isNull } from 'drizzle-orm'
import { AppError } from '~/core/error/app-error'

@Injectable()
export class RuleGroupService implements RuleGroupServicePort {
  constructor(
    // @Inject(RULE_GROUP_REPO_PORT)
    // private readonly ruleGroupRepo: RuleGroupRepoPort,
    private readonly drizzle: DrizzleService,
  ) {}

  async create(activeOrganizationId: string, projectId: string, data: RuleGroupCreateInput) {
    await requireProjectAccess(activeOrganizationId, projectId, this.drizzle)

    const groupId = createId()

    await this.drizzle.db.insert(ruleGroupsTable).values({
      id: groupId,
      projectId,
      parentGroupId: data.parentGroupId ?? null,
      name: data.name,
      description: data.description ?? null,
      kind: data.kind,
      metadata: data.metadata ?? null,
      orderIndex: data.orderIndex ?? 0,
    })

    const group = await this.drizzle.db.query.ruleGroups.findFirst({
      where: eq(ruleGroupsTable.id, groupId),
    })

    return group!
  }

  async update(
    activeOrganizationId: string,
    projectId: string,
    groupId: string,
    data: RuleGroupUpdateInput,
  ) {
    await requireProjectAccess(activeOrganizationId, projectId, this.drizzle)

    const updateData: Partial<typeof ruleGroupsTable.$inferInsert> = {}
    if (data.name !== undefined) updateData.name = data.name
    if (data.description !== undefined) updateData.description = data.description
    if (data.kind !== undefined) updateData.kind = data.kind
    if (data.parentGroupId !== undefined) updateData.parentGroupId = data.parentGroupId
    if (data.metadata !== undefined) updateData.metadata = data.metadata
    if (data.orderIndex !== undefined) updateData.orderIndex = data.orderIndex
    if (data.enabled !== undefined) updateData.enabled = data.enabled

    await this.drizzle.db
      .update(ruleGroupsTable)
      .set(updateData)
      .where(and(eq(ruleGroupsTable.id, groupId), eq(ruleGroupsTable.projectId, projectId)))

    const group = await this.drizzle.db.query.ruleGroups.findFirst({
      where: eq(ruleGroupsTable.id, groupId),
    })

    return group!
  }

  async delete(activeOrganizationId: string, projectId: string, groupId: string) {
    await requireProjectAccess(activeOrganizationId, projectId, this.drizzle)

    await this.drizzle.db
      .update(ruleGroupsTable)
      .set({ deletedAt: new Date() })
      .where(and(eq(ruleGroupsTable.id, groupId), eq(ruleGroupsTable.projectId, projectId)))

    return { success: true }
  }

  async reorder(activeOrganizationId: string, projectId: string, body: RuleGroupReorderInput) {
    await requireProjectAccess(activeOrganizationId, projectId, this.drizzle)

    const { parentGroupId, orderedIds } = body

    if (!Array.isArray(orderedIds) || orderedIds.length === 0) {
      throw new AppError('INVALID_DATA', undefined, {
        msg: 'orderedIds must be a non-empty array',
      })
    }

    await this.drizzle.db.transaction(async (tx) => {
      for (let i = 0; i < orderedIds.length; i++) {
        const id = orderedIds[i]
        if (typeof id !== 'string') continue

        await tx
          .update(ruleGroupsTable)
          .set({ orderIndex: i })
          .where(
            and(
              eq(ruleGroupsTable.id, id),
              eq(ruleGroupsTable.projectId, projectId),
              parentGroupId === null
                ? isNull(ruleGroupsTable.parentGroupId)
                : eq(ruleGroupsTable.parentGroupId, parentGroupId),
            ),
          )
      }
    })

    return { success: true }
  }
}
