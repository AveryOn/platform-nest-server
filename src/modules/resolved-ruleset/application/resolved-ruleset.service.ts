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

  /**
   * Main entry point for building the resolved ruleset.
   *
   * Loads raw project data from the repository and applies the full resolution pipeline:
   * - validates project existence
   * - resolves hidden groups (recursively) via project_rule_group_configs
   * - resolves hidden rules via project_rule_configs
   * - filters out hidden groups and rules
   * - builds a hierarchical tree of rule groups
   * - applies deterministic ordering
   * - traverses the tree (top-down) to produce a flat list of rules
   * - computes orderKey and orderIndex for each rule
   *
   * The result is a deterministic, ordered, flat ruleset ready for external consumption.
   */
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

  /**
   * Computes the full set of hidden rule group IDs, including all descendants.
   *
   * Steps:
   * - identifies groups explicitly marked as hidden in configs
   * - builds parent -> children adjacency map
   * - recursively marks entire subtrees as hidden
   *
   * Result:
   * A Set of group IDs that must be excluded from the resolved ruleset,
   * including all nested groups under hidden parents.
   */
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

  /**
   * Builds an in-memory tree of rule groups with attached rules.
   *
   * Steps:
   * - groups rules by rule_group_id
   * - creates node objects for each group
   * - attaches rules to their respective groups
   * - links parent/child relationships between groups
   * - sorts children and rules by their order field
   * - returns sorted root nodes
   *
   * Guarantees:
   * - each node contains only its direct children and rules
   * - ordering is applied at every level
   * - orphan groups (missing parent) are treated as root nodes
   */
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

  /**
   * Traverses the rule group tree in a top-down (DFS) manner and
   * produces a flat list of resolved rules.
   *
   * For each node:
   * - extends the semantic path using group names
   * - accumulates order path for deterministic ordering
   * - emits rules in the current group (respecting order)
   * - recursively processes child groups
   *
   * Side effects:
   * - appends resolved rule items to the output array
   * - computes orderKey and orderIndex during traversal
   *
   * This function is the core of transforming hierarchical structure
   * into a linear resolved ruleset.
   */
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

  /**
   * Sorts a collection of items by their `order` field in ascending order.
   *
   * Behavior:
   * - returns a new sorted array (does not mutate input)
   * - ensures deterministic ordering for groups and rules
   *
   * Used for:
   * - sorting root groups
   * - sorting child groups
   * - sorting rules inside groups
   */
  private sortByOrder<T extends { orderIndex: number }>(items: T[]): T[] {
    return [...items].sort(
      (left, right) => left.orderIndex - right.orderIndex,
    )
  }

  /**
   * Builds a stable, deterministic order key from an order path.
   *
   * Each segment of the path is:
   * - zero-padded to 4 digits
   * - joined using dot notation
   *
   * Example:
   * [1, 2, 3] -> "0001.0002.0003"
   *
   * Purpose:
   * - provides a consistent sortable identifier
   * - encodes hierarchical position of a rule
   * - useful for external consumers (CLI, export, debugging)
   */
  private buildOrderKey(orderPath: number[]): string {
    return orderPath
      .map((orderIndex) => String(orderIndex).padStart(4, '0'))
      .join('.')
  }

  /**
   * Normalizes a date value into an ISO-8601 string.
   *
   * Behavior:
   * - if value is a Date -> converts to ISO string
   * - if value is already a string -> returns as-is
   *
   * Ensures consistent timestamp format in resolved output.
   */

  private toIsoString(value: Date | string): string {
    return value instanceof Date ? value.toISOString() : value
  }
}
