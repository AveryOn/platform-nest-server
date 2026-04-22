export enum RuleGroupType {
  category = 'category',
  token = 'token',
  section = 'section',
  component = 'component',
  variant = 'variant',
}
export type RuleGroupTypeKey = keyof typeof RuleGroupType

export type RuleGroupEntity = {
  id: string
  projectId: string
  parentGroupId: string | null
  name: string
  description: string | null
  type: RuleGroupType | null
  orderIndex: number
  createdAt: Date
  updatedAt: Date | null
  deletedAt: Date | null
}

export namespace RuleGroupServiceCmd {
  export type Create = {
    projectId: string
    name: string
    description?: string | null
    type?: RuleGroupType | null
    parentGroupId?: string | null
    orderIndex: number
  }

  export type GetById = {
    groupId: string
  }

  export type Patch = {
    groupId: string
    name?: string
    description?: string | null
    type?: RuleGroupType | null
  }

  export type Move = {
    groupId: string
    parentGroupId?: string | null
    orderIndex: number
  }

  export type ReorderItem = {
    id: string
    orderIndex: number
  }

  export type ReorderChildren = {
    groupId: string
    items: ReorderItem[]
  }

  export type ReorderRoot = {
    projectId: string
    items: ReorderItem[]
  }

  export type Remove = {
    groupId: string
  }
}

export namespace RuleGroupServiceResult {
  export type Item = {
    id: string
    projectId: string
    parentGroupId: string | null
    name: string
    description: string | null
    type: RuleGroupType | null
    orderIndex: number
    createdAt: string
    updatedAt: string | null
  }

  export type Update = {
    status: 'success'
    groupId: string
  }

  export type Remove = {
    status: 'success'
    groupId: string
    archivedAt: string
  }
}
