export interface RuleGroupNode {
  group: {
    id: string
    projectId: string
    parentGroupId: string | null
    name: string
    description: string | null
    kind: string
    metadata: unknown
    orderIndex: number
    isFromTemplate: boolean
    templateRef: string | null
    enabled: boolean
    createdAt: Date
    updatedAt: Date
    deletedAt: Date | null
  }
  rules: Array<{
    id: string
    projectId: string
    groupId: string
    title: string | null
    body: string
    metadata: unknown
    orderIndex: number
    isFromTemplate: boolean
    templateRef: string | null
    enabled: boolean
    createdAt: Date
    updatedAt: Date
    deletedAt: Date | null
  }>
  children: RuleGroupNode[]
}

export type GetProjectTreeOutput = RuleGroupNode[]
