import type { ResolvedRuleItem } from '~/modules/resolved-ruleset/application/resolved-ruleset.type'
import type { PaginatedResponse } from '~/shared/paginator/infra/http/paginator.dto'

export interface ProjectSnapshotEntity {
  id: string
  projectId: string
  comment: string | null
  version: number
  hash: string
  createdAt: string
}
export interface SnapshotPayload {
  rules: ResolvedRuleItem[]
}

export namespace ProjectSnapshotReqCmd {
  export interface GetList {
    projectId: string
    page: number
    limit: number
  }
  export interface GetById {
    projectId: string
    snapshotId: string
  }
  export interface GetByVersion {
    projectId: string
    version: number
  }
  export interface GetPayload {
    projectId: string
    snapshotId: string
  }
  export interface GetStatus {
    projectId: string
  }
  export interface Create {
    projectId: string
    skipIfUnchanged?: boolean
    comment?: string
  }
}

export namespace ProjectSnapshotRes {
  export type GetList = PaginatedResponse<ProjectSnapshotEntity>
  export type GetById = ProjectSnapshotEntity
  export type GetByVersion = ProjectSnapshotEntity
  export interface GetPayload {
    snapshotId: string
    projectId: string
    version: number
    payload: SnapshotPayload
  }
  export interface GetStatus {
    projectId: string
    hasSnapshots: boolean
    isOutdated: boolean
    latestSnapshotId: string | null
    latestVersion: number | null
    lastCreatedAt: string | null
  }
  export type Create = ProjectSnapshotEntity
}

// REPO TYPES
export namespace SnapshotRepoCmd {
  export interface Create {
    projectId: string
    version: number
    payload: SnapshotPayload
    hash: string
    comment?: string
  }

  export interface GetList {
    projectId: string
    page: number
    limit: number
  }

  export interface GetById {
    projectId: string
    snapshotId: string
  }

  export interface GetByVersion {
    projectId: string
    version: number
  }

  export interface GetPayload {
    projectId: string
    snapshotId: string
  }

  export interface GetLatest {
    projectId: string
  }

  export interface GetNextVersion {
    projectId: string
  }
}

export namespace SnapshotPayloadBuilderCmd {
  export interface Build {
    projectId: string
  }
}
