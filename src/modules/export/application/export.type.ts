export interface ExportEntity {
  projectId: string
  format: ExportFormat
  content: string | object
  snapshotId?: string
  snapshotVersion?: number
}

export enum ExportFormat {
  markdown = 'markdown',
  json = 'json',
}

export namespace ExportServiceCmd {
  export type Export = {
    projectId: string
    format: ExportFormat
    createSnapshot?: boolean
  }
}

export namespace ExportServiceRes {
  export type Export = ExportEntity
}
