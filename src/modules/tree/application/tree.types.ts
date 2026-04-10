import type { RuleGroupKind } from '~/modules/rule-group/infra/http/rule-group.dto'

export interface RuleGroupNode {
  group: {
    id: string
    projectId: string | null
    name: string
    description: string | null
    orderIndex: number
    parentGroupId: string | null
    metadata: unknown
    scope: string
    type: RuleGroupKind | null
    createdAt: string | Date
    updatedAt: string | Date | null
    deletedAt: string | Date | null
  }
  rules: Array<{
    id: string
    name: string
    createdAt: Date
    updatedAt: Date | null
    metadata: unknown
    description: string | null
    deletedAt: Date | null
    orderIndex: number
    ruleGroupId: string
    body: unknown
  }>
  children: RuleGroupNode[]
}

export type GetProjectTreeOutput = RuleGroupNode[]
