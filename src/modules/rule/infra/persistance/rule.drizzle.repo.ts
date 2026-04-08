import { Injectable } from '@nestjs/common'
import { DrizzleService } from '~/infra/drizzle/drizzle.service'
import { RuleRepoPort } from '~/modules/rule/ports/rule.repo.port'
import { CreateRuleRecord, Rule, UpdateRuleRecord } from '~/modules/rule/application/rule.types'
import { rules } from '~/infra/drizzle/schemas'
import { and, eq } from 'drizzle-orm'
import { createId } from '~/shared/crypto/hash.crypto'

@Injectable()
export class RuleDrizzleRepo implements RuleRepoPort {
  constructor(private readonly drizzle: DrizzleService) {}
  async create(input: CreateRuleRecord): Promise<Rule> {
    const id = createId()

    await this.drizzle.db.insert(rules).values({
      id,
      projectId: input.projectId,
      groupId: input.groupId,
      title: input.title ?? null,
      body: input.body,
      metadata: input.metadata ?? null,
      orderIndex: input.orderIndex ?? 0,
    })

    const rule = await this.drizzle.db.query.rules.findFirst({
      where: eq(rules.id, id),
    })

    if (!rule) {
      throw new Error('Rule was not created')
    }

    return rule
  }

  async update(projectId: string, ruleId: string, input: UpdateRuleRecord): Promise<Rule | null> {
    await this.drizzle.db
      .update(rules)
      .set(input)
      .where(and(eq(rules.id, ruleId), eq(rules.projectId, projectId)))

    return this.findById(projectId, ruleId)
  }

  async findById(projectId: string, ruleId: string): Promise<Rule | null> {
    return (
      (await this.drizzle.db.query.rules.findFirst({
        where: and(eq(rules.id, ruleId), eq(rules.projectId, projectId)),
      })) ?? null
    )
  }

  async softDelete(projectId: string, ruleId: string): Promise<void> {
    await this.drizzle.db
      .update(rules)
      .set({ deletedAt: new Date() })
      .where(and(eq(rules.id, ruleId), eq(rules.projectId, projectId)))
  }

  async reorder(projectId: string, groupId: string, orderedIds: string[]): Promise<void> {
    await this.drizzle.db.transaction(async (tx) => {
      for (let i = 0; i < orderedIds.length; i++) {
        await tx
          .update(rules)
          .set({ orderIndex: i })
          .where(
            and(
              eq(rules.id, orderedIds[i]),
              eq(rules.projectId, projectId),
              eq(rules.groupId, groupId),
            ),
          )
      }
    })
  }
}
