import type { OperationStatus } from '~/shared/const/app.const'
import type { PaginatedResponse } from '~/shared/paginator/infra/http/paginator.dto'

/** Entity type that is returned to the client */
export interface ProjectEntity {
  id: string
  name: string
  slug: string
  description: string | null
  brandId: string | null
  organizationId: string
  templateSnapshotId: string | null
  createdAt: string
  updatedAt: string | null
  deletedAt: string | null
}

export namespace ProjectReqCmd {
  export interface GetList {
    search?: string
    includeArchived?: boolean
    brandId?: string
    page: number
    limit: number
  }
  export interface GetById {
    projectId: string
  }
  export interface Create {
    name: string
    description?: string | null
    brandId?: string | null
    templateSnapshotId?: string | null
  }
  export interface Update {
    projectId: string
    name?: string
    description?: string | null
    brandId?: string | null
    templateSnapshotId?: string | null
  }
  export interface Delete {
    projectId: string
  }
}

export namespace ProjectRes {
  export type GetList = PaginatedResponse<ProjectEntity>
  export type GetById = ProjectEntity
  export type Create = ProjectEntity
  export interface Update {
    status: keyof typeof OperationStatus
    projectId: string
  }
  export interface Delete {
    status: keyof typeof OperationStatus
    projectId: string
    archivedAt: string
  }
}

export namespace ProjectRepoCmd {
  export type GetList = unknown
  export type GetById = unknown
  export type Create = unknown
  export type Update = unknown
  export type Delete = unknown
}

export namespace ProjectRepoRes {
  export type GetList = unknown
  export type GetById = unknown
  export type Create = unknown
  export type Update = unknown
  export type Delete = unknown
}
