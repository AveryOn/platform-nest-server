import { type projectsTable } from '~/infra/drizzle/schemas'

export type ProjectEntityDB = typeof projectsTable.$inferSelect

export namespace ProjectReqCmd {
  export interface GetList {
    search?: string
    includeArchived?: boolean
    brandId?: string
    page: number
    limit: number
  }
  export interface GetById {}
  export interface Create {}
  export interface Update {}
  export interface Delete {}
}

export namespace ProjectRes {
  export interface GetList {}
  export interface GetById {}
  export interface Create {}
  export interface Update {}
  export interface Delete {}
}
