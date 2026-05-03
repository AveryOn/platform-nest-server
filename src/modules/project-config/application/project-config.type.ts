export enum ProjectConfigStatus {
  active = 'active',
  hidden = 'hidden',
}

/** Entity type that is returned to the client */
export interface ProjectConfigEntity {
  projectId: string
  ruleGroupId: string
  isActive: boolean
  status: ProjectConfigStatus
  updatedAt: string | null
}

export namespace ProjectConfigReqCmd {
  export interface updateRuleGroupConfig {
    organizationId: string
    projectId: string
    groupId: string
    isActive: boolean
  }

  export interface updateRuleConfig {
    organizationId: string
    projectId: string
    ruleId: string
    isActive: boolean
  }
}

export namespace ProjectConfigRes {
  export type updateRuleGroupConfig = ProjectConfigEntity
  export type updateRuleConfig = {
    projectId: string
    isActive: boolean
    ruleId: string
    status: ProjectConfigStatus
    updatedAt: string | null
  }
}

export namespace ProjectConfigRepoCmd {
  export interface getProjectById {
    projectId: string
  }

  export interface getRuleGroupInProject {
    projectId: string
    groupId: string
  }

  export interface getRuleInProject {
    projectId: string
    ruleId: string
  }

  export interface upsertRuleGroupConfig {
    projectId: string
    groupId: string
    status: ProjectConfigStatus
  }

  export interface upsertRuleConfig {
    projectId: string
    ruleId: string
    status: ProjectConfigStatus
  }
}

export namespace ProjectConfigRepoRes {
  export interface getProjectById {
    id: string
  }

  export interface getRuleGroupInProject {
    id: string
  }

  export interface getRuleInProject {
    id: string
  }

  export interface upsertRuleGroupConfig {
    projectId: string
    ruleGroupId: string
    status: ProjectConfigStatus
    updatedAt: Date | string | null
  }

  export interface upsertRuleConfig {
    projectId: string
    ruleId: string
    status: ProjectConfigStatus
    updatedAt: Date | string | null
  }
}
