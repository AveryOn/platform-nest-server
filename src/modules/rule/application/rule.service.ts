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
import { OperationStatus } from '~/shared/const/app.const'

@Injectable()
export class RuleService implements RuleServicePort {
  constructor(
    @Inject(RULE_REPO_PORT)
    private readonly ruleRepo: RuleRepoPort,
  ) {}

  async create(cmd: RuleServiceCmd.Create): Promise<RuleServiceRes.Item> {
    const entity = await this.ruleRepo.create(cmd)

    return this.toItemRes(entity)
  }

  async getById(
    cmd: RuleServiceCmd.GetById,
  ): Promise<RuleServiceRes.Item> {
    const entity = await this.ruleRepo.getById(cmd)

    return this.toItemRes(entity)
  }

  async patch(cmd: RuleServiceCmd.Patch): Promise<RuleServiceRes.Update> {
    const entity = await this.ruleRepo.patch(cmd)

    return {
      status: OperationStatus.success,
      ruleId: entity.id,
    }
  }

  async move(cmd: RuleServiceCmd.Move): Promise<RuleServiceRes.Move> {
    return await this.ruleRepo.move(cmd)
  }

  async reorderInGroup(
    cmd: RuleServiceCmd.ReorderInGroup,
  ): Promise<RuleServiceRes.ReorderInGroup> {
    return await this.ruleRepo.reorderInGroup(cmd)
  }

  async delete(
    cmd: RuleServiceCmd.Delete,
  ): Promise<RuleServiceRes.Delete> {
    return await this.ruleRepo.delete(cmd)
  }

  private toItemRes(entity: RuleEntity): RuleServiceRes.Item {
    return {
      id: entity.id,
      ruleGroupId: entity.ruleGroupId,
      name: entity.name,
      body: entity.body,
      scope: entity.scope,
      projectId: entity.projectId,
      metadata: entity.metadata,
      orderIndex: entity.orderIndex,
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt?.toISOString() ?? null,
    }
  }
}
