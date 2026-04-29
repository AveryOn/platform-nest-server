import { Inject, Injectable } from '@nestjs/common'
import {
  RuleGroupServiceCmd,
  RuleGroupServiceResult,
  type RuleGroupEntity,
} from '~/modules/rule-group/application/rule-group.type'
import {
  RULE_GROUP_REPO_PORT,
  type RuleGroupRepoPort,
} from '~/modules/rule-group/ports/rule-group.repo.port'
import { RuleGroupServicePort } from '~/modules/rule-group/ports/rule-group.service.port'
import { OperationStatus } from '~/shared/const/app.const'

@Injectable()
export class RuleGroupService implements RuleGroupServicePort {
  constructor(
    @Inject(RULE_GROUP_REPO_PORT)
    private readonly ruleGroupRepo: RuleGroupRepoPort,
  ) {}

  async create(
    cmd: RuleGroupServiceCmd.Create,
  ): Promise<RuleGroupServiceResult.Item> {
    const created = await this.ruleGroupRepo.create(cmd)

    return this.toItemResult(created)
  }

  async getById(
    cmd: RuleGroupServiceCmd.GetById,
  ): Promise<RuleGroupServiceResult.Item> {
    const group = await this.ruleGroupRepo.getByIdOrFail(cmd.groupId)

    return this.toItemResult(group)
  }

  async patch(
    cmd: RuleGroupServiceCmd.Patch,
  ): Promise<RuleGroupServiceResult.Update> {
    await this.ruleGroupRepo.patch(cmd)

    return {
      status: OperationStatus.success,
      groupId: cmd.groupId,
    }
  }

  async move(
    cmd: RuleGroupServiceCmd.Move,
  ): Promise<RuleGroupServiceResult.Update> {
    await this.ruleGroupRepo.move(cmd)

    return {
      status: OperationStatus.success,
      groupId: cmd.groupId,
    }
  }

  async reorderChildren(
    cmd: RuleGroupServiceCmd.ReorderChildren,
  ): Promise<RuleGroupServiceResult.Update> {
    await this.ruleGroupRepo.reorderChildren(cmd)

    return {
      status: OperationStatus.success,
      groupId: cmd.groupId,
    }
  }

  async reorderRoot(
    cmd: RuleGroupServiceCmd.ReorderRoot,
  ): Promise<RuleGroupServiceResult.Update> {
    await this.ruleGroupRepo.reorderRoot(cmd)

    return {
      status: OperationStatus.success,
      groupId: cmd.items[0]?.id ?? '',
    }
  }

  async delete(
    cmd: RuleGroupServiceCmd.Delete,
  ): Promise<RuleGroupServiceResult.Delete> {
    const deletedAt = await this.ruleGroupRepo.delete(cmd.groupId)

    return {
      status: OperationStatus.success,
      groupId: cmd.groupId,
      deletedAt: deletedAt.toISOString(),
    }
  }

  private toItemResult(
    entity: RuleGroupEntity,
  ): RuleGroupServiceResult.Item {
    return {
      id: entity.id,
      scope: entity.scope,
      metadata: entity.metadata,
      projectId: entity.projectId,
      parentGroupId: entity.parentGroupId,
      name: entity.name,
      description: entity.description,
      type: entity.type,
      orderIndex: entity.orderIndex,
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt?.toISOString() ?? null,
    }
  }
}
