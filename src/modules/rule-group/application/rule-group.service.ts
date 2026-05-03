import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import type { TransactionContext } from '~/infra/transaction/application/transaction.type'
import {
  TX_PORT,
  type TransactionPort,
} from '~/infra/transaction/ports/transaction.port'
import {
  RuleGroupScope,
  RuleGroupServiceCmd,
  RuleGroupServiceResult,
  type RuleGroupMetadata,
  type RuleGroupRawEntity,
  type RuleGroupRepoCmd,
  type RuleGroupType,
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

    @Inject(TX_PORT)
    private readonly transaction: TransactionPort<TransactionContext>,
  ) {}

  async create(
    cmd: RuleGroupServiceCmd.Create,
  ): Promise<RuleGroupServiceResult.Item> {
    return this.transaction.run(async (tx) => {
      await this.ruleGroupRepo.findProjectOrFail(
        {
          projectId: cmd.projectId,
          organizationId: cmd.organizationId,
        },
        tx,
      )

      if (cmd.parentGroupId) {
        const parent = await this.ruleGroupRepo.findActiveGroup(
          {
            groupId: cmd.parentGroupId,
            organizationId: cmd.organizationId,
          },
          tx,
        )

        if (parent.projectId !== cmd.projectId) {
          throw new ConflictException(
            'Parent rule group belongs to another project',
          )
        }

        if ((parent.scope as RuleGroupScope) !== RuleGroupScope.project) {
          throw new ConflictException(
            'Parent rule group has incompatible scope',
          )
        }
      }

      const siblings = await this.ruleGroupRepo.findActiveChildren(
        {
          projectId: cmd.projectId,
          parentGroupId: cmd.parentGroupId ?? null,
        },
        tx,
      )

      if (cmd.orderIndex > siblings.length) {
        throw new ConflictException('Invalid rule group order index')
      }

      const created = await this.ruleGroupRepo.create(cmd, tx)

      if (!created) {
        throw new ConflictException('Rule group was not created')
      }

      const ordered = [...siblings, created].sort(
        (a, b) => a.orderIndex - b.orderIndex,
      )

      ordered.splice(
        ordered.findIndex((item) => item.id === created.id),
        1,
      )

      ordered.splice(cmd.orderIndex, 0, created)

      await this.ruleGroupRepo.applyGroupOrder(
        ordered.map((item, index) => ({
          id: item.id,
          parentGroupId: item.parentGroupId,
          orderIndex: index,
        })),
        tx,
      )

      const group = await this.ruleGroupRepo.findActiveGroup(
        {
          groupId: created.id,
          organizationId: cmd.organizationId,
        },
        tx,
      )

      return this.toItemResult(group)
    })
  }

  async getById(
    cmd: RuleGroupServiceCmd.GetById,
  ): Promise<RuleGroupServiceResult.Item> {
    const group = await this.ruleGroupRepo.findActiveGroup({
      groupId: cmd.groupId,
      organizationId: cmd.organizationId,
    })

    return this.toItemResult(group)
  }

  async patch(
    cmd: RuleGroupServiceCmd.Patch,
  ): Promise<RuleGroupServiceResult.Update> {
    return await this.transaction.run(async (tx) => {
      await this.ruleGroupRepo.findActiveGroup(
        {
          groupId: cmd.groupId,
          organizationId: cmd.organizationId,
        },
        tx,
      )

      const command: RuleGroupRepoCmd.Patch = {
        groupId: cmd.groupId,
        organizationId: cmd.organizationId,
        patch: {},
      }

      if (cmd.name !== undefined) {
        command.patch.name = cmd.name
      }
      if (cmd.description !== undefined) {
        command.patch.description = cmd.description
      }
      if (cmd.metadata !== undefined) {
        command.patch.metadata = cmd.metadata
      }
      if (cmd.type !== undefined) {
        command.patch.type = cmd.type
      }

      const updated = await this.ruleGroupRepo.patch(
        {
          groupId: cmd.groupId,
          patch: command.patch,
          organizationId: cmd.organizationId,
        },
        tx,
      )

      if (!updated) {
        throw new NotFoundException('Rule group not found')
      }

      return {
        status: OperationStatus.success,
        groupId: updated.id,
      }
    })
  }

  async move(
    cmd: RuleGroupServiceCmd.Move,
  ): Promise<RuleGroupServiceResult.Move> {
    return await this.transaction.run(async (tx) => {
      const group = await this.ruleGroupRepo.findActiveGroup(
        {
          groupId: cmd.groupId,
          organizationId: cmd.organizationId,
        },
        tx,
      )

      if (group.projectId !== cmd.projectId) {
        throw new ConflictException(
          'Rule group belongs to another project',
        )
      }

      if (cmd.parentGroupId === cmd.groupId) {
        throw new ConflictException(
          'Rule group cannot be moved into itself',
        )
      }

      let targetParent: RuleGroupRawEntity | null = null

      if (cmd.parentGroupId) {
        targetParent = await this.ruleGroupRepo.findActiveGroup(
          {
            groupId: cmd.parentGroupId,
            organizationId: cmd.organizationId,
          },
          tx,
        )

        if (targetParent.projectId !== cmd.projectId) {
          throw new ConflictException(
            'Target parent belongs to another project',
          )
        }

        if (targetParent.projectId !== group.projectId) {
          throw new ConflictException(
            'Target parent belongs to another project',
          )
        }

        if (targetParent.scope !== group.scope) {
          throw new ConflictException(
            'Target parent has incompatible scope',
          )
        }

        const descendantIds =
          await this.ruleGroupRepo.collectDescendantGroupIds(
            {
              groupId: group.id,
              projectId: cmd.projectId,
            },
            tx,
          )

        if (descendantIds.includes(targetParent.id)) {
          throw new ConflictException(
            'Rule group cannot be moved into its own subtree',
          )
        }
      }

      const sourceSiblings = (
        await this.ruleGroupRepo.findActiveChildren(
          {
            projectId: cmd.projectId,
            parentGroupId: group.parentGroupId,
          },
          tx,
        )
      ).filter((item) => item.id !== group.id)

      const targetSiblings = await this.ruleGroupRepo.findActiveChildren(
        {
          projectId: cmd.projectId,
          parentGroupId: cmd.parentGroupId,
        },
        tx,
      )

      if (cmd.orderIndex > targetSiblings.length) {
        throw new ConflictException('Invalid rule group order index')
      }

      if (group.parentGroupId === cmd.parentGroupId) {
        const nextSiblings = targetSiblings.filter(
          (item) => item.id !== group.id,
        )

        nextSiblings.splice(cmd.orderIndex, 0, group)

        const affectedIds = await this.ruleGroupRepo.applyGroupOrder(
          nextSiblings.map((item, index) => ({
            id: item.id,
            parentGroupId: item.parentGroupId,
            orderIndex: index,
          })),
          tx,
        )

        return {
          status: OperationStatus.success,
          groupId: group.id,
          affectedIds,
        }
      }

      targetSiblings.splice(cmd.orderIndex, 0, {
        ...group,
        parentGroupId: cmd.parentGroupId,
      })

      const affectedIds = await this.ruleGroupRepo.applyGroupOrder(
        [
          ...sourceSiblings.map((item, index) => ({
            id: item.id,
            parentGroupId: item.parentGroupId,
            orderIndex: index,
          })),
          ...targetSiblings.map((item, index) => ({
            id: item.id,
            parentGroupId: item.parentGroupId,
            orderIndex: index,
          })),
        ],
        tx,
      )

      return {
        status: OperationStatus.success,
        groupId: group.id,
        affectedIds,
      }
    })
  }

  async reorderChildren(
    cmd: RuleGroupServiceCmd.ReorderChildren,
  ): Promise<RuleGroupServiceResult.ReorderChildren> {
    return await this.transaction.run(async (tx) => {
      const parent = await this.ruleGroupRepo.findActiveGroup(
        {
          groupId: cmd.groupId,
          organizationId: cmd.organizationId,
        },
        tx,
      )

      const currentChildren = await this.ruleGroupRepo.findActiveChildren(
        {
          projectId: parent.projectId,
          parentGroupId: parent.id,
        },
        tx,
      )

      this.validateReorderInput(
        cmd.items,
        currentChildren.map((item) => item.id),
      )

      const affectedIds = await this.ruleGroupRepo.applyGroupOrder(
        cmd.items.map((item) => ({
          id: item.id,
          parentGroupId: parent.id,
          orderIndex: item.orderIndex,
        })),
        tx,
      )

      return {
        status: OperationStatus.success,
        groupId: parent.id,
        affectedIds,
      }
    })
  }

  async reorderRoot(
    cmd: RuleGroupServiceCmd.ReorderRoot,
  ): Promise<RuleGroupServiceResult.ReorderRoot> {
    return await this.transaction.run(async (tx) => {
      await this.ruleGroupRepo.findProjectOrFail(
        {
          projectId: cmd.projectId,
          organizationId: cmd.organizationId,
        },
        tx,
      )

      const rootGroups = await this.ruleGroupRepo.findActiveChildren(
        {
          projectId: cmd.projectId,
          parentGroupId: null,
        },
        tx,
      )

      this.validateReorderInput(
        cmd.items,
        rootGroups.map((item) => item.id),
      )

      const affectedIds = await this.ruleGroupRepo.applyGroupOrder(
        cmd.items.map((item) => ({
          id: item.id,
          parentGroupId: null,
          orderIndex: item.orderIndex,
        })),
        tx,
      )

      return {
        status: OperationStatus.success,
        projectId: cmd.projectId,
        affectedIds,
      }
    })
  }

  async delete(
    cmd: RuleGroupServiceCmd.Delete,
  ): Promise<RuleGroupServiceResult.Delete> {
    return await this.transaction.run(async (tx) => {
      const group = await this.ruleGroupRepo.findActiveGroup(
        {
          groupId: cmd.groupId,
          organizationId: cmd.organizationId,
        },
        tx,
      )

      if (group.projectId !== cmd.projectId) {
        throw new ConflictException(
          'Rule group belongs to another project',
        )
      }

      const descendantIds =
        await this.ruleGroupRepo.collectDescendantGroupIds(
          {
            groupId: cmd.groupId,
            projectId: cmd.projectId,
          },
          tx,
        )

      const groupIds = [cmd.groupId, ...descendantIds]

      const deletedAt = await this.ruleGroupRepo.deleteGroupRelations(
        {
          projectId: cmd.projectId,
          groupIds,
        },
        tx,
      )

      return {
        status: OperationStatus.success,
        groupId: cmd.groupId,
        deletedAt: deletedAt.toISOString(),
      }
    })
  }

  private validateReorderInput(
    items: RuleGroupServiceCmd.ReorderItem[],
    currentIds: string[],
  ): void {
    const itemIds = items.map((item) => item.id)
    const uniqueItemIds = new Set(itemIds)

    if (itemIds.length !== uniqueItemIds.size) {
      throw new ConflictException(
        'Reorder input contains duplicate rule group ids',
      )
    }

    const orderIndexes = items.map((item) => item.orderIndex)
    const uniqueOrderIndexes = new Set(orderIndexes)

    if (orderIndexes.length !== uniqueOrderIndexes.size) {
      throw new ConflictException(
        'Reorder input contains duplicate order indexes',
      )
    }

    if (items.length !== currentIds.length) {
      throw new ConflictException(
        'Reorder input must contain all direct rule groups',
      )
    }

    const currentIdSet = new Set(currentIds)

    for (const id of itemIds) {
      if (!currentIdSet.has(id)) {
        throw new ConflictException(
          'Reorder input contains foreign or missing rule group',
        )
      }
    }
  }

  private toItemResult(
    entity: RuleGroupRawEntity,
  ): RuleGroupServiceResult.Item {
    return {
      id: entity.id,
      scope: entity.scope as RuleGroupScope,
      metadata: entity.metadata as RuleGroupMetadata,
      projectId: entity.projectId,
      parentGroupId: entity.parentGroupId,
      name: entity.name,
      description: entity.description,
      type: entity.type as RuleGroupType,
      orderIndex: entity.orderIndex,
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt?.toISOString() ?? null,
    }
  }
}
