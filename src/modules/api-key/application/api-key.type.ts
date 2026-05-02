import type { PaginatedResponse } from '~/shared/paginator/infra/http/paginator.dto'

export enum ApiKeyMode {
  ReadOnly = 'READ_ONLY',
  Writable = 'WRITABLE',
}

export enum ApiKeyStatus {
  Active = 'ACTIVE',
  Revoked = 'REVOKED',
}

export enum ApiKeyScope {
  ProjectRead = 'project:read',
  RulesetRead = 'ruleset:read',
  SnapshotRead = 'snapshot:read',
  SnapshotPayloadRead = 'snapshot:payload:read',
  RuleRead = 'rule:read',
  RuleGroupRead = 'rule_group:read',
  TemplateRead = 'template:read',
  ExportRead = 'export:read',
}

export const DEFAULT_API_KEY_SCOPES = [
  ApiKeyScope.ProjectRead,
  ApiKeyScope.RulesetRead,
  ApiKeyScope.SnapshotRead,
  ApiKeyScope.SnapshotPayloadRead,
  ApiKeyScope.ExportRead,
]

export interface ApiKeyEntity {
  id: string
  name: string
  keyPrefix: string
  brandId: string
  projectId?: string | null
  organizationId: string
  createdByUserId: string
  mode: ApiKeyMode
  scopes: ApiKeyScope[]
  status: ApiKeyStatus
  createdAt: string
  lastUsedAt?: string | null
  expiresAt?: string | null
  revokedAt?: string | null
}

export interface ApiKeyRawEntity {
  id: string
  brandId: string
  createdByUserId: string
  organizationId: string
  projectId: string | null
  name: string
  keyHash: string
  keyPrefix: string
  scopes: ApiKeyScope[]
  status: 'ACTIVE' | 'REVOKED'
  lastUsedIp: string | null
  lastUsedUa: string | null
  lastUsedAt: Date | null
  expiresAt: Date | null
  revokedAt: Date | null
  createdAt: Date
}

export namespace ApiKeyServiceCmd {
  export type Create = {
    name: string
    brandId: string
    organizationId: string
    createdByUserId: string
    projectId?: string | null
    expiresAt?: string
  }

  export type GetList = {
    organizationId: string
    userId: string
    limit: number
    page: number
    brandId?: string
    projectId?: string
    status?: ApiKeyStatus
  }

  export type GetById = {
    apiKeyId: string
    organizationId: string
    userId: string
  }

  export type Revoke = {
    apiKeyId: string
    organizationId: string
    userId: string
  }
}

export namespace ApiKeyServiceRes {
  export type Create = ApiKeyEntity & {
    key: string
  }

  export type GetList = PaginatedResponse<ApiKeyEntity>
  export type GetById = ApiKeyEntity
  export type Revoke = ApiKeyEntity
}

export namespace ApiKeyRepoCmd {
  export type Create = {
    name: string
    brandId: string
    projectId?: string | null
    organizationId: string
    createdByUserId: string
    keyHash: string
    keyPrefix: string
    scopes: ApiKeyScope[]
    expiresAt?: Date | null
  }

  export type GetList = {
    organizationId: string
    limit: number
    page: number
    brandId?: string
    projectId?: string
    status?: ApiKeyStatus
  }

  export type GetById = {
    apiKeyId: string
    organizationId: string
  }

  export type FindByName = {
    name: string
    organizationId: string
  }

  export type Revoke = {
    apiKeyId: string
    organizationId: string
  }
  export type FindByHash = {
    keyHash: string
    keyPrefix: string
  }

  export type MarkUsed = {
    apiKeyId: string
    ip?: string | null
    userAgent?: string | null
  }
}

export namespace ApiKeyRepoRes {
  export type Create = ApiKeyRawEntity
  export type GetList = PaginatedResponse<ApiKeyRawEntity>
  export type GetById = ApiKeyRawEntity | null
  export type FindByName = ApiKeyRawEntity | null
  export type Revoke = ApiKeyRawEntity | null
  export type FindByHash = ApiKeyRawEntity | null
}
