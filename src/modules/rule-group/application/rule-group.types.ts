export interface RuleGroup {
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
