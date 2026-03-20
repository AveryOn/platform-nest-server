import { Injectable } from '@nestjs/common'
import { RuleServicePort } from '~/modules/rule/ports/rule.service.port'
import { DrizzleService } from '~/infra/drizzle/drizzle.service'
import { requireProjectAccess } from '~/modules/auth/auth.utils'
import { CreateRuleRecord, ReorderInput, UpdateRuleRecord } from './rule.types'
import { and, eq } from 'drizzle-orm'
import { ruleGroups, rules } from '~/infra/drizzle/schemas'
import { AppError } from '~/core/error/app-error'
import { ErrorEnum } from '~/core/error/app-error.dict'
import { createId } from '~/shared/crypto/hash.crypto'

@Injectable()
export class RuleService implements RuleServicePort {
  constructor(
    // @Inject(RULE_REPO_PORT)
    // private readonly ruleRepo: RuleRepoPort,
    private readonly drizzle: DrizzleService,
  ) {}

  async create(
    activeOrganizationId: string,
    projectId: string,
    data: CreateRuleRecord,
  ) {
    await requireProjectAccess(activeOrganizationId, projectId, this.drizzle)

    const group = await this.drizzle.db.query.ruleGroups.findFirst({
      where: and(
        eq(ruleGroups.id, data.groupId),
        eq(ruleGroups.projectId, projectId),
      ),
    })

    if (!group) {
      throw new AppError(ErrorEnum.GROUP_NOT_FOUND)
    }

    const ruleId = createId()

    await this.drizzle.db.insert(rules).values({
      id: ruleId,
      projectId,
      groupId: data.groupId,
      title: data.title ?? null,
      body: data.body,
      metadata: data.metadata ?? null,
      orderIndex: data.orderIndex ?? 0,
    })

    const rule = await this.drizzle.db.query.rules.findFirst({
      where: eq(rules.id, ruleId),
    })

    return rule!
  }

  async update(
    activeOrganizationId: string,
    projectId: string,
    ruleId: string,
    data: UpdateRuleRecord,
  ) {
    await requireProjectAccess(activeOrganizationId, projectId, this.drizzle)

    const updateData: Partial<typeof rules.$inferInsert> = {}
    if (data.title !== undefined) updateData.title = data.title
    if (data.body !== undefined) updateData.body = data.body
    if (data.metadata !== undefined) updateData.metadata = data.metadata
    if (data.orderIndex !== undefined) updateData.orderIndex = data.orderIndex
    if (data.enabled !== undefined) updateData.enabled = data.enabled
    if (data.groupId !== undefined) updateData.groupId = data.groupId

    await this.drizzle.db
      .update(rules)
      .set(updateData)
      .where(and(eq(rules.id, ruleId), eq(rules.projectId, projectId)))

    const rule = await this.drizzle.db.query.rules.findFirst({
      where: eq(rules.id, ruleId),
    })

    return rule!
  }

  async delete(
    activeOrganizationId: string,
    projectId: string,
    ruleId: string,
  ) {
    await requireProjectAccess(activeOrganizationId, projectId, this.drizzle)

    await this.drizzle.db
      .update(rules)
      .set({ deletedAt: new Date() })
      .where(and(eq(rules.id, ruleId), eq(rules.projectId, projectId)))

    return { success: true }
  }

  async reorder(activeOrganizationId: string, projectId: string, body: ReorderInput) {
    await requireProjectAccess(activeOrganizationId, projectId, this.drizzle);
  
    const { groupId, orderedIds } = body;
  
    if (!Array.isArray(orderedIds) || orderedIds.length === 0) {
      throw new AppError('INVALID_DATA')
    }
  
    await this.drizzle.db.transaction(async (tx) => {
      for (let i = 0; i < orderedIds.length; i++) {
        const id = orderedIds[i];
        if (typeof id !== "string") continue;
  
        await tx
          .update(rules)
          .set({ orderIndex: i })
          .where(
            and(
              eq(rules.id, id),
              eq(rules.projectId, projectId),
              eq(rules.groupId, groupId)
            )
          );
      }
    });
  
    return { success: true }
  }
}
