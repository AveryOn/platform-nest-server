import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import type {
  RawRule,
  RawRuleGroup,
  RawRuleGroupConfig,
  ResolvedRuleItem,
  ResolvedRulesetCmd,
  ResolvedRulesetRes,
  RuleGroupNode,
} from '~/modules/resolved-ruleset/application/resolved-ruleset.type'
import {
  RESOLVED_RULESET_REPO_PORT,
  type ResolvedRulesetRepoPort,
} from '~/modules/resolved-ruleset/ports/resolved-ruleset.repo.port'
import type { ResolvedRulesetServicePort } from '~/modules/resolved-ruleset/ports/resolved-ruleset.service.port'

@Injectable()
export class ResolvedRulesetService implements ResolvedRulesetServicePort {
  constructor(
    @Inject(RESOLVED_RULESET_REPO_PORT)
    private readonly resolvedRulesetRepo: ResolvedRulesetRepoPort,
  ) {}

  async getResolvedRuleset(
    cmd: ResolvedRulesetCmd.Get,
  ): Promise<ResolvedRulesetRes.Get> {
    const { projectId, includeMetadata = true } = cmd

    const raw =
      await this.resolvedRulesetRepo.getProjectResolvedRulesetData(
        projectId,
      )

    if (!raw.project) {
      throw new NotFoundException('Project not found')
    }

    const hiddenGroupIds = this.resolveHiddenGroupIds(
      raw.ruleGroups,
      raw.ruleGroupConfigs,
    )

    const hiddenRuleIds = new Set(
      raw.ruleConfigs
        .filter((config) => config.status === 'hidden')
        .map((config) => config.ruleId),
    )

    const visibleGroups = raw.ruleGroups.filter(
      (group) => !hiddenGroupIds.has(group.id),
    )

    const visibleRules = raw.rules.filter(
      (rule) =>
        !hiddenRuleIds.has(rule.id) &&
        !hiddenGroupIds.has(rule.ruleGroupId),
    )

    const tree = this.buildTree(visibleGroups, visibleRules)

    const rules: ResolvedRuleItem[] = []

    for (const rootNode of tree) {
      this.traverseNode({
        node: rootNode,
        path: [],
        orderPath: [],
        includeMetadata,
        output: rules,
      })
    }

    return {
      projectId,
      total: rules.length,
      includeMetadata,
      rules: rules.map((rule, index) => ({
        ...rule,
        orderIndex: index,
      })),
    }
  }

  private resolveHiddenGroupIds(
    groups: RawRuleGroup[],
    configs: RawRuleGroupConfig[],
  ): Set<string> {
    const directlyHiddenGroupIds = new Set(
      configs
        .filter((config) => config.status === 'hidden')
        .map((config) => config.ruleGroupId),
    )

    const groupsByParentId = new Map<string | null, RawRuleGroup[]>()

    for (const group of groups) {
      const siblings = groupsByParentId.get(group.parentGroupId) ?? []

      siblings.push(group)

      groupsByParentId.set(group.parentGroupId, siblings)
    }

    const hiddenGroupIds = new Set<string>()

    const markHiddenSubtree = (groupId: string): void => {
      hiddenGroupIds.add(groupId)

      const children = groupsByParentId.get(groupId) ?? []

      for (const child of children) {
        markHiddenSubtree(child.id)
      }
    }

    for (const groupId of directlyHiddenGroupIds) {
      markHiddenSubtree(groupId)
    }

    return hiddenGroupIds
  }

  private buildTree(
    groups: RawRuleGroup[],
    rules: RawRule[],
  ): RuleGroupNode[] {
    const nodesById = new Map<string, RuleGroupNode>()
    const rulesByGroupId = new Map<string, RawRule[]>()

    for (const rule of rules) {
      const groupRules = rulesByGroupId.get(rule.ruleGroupId) ?? []

      groupRules.push(rule)

      rulesByGroupId.set(rule.ruleGroupId, groupRules)
    }

    for (const group of groups) {
      nodesById.set(group.id, {
        ...group,
        children: [],
        rules: this.sortByOrder(rulesByGroupId.get(group.id) ?? []),
      })
    }

    const rootNodes: RuleGroupNode[] = []

    for (const node of nodesById.values()) {
      if (!node.parentGroupId) {
        rootNodes.push(node)
        continue
      }

      const parentNode = nodesById.get(node.parentGroupId)

      if (!parentNode) {
        rootNodes.push(node)
        continue
      }

      parentNode.children.push(node)
    }

    for (const node of nodesById.values()) {
      node.children = this.sortByOrder(node.children)
    }

    return this.sortByOrder(rootNodes)
  }

  private traverseNode(input: {
    node: RuleGroupNode
    path: string[]
    orderPath: number[]
    includeMetadata: boolean
    output: ResolvedRuleItem[]
  }): void {
    const nodePath = [...input.path, input.node.name]
    const nodeOrderPath = [...input.orderPath, input.node.orderIndex]

    for (const rule of input.node.rules) {
      const ruleOrderPath = [...nodeOrderPath, rule.orderIndex]

      input.output.push({
        id: rule.id,
        projectId: rule.projectId,
        ruleGroupId: rule.ruleGroupId,
        name: rule.name,
        body: rule.body,
        metadata: input.includeMetadata ? rule.metadata : null,
        path: nodePath,
        orderKey: this.buildOrderKey(ruleOrderPath),
        orderIndex: input.output.length,
        createdAt: this.toIsoString(rule.createdAt),
        updatedAt: this.toIsoString(rule.updatedAt),
      })
    }

    for (const childNode of input.node.children) {
      this.traverseNode({
        node: childNode,
        path: nodePath,
        orderPath: nodeOrderPath,
        includeMetadata: input.includeMetadata,
        output: input.output,
      })
    }
  }

  private sortByOrder<T extends { orderIndex: number }>(items: T[]): T[] {
    return [...items].sort(
      (left, right) => left.orderIndex - right.orderIndex,
    )
  }

  private buildOrderKey(orderPath: number[]): string {
    return orderPath
      .map((orderIndex) => String(orderIndex).padStart(4, '0'))
      .join('.')
  }

  private toIsoString(value: Date | string): string {
    return value instanceof Date ? value.toISOString() : value
  }
}
