export interface ResolvedRuleItem {
  id: string
  projectId: string
  ruleGroupId: string
  name: string
  body: string
  metadata: Record<string, any> | null
  path: string[]
  orderKey: string
  orderIndex: number
  createdAt: string
  updatedAt: string
}

export namespace ResolvedRulesetCmd {
  export interface Get {
    projectId: string
    organizationId: string
    includeMetadata?: boolean
  }
}

export namespace ResolvedRulesetRes {
  export interface Get {
    projectId: string
    total: number
    includeMetadata: boolean
    rules: ResolvedRuleItem[]
  }
}

export type RawRuleGroup = {
  id: string
  projectId: string
  parentGroupId: string | null
  name: string
  orderIndex: number
}

export type RawRule = {
  id: string
  projectId: string
  ruleGroupId: string
  name: string
  body: string
  metadata: Record<string, any> | null
  orderIndex: number
  createdAt: Date | string
  updatedAt: Date | string
}

export type RawRuleGroupConfig = {
  projectId: string
  ruleGroupId: string
  status: 'active' | 'hidden'
}

export type RawRuleConfig = {
  projectId: string
  ruleId: string
  status: 'active' | 'hidden'
}

export type RuleGroupNode = RawRuleGroup & {
  children: RuleGroupNode[]
  rules: RawRule[]
}

export interface ResolvedRulesetRawData {
  project: { id: string } | null
  ruleGroups: RawRuleGroup[]
  rules: RawRule[]
  ruleGroupConfigs: RawRuleGroupConfig[]
  ruleConfigs: RawRuleConfig[]
}
