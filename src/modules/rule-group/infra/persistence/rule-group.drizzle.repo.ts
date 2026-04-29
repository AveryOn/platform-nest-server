import { Inject, Injectable } from '@nestjs/common'
import {
  DRIZZLE_PORT,
  type DrizzleServicePort,
} from '~/infra/drizzle/ports/drizzle.service.port'

import {
  RuleGroupScope,
  RuleGroupType,
  type RuleGroupEntity,
  type RuleGroupServiceCmd,
} from '~/modules/rule-group/application/rule-group.type'
import { RuleGroupRepoPort } from '~/modules/rule-group/ports/rule-group.repo.port'

@Injectable()
export class RuleGroupDrizzleRepo implements RuleGroupRepoPort {
  constructor(
    @Inject(DRIZZLE_PORT)
    private readonly drizzle: DrizzleServicePort,
  ) {}

  async create(
    cmd: RuleGroupServiceCmd.Create,
  ): Promise<RuleGroupEntity> {
    return Promise.resolve({
      id: crypto.randomUUID(),
      projectId: cmd.projectId,
      parentGroupId: cmd.parentGroupId ?? null,
      name: cmd.name,
      metadata: null,
      scope: RuleGroupScope.project,
      description: cmd.description ?? null,
      type: cmd.type || RuleGroupType.section,
      orderIndex: cmd.orderIndex,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    })
  }

  async getByIdOrFail(groupId: string): Promise<RuleGroupEntity> {
    return Promise.resolve({
      id: groupId,
      projectId: '550e8400-e29b-41d4-a716-446655440000',
      parentGroupId: null,
      name: 'Button',
      metadata: null,
      scope: RuleGroupScope.project,
      description: 'Rules for button component',
      type: RuleGroupType.component,
      orderIndex: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    })
  }

  async patch(_cmd: RuleGroupServiceCmd.Patch): Promise<void> {
    return Promise.resolve()
  }

  async move(_cmd: RuleGroupServiceCmd.Move): Promise<void> {
    return Promise.resolve()
  }

  async reorderChildren(
    _cmd: RuleGroupServiceCmd.ReorderChildren,
  ): Promise<void> {
    return Promise.resolve()
  }

  async reorderRoot(
    _cmd: RuleGroupServiceCmd.ReorderRoot,
  ): Promise<void> {
    return Promise.resolve()
  }

  async delete(_groupId: string): Promise<Date> {
    return Promise.resolve(new Date())
  }
}
