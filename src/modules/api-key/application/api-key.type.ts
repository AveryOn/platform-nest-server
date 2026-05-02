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
  scopes: string
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

export namespace ApiKeyRepoCmd {}

export namespace ApiKeyRepoRes {}
