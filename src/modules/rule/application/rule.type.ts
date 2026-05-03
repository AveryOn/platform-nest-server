import type { OperationStatus } from '~/shared/const/app.const'

export type RuleMetadata = Record<string, unknown> | null

export enum RuleScope {
  project = 'project',
  template = 'template',
}

export type RuleEntity = {
  id: string
  ruleGroupId: string
  name: string
  scope: RuleScope
  body: string
  projectId: string | null
  metadata: RuleMetadata
  orderIndex: number
  createdAt: Date
  updatedAt: Date | null
  deletedAt: Date | null
}

export namespace RuleServiceCmd {
  export type Create = {
    organizationId: string
    ruleGroupId: string
    name: string
    body: string
    metadata?: RuleMetadata
    orderIndex: number
  }

  export type GetById = {
    organizationId: string
    ruleId: string
  }

  export type Patch = {
    organizationId: string
    ruleId: string
    name?: string
    body?: string
    metadata?: RuleMetadata
  }

  export type Move = {
    organizationId: string
    ruleId: string
    targetGroupId: string
    orderIndex: number
  }

  export type ReorderItem = {
    id: string
    orderIndex: number
  }

  export type ReorderInGroup = {
    organizationId: string
    groupId: string
    items: ReorderItem[]
  }

  export type Delete = {
    organizationId: string
    ruleId: string
  }
}

export namespace RuleServiceRes {
  export type Item = {
    id: string
    ruleGroupId: string
    projectId: string | null
    scope: RuleScope
    name: string
    body: string
    metadata: RuleMetadata
    orderIndex: number
    createdAt: string
    updatedAt: string | null
  }

  export type Update = {
    status: OperationStatus
    ruleId: string
  }

  export type Move = {
    status: OperationStatus
    ruleId: string
    affectedIds: string[]
  }

  export type ReorderInGroup = {
    status: OperationStatus
    groupId: string
    affectedIds: string[]
  }

  export type Delete = {
    status: OperationStatus
    ruleId: string
    deletedAt: string
  }
}
