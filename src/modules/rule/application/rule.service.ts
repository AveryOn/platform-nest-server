import { Injectable } from '@nestjs/common'
import { and, eq } from 'drizzle-orm'
import { AppError } from '~/core/error/app-error'
import { ErrorEnum } from '~/core/error/app-error.dict'
import { DrizzleService } from '~/infra/drizzle/drizzle.service'
import { ruleGroupsTable, rulesTable } from '~/infra/drizzle/schemas'
import { RuleServicePort } from '~/modules/rule/ports/rule.service.port'
import { createId } from '~/shared/crypto/hash.crypto'
import { CreateRuleRecord, ReorderInput, UpdateRuleRecord } from './rule.types'

@Injectable()
export class RuleService implements RuleServicePort {
  constructor(
    // @Inject(RULE_REPO_PORT)
    // private readonly ruleRepo: RuleRepoPort,
    private readonly drizzle: DrizzleService,
  ) {}

  async create(_activeOrganizationId: string, projectId: string, data: CreateRuleRecord) {
    const group = await this.drizzle.db.query.ruleGroupsTable.findFirst({
      where: and(eq(ruleGroupsTable.id, data.groupId), eq(ruleGroupsTable.projectId, projectId)),
    })

    if (!group) {
      throw new AppError(ErrorEnum.GROUP_NOT_FOUND)
    }

    const ruleId = createId()

    // await this.drizzle.db.insert(rules).values({
    //   id: ruleId,
    //   projectId,
    //   groupId: data.groupId,
    //   title: data.title ?? null,
    //   body: data.body,
    //   metadata: data.metadata ?? null,
    //   orderIndex: data.orderIndex ?? 0,
    // })

    const rule = await this.drizzle.db.query.rulesTable.findFirst({
      where: eq(rulesTable.id, ruleId),
    })

    return rule!
  }

  async update(
    _activeOrganizationId: string,
    _projectId: string,
    ruleId: string,
    data: UpdateRuleRecord,
  ) {
    const updateData: Partial<typeof rulesTable.$inferInsert> = {}
    if (data.title !== undefined) updateData.name = data.title || ''
    if (data.body !== undefined) updateData.body = data.body
    if (data.metadata !== undefined) updateData.metadata = data.metadata
    if (data.orderIndex !== undefined) updateData.orderIndex = data.orderIndex
    // if (data.enabled !== undefined) updateData.enabled = data.enabled || false
    if (data.groupId !== undefined) updateData.ruleGroupId = data.groupId

    // await this.drizzle.db
    //   .update(rules)
    //   .set(updateData)
    //   .where(and(eq(rules.id, ruleId), eq(rules.projectId, projectId)))

    const rule = await this.drizzle.db.query.rulesTable.findFirst({
      where: eq(rulesTable.id, ruleId),
    })

    return rule!
  }

  delete(_activeOrganizationId: string, _projectId: string, _ruleId: string) {
    // await this.drizzle.db
    //   .update(rules)
    //   .set({ deletedAt: new Date() })
    //   .where(and(eq(rules.id, ruleId), eq(rules.projectId, projectId)))

    return { success: true }
  }

  async reorder(_activeOrganizationId: string, _projectId: string, body: ReorderInput) {
    const { orderedIds } = body

    if (!Array.isArray(orderedIds) || orderedIds.length === 0) {
      throw new AppError('INVALID_DATA')
    }

    await this.drizzle.db.transaction(async (_tx) => {
      for (let i = 0; i < orderedIds.length; i++) {
        const id = orderedIds[i]
        if (typeof id !== 'string') continue
        return Promise.resolve(null)
        // await tx
        //   .update(rules)
        //   .set({ orderIndex: i })
        //   .where(and(eq(rules.id, id), eq(rules.projectId, projectId), eq(rules.groupId, groupId)))
      }
    })

    return { success: true }
  }
}
