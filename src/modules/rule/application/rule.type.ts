export type RuleMetadata = Record<string, any> | null

export type RuleEntity = {
  id: string
  ruleGroupId: string
  title: string | null
  body: string
  metadata: RuleMetadata
  orderIndex: number
  createdAt: Date
  updatedAt: Date | null
  deletedAt: Date | null
}

export namespace RuleServiceCmd {
  export type Create = {
    ruleGroupId: string
    title?: string | null
    body: string
    metadata?: RuleMetadata
    orderIndex: number
  }

  export type GetById = {
    ruleId: string
  }

  export type Patch = {
    ruleId: string
    title?: string | null
    body?: string
    metadata?: RuleMetadata
  }

  export type Move = {
    ruleId: string
    targetGroupId: string
    orderIndex: number
  }

  export type ReorderItem = {
    id: string
    orderIndex: number
  }

  export type ReorderInGroup = {
    groupId: string
    items: ReorderItem[]
  }

  export type Remove = {
    ruleId: string
  }
}

export namespace RuleServiceRes {
  export type Item = {
    id: string
    ruleGroupId: string
    title: string
    body: string
    metadata: RuleMetadata
    orderIndex: number
    createdAt: string
    updatedAt: string | null
  }

  export type Update = {
    status: 'success'
    ruleId: string
  }

  export type Remove = {
    status: 'success'
    ruleId: string
    archivedAt: string
  }
}
