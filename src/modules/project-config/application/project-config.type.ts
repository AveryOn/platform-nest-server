export enum ProjectConfigStatus {
  active = 'active',
  hidden = 'hidden',
}

export namespace ProjectConfigReqCmd {
  export interface updateRuleGroupConfig {
    projectId: string
    groupId: string
    isActive: boolean
  }

  export interface updateRuleConfig {
    projectId: string
    ruleId: string
    isActive: boolean
  }
}

export namespace ProjectConfigRes {
  export interface updateRuleGroupConfig {
    projectId: string
    ruleGroupId: string
    isHidden: boolean
    isActive: boolean
    status: ProjectConfigStatus
    updatedAt: string | null
  }
  export interface updateRuleConfig {
    projectId: string
    ruleId: string
    isHidden: boolean
    isActive: boolean
    status: ProjectConfigStatus
    updatedAt: string | null
  }
}

export namespace ProjectConfigRepoCmd {}
export namespace ProjectConfigRepoRes {}
