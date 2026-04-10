export interface Rule {
  // id: string
  // projectId: string
  // groupId: string
  // title: string | null
  // body: string
  // metadata: unknown
  // orderIndex: number
  // isFromTemplate: boolean
  // templateRef: string | null
  // enabled: boolean
  // createdAt: Date
  // updatedAt: Date
  // deletedAt: Date | null
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
}

export interface CreateRuleRecord {
  groupId: string
  title?: string | null
  body: string
  metadata?: unknown
  orderIndex?: number
}

export interface UpdateRuleRecord {
  title?: string | null
  body?: string
  metadata?: unknown
  orderIndex?: number
  enabled?: boolean
  groupId?: string
}

export interface DeleteRuleRes {
  success: boolean
}

export interface ReorderInput {
  groupId: string
  orderedIds: string[]
}
