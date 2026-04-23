import { Inject, Injectable } from '@nestjs/common'

import {
  RuleEntity,
  RuleServiceCmd,
  RuleServiceRes,
} from '~/modules/rule/application/rule.type'
import {
  RULE_REPO_PORT,
  RuleRepoPort,
} from '~/modules/rule/ports/rule.repo.port'
import { RuleServicePort } from '~/modules/rule/ports/rule.service.port'

@Injectable()
export class RuleService implements RuleServicePort {
  constructor(
    @Inject(RULE_REPO_PORT)
    private readonly ruleRepo: RuleRepoPort,
  ) {}

  async create(cmd: RuleServiceCmd.Create): Promise<RuleServiceRes.Item> {
    const created = await this.ruleRepo.create(cmd)

    return this.toItemRes(created)
  }

  async getById(
    cmd: RuleServiceCmd.GetById,
  ): Promise<RuleServiceRes.Item> {
    const rule = await this.ruleRepo.getByIdOrFail(cmd.ruleId)

    return this.toItemRes(rule)
  }

  async patch(cmd: RuleServiceCmd.Patch): Promise<RuleServiceRes.Update> {
    await this.ruleRepo.patch(cmd)

    return {
      status: 'success',
      ruleId: cmd.ruleId,
    }
  }

  async move(cmd: RuleServiceCmd.Move): Promise<RuleServiceRes.Update> {
    await this.ruleRepo.move(cmd)

    return {
      status: 'success',
      ruleId: cmd.ruleId,
    }
  }

  async reorderInGroup(
    cmd: RuleServiceCmd.ReorderInGroup,
  ): Promise<RuleServiceRes.Update> {
    await this.ruleRepo.reorderInGroup(cmd)

    return {
      status: 'success',
      ruleId: cmd.items[0]?.id ?? '',
    }
  }

  async remove(
    cmd: RuleServiceCmd.Remove,
  ): Promise<RuleServiceRes.Remove> {
    const archivedAt = await this.ruleRepo.remove(cmd.ruleId)

    return {
      status: 'success',
      ruleId: cmd.ruleId,
      archivedAt: archivedAt.toISOString(),
    }
  }

  private toItemRes(entity: RuleEntity): RuleServiceRes.Item {
    return {
      id: entity.id,
      ruleGroupId: entity.ruleGroupId,
      title: entity.title ?? '',
      body: entity.body,
      metadata: entity.metadata,
      orderIndex: entity.orderIndex,
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt?.toISOString() ?? null,
    }
  }
}
