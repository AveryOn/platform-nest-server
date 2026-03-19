export interface Rule {
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
}

export interface CreateRuleRecord {
  projectId: string
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
