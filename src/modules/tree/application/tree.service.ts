import { Injectable } from '@nestjs/common'
import { InferSelectModel } from 'drizzle-orm'
import { DrizzleService } from '~/infra/drizzle/drizzle.service'
import { ruleGroupsTable, rules } from '~/infra/drizzle/schemas'
import { requireProjectAccess } from '~/modules/auth/auth.utils'
import { TreeServicePort } from '~/modules/tree/ports/tree.service.port'

type RuleGroupRow = InferSelectModel<typeof ruleGroupsTable>
type RuleRow = InferSelectModel<typeof rules>

export interface RuleGroupNode {
  group: RuleGroupRow
  rules: RuleRow[]
  children: RuleGroupNode[]
}

@Injectable()
export class TreeService implements TreeServicePort {
  constructor(private readonly drizzle: DrizzleService) {}

  buildTree(groups: RuleGroupRow[], allRules: RuleRow[]): RuleGroupNode[] {
    const rulesByGroup = new Map<string, RuleRow[]>()
    for (const rule of allRules) {
      const existing = rulesByGroup.get(rule.ruleGroupId) ?? []
      existing.push(rule)
      rulesByGroup.set(rule.ruleGroupId, existing)
    }

    const childrenByParent = new Map<string | null, RuleGroupRow[]>()
    for (const group of groups) {
      const key = group.parentGroupId
      const existing = childrenByParent.get(key) ?? []
      existing.push(group)
      childrenByParent.set(key, existing)
    }

    const byOrder = (a: { orderIndex: number }, b: { orderIndex: number }) =>
      a.orderIndex - b.orderIndex

    function buildNode(group: RuleGroupRow): RuleGroupNode {
      const groupRules = (rulesByGroup.get(group.id) ?? []).sort(byOrder)
      const childGroups = (childrenByParent.get(group.id) ?? []).sort(byOrder)

      return {
        group,
        rules: groupRules,
        children: childGroups.map(buildNode),
      }
    }

    const roots = (childrenByParent.get(null) ?? []).sort(byOrder)
    return roots.map(buildNode)
  }

  async getProjectTree(activeOrganizationId: string, projectId: string) {
    await requireProjectAccess(activeOrganizationId, projectId, this.drizzle)

    // const groups = await this.drizzle.db.query.ruleGroups.findMany({
    //   where: and(eq(ruleGroupsTable.projectId, projectId), isNull(ruleGroupsTable.deletedAt)),
    // })

    const groups = []
    // const allRules = await this.drizzle.db.query.rules.findMany({
    //   where: and(eq(rules.projectId, projectId), isNull(rules.deletedAt)),
    // })
    const allRules = []

    const tree = this.buildTree(groups, allRules)

    return tree
  }
}
