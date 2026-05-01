export enum ExportFormat {
  markdown = 'markdown',
  json = 'json',
}

export interface ExportEntity {
  projectId: string
  format: ExportFormat
  content: string | object
  snapshotId?: string
  snapshotVersion?: number
}

export namespace ExportServiceCmd {
  export type Export = {
    projectId: string
    organizationId: string
    format: ExportFormat
    createSnapshot?: boolean
  }
}

export namespace ExportServiceRes {
  export type Export = ExportEntity
}

export namespace ExportRepoCmd {
  export type FindProjectOrFail = {
    projectId: string
    organizationId: string
  }
}

export namespace ExportRepoRes {
  export type FindProjectOrFail = {
    id: string
    organizationId: string
  }
}
