import type { OperationStatus } from '~/shared/const/app.const'

export enum RuleGroupScope {
  project = 'project',
  template = 'template',
}
export enum RuleGroupType {
  category = 'category',
  component = 'component',
  section = 'section',
  token = 'token',
  variant = 'variant',
}

export type RuleGroupMetadata = Record<string, unknown> | null

export type RuleGroupEntity = {
  id: string
  projectId: string | null
  parentGroupId: string | null
  name: string
  scope: RuleGroupScope
  description: string | null
  metadata?: RuleGroupMetadata
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
    metadata?: RuleGroupMetadata
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
    metadata?: RuleGroupMetadata
    description?: string | null
    type?: RuleGroupType | null
  }

  export type Move = {
    groupId: string
    parentGroupId: string | null
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

  export type Delete = {
    groupId: string
  }
}

export namespace RuleGroupServiceResult {
  export type Item = {
    id: string
    projectId: string | null
    parentGroupId: string | null
    scope: RuleGroupScope
    metadata?: RuleGroupMetadata
    name: string
    description: string | null
    type: RuleGroupType | null
    orderIndex: number
    createdAt: string
    updatedAt: string | null
  }

  export type Update = {
    status: OperationStatus
    groupId: string
  }

  export type Delete = {
    status: OperationStatus
    groupId: string
    deletedAt: string
  }

  export type Move = {
    status: OperationStatus
    groupId: string
    affectedIds: string[]
  }

  export type ReorderChildren = {
    status: OperationStatus
    groupId: string
    affectedIds: string[]
  }

  export type ReorderRoot = {
    status: OperationStatus
    projectId: string
    affectedIds: string[]
  }
}
