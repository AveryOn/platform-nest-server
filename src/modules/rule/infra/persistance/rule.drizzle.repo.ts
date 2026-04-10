import { Injectable } from '@nestjs/common'
import { and, eq } from 'drizzle-orm'
import { DrizzleService } from '~/infra/drizzle/drizzle.service'
import { rulesTable } from '~/infra/drizzle/schemas'
import { CreateRuleRecord, Rule, UpdateRuleRecord } from '~/modules/rule/application/rule.types'
import { RuleRepoPort } from '~/modules/rule/ports/rule.repo.port'
import { createId } from '~/shared/crypto/hash.crypto'

@Injectable()
export class RuleDrizzleRepo implements RuleRepoPort {
  constructor(private readonly drizzle: DrizzleService) {}
  async create(input: CreateRuleRecord): Promise<Rule> {
    const id = createId()

    await this.drizzle.db.insert(rulesTable).values({
      id,
      projectId: input.projectId,
      groupId: input.groupId,
      title: input.title ?? null,
      body: input.body,
      metadata: input.metadata ?? null,
      orderIndex: input.orderIndex ?? 0,
    })

    const rule = await this.drizzle.db.query.rules.findFirst({
      where: eq(rulesTable.id, id),
    })

    if (!rule) {
      throw new Error('Rule was not created')
    }

    return rule
  }

  async update(projectId: string, ruleId: string, input: UpdateRuleRecord): Promise<Rule | null> {
    await this.drizzle.db
      .update(rulesTable)
      .set(input)
      .where(and(eq(rulesTable.id, ruleId), eq(rulesTable.projectId, projectId)))

    return this.findById(projectId, ruleId)
  }

  async findById(projectId: string, ruleId: string): Promise<Rule | null> {
    return (
      (await this.drizzle.db.query.rules.findFirst({
        where: and(eq(rulesTable.id, ruleId), eq(rulesTable.projectId, projectId)),
      })) ?? null
    )
  }

  async softDelete(projectId: string, ruleId: string): Promise<void> {
    await this.drizzle.db
      .update(rulesTable)
      .set({ deletedAt: new Date() })
      .where(and(eq(rulesTable.id, ruleId), eq(rulesTable.projectId, projectId)))
  }

  async reorder(projectId: string, groupId: string, orderedIds: string[]): Promise<void> {
    await this.drizzle.db.transaction(async (tx) => {
      for (let i = 0; i < orderedIds.length; i++) {
        await tx
          .update(rulesTable)
          .set({ orderIndex: i })
          .where(
            and(
              eq(rulesTable.id, orderedIds[i]),
              eq(rulesTable.projectId, projectId),
              eq(rulesTable.groupId, groupId),
            ),
          )
      }
    })
  }
}
