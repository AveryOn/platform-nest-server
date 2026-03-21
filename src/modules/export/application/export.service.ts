import { Inject, Injectable } from '@nestjs/common'
import { ExportServicePort } from '~/modules/export/ports/export.service.port'
import { RuleGroupNode } from '~/modules/tree/application/tree.types'
import { ResolvedRule } from './export.types'
import { DrizzleService } from '~/infra/drizzle/drizzle.service'
import { requireProjectAccess } from '~/modules/auth/auth.utils'
import { ruleGroups, rules } from '~/infra/drizzle/schemas'
import { and, eq, isNull } from 'drizzle-orm'
import { TREE_PORT } from '~/modules/tree/ports/tree.service.port'
import { TreeService } from '~/modules/tree/application/tree.service'

@Injectable()
export class ExportService implements ExportServicePort {
  constructor(
    private readonly drizzle: DrizzleService,

    @Inject(TREE_PORT)
    private readonly treeService: TreeService,
  ) {}

  private resolveRuleset(tree: RuleGroupNode[]): ResolvedRule[] {
    const resolved: ResolvedRule[] = []
    let globalOrder = 0

    function walk(node: RuleGroupNode, pathSoFar: string[]) {
      if (!node.group.enabled || node.group.deletedAt != null) return

      const currentPath = [...pathSoFar, node.group.name]

      for (const rule of node.rules) {
        if (!rule.enabled || rule.deletedAt != null) continue

        resolved.push({
          id: rule.id,
          title: rule.title,
          body: rule.body,
          path: currentPath,
          groupKind: node.group.kind,
          metadata: node.group.metadata,
          tags: (rule.metadata as { tags?: string[] } | null)?.tags ?? [],
          orderGlobal: globalOrder++,
        })
      }

      for (const child of node.children) {
        walk(child, currentPath)
      }
    }

    for (const root of tree) {
      walk(root, [])
    }

    return resolved
  }

  async exportProjectRuleset(activeOrganizationId: string, projectId: string) {
    await requireProjectAccess(activeOrganizationId, projectId, this.drizzle)

    const groups = await this.drizzle.db.query.ruleGroups.findMany({
      where: and(
        eq(ruleGroups.projectId, projectId),
        isNull(ruleGroups.deletedAt),
      ),
    })

    const allRules = await this.drizzle.db.query.rules.findMany({
      where: and(eq(rules.projectId, projectId), isNull(rules.deletedAt)),
    })

    const tree = this.treeService.buildTree(groups, allRules)
    const resolved = this.resolveRuleset(tree)

    return resolved
  }
}
