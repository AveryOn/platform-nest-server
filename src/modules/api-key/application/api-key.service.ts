import { Injectable } from '@nestjs/common'
import {
  ApiKeyMode,
  ApiKeyScope,
  ApiKeyStatus,
  type ApiKeyServiceCmd,
  type ApiKeyServiceRes,
} from '~/modules/api-key/application/api-key.type'
import { type ApiKeyServicePort } from '~/modules/api-key/ports/api-key.service.port'
import { SWAGGER_EXAMPLES } from '~/shared/const/swagger.const'

@Injectable()
export class ApiKeyService implements ApiKeyServicePort {
  async create(
    cmd: ApiKeyServiceCmd.Create,
  ): Promise<ApiKeyServiceRes.Create> {
    return await Promise.resolve({
      brandId: 'abc123',
      createdAt: new Date().toString(),
      createdByUserId: 'user123',
      id: SWAGGER_EXAMPLES.uuid,
      key: SWAGGER_EXAMPLES.hash,
      keyPrefix: 'example_prefix',
      mode: ApiKeyMode.ReadOnly,
      name: 'example',
      organizationId: 'org_123',
      scopes: [ApiKeyScope.ExportRead, ApiKeyScope.RuleGroupRead],
      status: ApiKeyStatus.Active,
      expiresAt: new Date().toString(),
      lastUsedAt: null,
      revokedAt: null,
      projectId: SWAGGER_EXAMPLES.uuid,
    })
  }

  async getList(
    cmd: ApiKeyServiceCmd.GetList,
  ): Promise<ApiKeyServiceRes.GetList> {
    return await Promise.resolve({
      data: [],
      paginator: {
        limit: 1,
        page: 1,
        total: 1,
        totalPages: 1,
      },
    })
  }

  async getById(
    cmd: ApiKeyServiceCmd.GetById,
  ): Promise<ApiKeyServiceRes.GetById> {
    return await Promise.resolve({
      brandId: 'abc123',
      createdAt: new Date().toString(),
      createdByUserId: 'user123',
      id: SWAGGER_EXAMPLES.uuid,
      key: SWAGGER_EXAMPLES.hash,
      keyPrefix: 'example_prefix',
      mode: ApiKeyMode.ReadOnly,
      name: 'example',
      organizationId: 'org_123',
      scopes: [ApiKeyScope.ExportRead, ApiKeyScope.RuleGroupRead],
      status: ApiKeyStatus.Active,
      expiresAt: new Date().toString(),
      lastUsedAt: null,
      revokedAt: null,
      projectId: SWAGGER_EXAMPLES.uuid,
    })
  }

  async revoke(
    cmd: ApiKeyServiceCmd.Revoke,
  ): Promise<ApiKeyServiceRes.Revoke> {
    return await Promise.resolve({
      brandId: 'abc123',
      createdAt: new Date().toString(),
      createdByUserId: 'user123',
      id: SWAGGER_EXAMPLES.uuid,
      key: SWAGGER_EXAMPLES.hash,
      keyPrefix: 'example_prefix',
      mode: ApiKeyMode.ReadOnly,
      name: 'example',
      organizationId: 'org_123',
      scopes: [ApiKeyScope.ExportRead, ApiKeyScope.RuleGroupRead],
      status: ApiKeyStatus.Revoked,
      expiresAt: new Date().toString(),
      lastUsedAt: new Date().toString(),
      revokedAt: new Date().toString(),
      projectId: SWAGGER_EXAMPLES.uuid,
    })
  }
}
