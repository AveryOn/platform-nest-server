export interface ProjectSnapshotEntity {
  id: string
  projectId: string
  version: number
  hash: string
  createdAt: string
}

export namespace ProjectSnapshotReqCmd {
  export interface GetList {
    projectId: string
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
    reason?: string
  }
}

export namespace ProjectSnapshotRes {
  export type GetList = ProjectSnapshotEntity[]
  export type GetById = ProjectSnapshotEntity
  export type GetByVersion = ProjectSnapshotEntity
  export interface GetPayload {
    snapshotId: string
    projectId: string
    version: number
    payload: {
      rules: {
        id: string
        name: string
        body: string
        path: string[]
        orderKey: string
      }[]
    }
  }
  export interface GetStatus {
    projectId: string
    hasSnapshots: boolean
    isOutdated: boolean
    latestSnapshotId: string
    latestVersion: number
    lastCreatedAt: string
  }
  export type Create = ProjectSnapshotEntity
}
