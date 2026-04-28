import type { PaginatedOutput } from '~/shared/paginator/application/paginator.types'

export interface TemplateEntity {
  id: string
  slug: string
  name: string
  description: string | null
  createdAt: string
  updatedAt: string | null
}

export interface TemplateSnapshotEntity {
  id: string
  templateId: string
  version: number
  hash: string
  createdAt: string
}

export namespace TemplateReqCmd {
  export interface getList {
    limit: number
    page: number
  }

  export interface getSnapshotList {
    limit: number
    page: number
    templateId: string
  }

  export interface getById {
    templateId: string
  }
}

export namespace TemplateRes {
  export type getList = PaginatedOutput<TemplateEntity>
  export type getSnapshotList = PaginatedOutput<TemplateSnapshotEntity>
  export type getById = TemplateEntity
}

export namespace TemplateRepoCmd {
  export interface getList {
    limit: number
    page: number
  }

  export interface getSnapshotList {
    limit: number
    page: number
    templateId: string
  }

  export interface getById {
    templateId: string
  }
}

export namespace TemplateRepoRes {
  export interface template {
    id: string
    slug: string
    name: string
    description: string | null
    createdAt: Date | string
    updatedAt: Date | string | null
  }

  export interface snapshot {
    id: string
    templateId: string
    version: number
    hash: string
    createdAt: Date | string
  }

  export type getList = PaginatedOutput<template>
  export type getSnapshotList = PaginatedOutput<snapshot>
  export type getById = template | null
}
