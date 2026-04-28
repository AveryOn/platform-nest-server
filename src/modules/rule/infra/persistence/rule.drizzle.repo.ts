import { Inject, Injectable } from '@nestjs/common'
import {
  DRIZZLE_PORT,
  type DrizzleServicePort,
} from '~/infra/drizzle/ports/drizzle.service.port'

import {
  RuleEntity,
  RuleServiceCmd,
} from '~/modules/rule/application/rule.type'
import { RuleRepoPort } from '~/modules/rule/ports/rule.repo.port'

@Injectable()
export class RuleDrizzleRepo implements RuleRepoPort {
  constructor(
    @Inject(DRIZZLE_PORT)
    private readonly drizzle: DrizzleServicePort,
  ) {}

  async create(cmd: RuleServiceCmd.Create): Promise<RuleEntity> {
    return await Promise.resolve({
      id: crypto.randomUUID(),
      ruleGroupId: cmd.ruleGroupId,
      title: cmd.title ?? '',
      body: cmd.body,
      metadata: cmd.metadata ?? null,
      orderIndex: cmd.orderIndex,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    })
  }

  async getByIdOrFail(ruleId: string): Promise<RuleEntity> {
    return await Promise.resolve({
      id: ruleId,
      ruleGroupId: '8fd2dbff-e5e7-4781-b22c-b17d061ee8d7',
      title: 'When to use',
      body: 'Use button for primary actions.',
      metadata: {
        tags: ['button', 'usage'],
      },
      orderIndex: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    })
  }

  async patch(_cmd: RuleServiceCmd.Patch): Promise<void> {
    await Promise.resolve()
    throw new Error('Not implemented')
  }

  async move(_cmd: RuleServiceCmd.Move): Promise<void> {
    await Promise.resolve()
    throw new Error('Not implemented')
  }

  async reorderInGroup(
    _cmd: RuleServiceCmd.ReorderInGroup,
  ): Promise<void> {
    await Promise.resolve()
    throw new Error('Not implemented')
  }

  async remove(_ruleId: string): Promise<Date> {
    await Promise.resolve()
    throw new Error('Not implemented')
  }
}
