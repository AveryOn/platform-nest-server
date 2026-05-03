import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import type { Request } from 'express'
import { createHash } from 'node:crypto'
import {
  ApiKeyScope,
  ApiKeyStatus,
  type ApiKeyRawEntity,
} from '~/modules/api-key/application/api-key.type'
import { API_KEY_SCOPES_META } from '~/modules/api-key/infra/auth/api-key-scopes.decorator'
import {
  API_KEY_REPO_PORT,
  type ApiKeyRepoPort,
} from '~/modules/api-key/ports/api-key.repo.port'
import {
  PROJECT_REPO_PORT,
  type ProjectRepoPort,
} from '~/modules/project/ports/project.repo.port'

@Injectable()
export class ApiKeyAuthGuard implements CanActivate {
  constructor(
    @Inject(API_KEY_REPO_PORT)
    private readonly apiKeyRepo: ApiKeyRepoPort,

    @Inject(PROJECT_REPO_PORT)
    private readonly projectRepo: ProjectRepoPort,

    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>()
    const rawKey = this.extractApiKey(request)

    if (!rawKey) {
      throw new UnauthorizedException('API key is missing')
    }

    const keyHash = this.hashApiKey(rawKey)
    const keyPrefix = this.getApiKeyPrefix(rawKey)

    const apiKey = await this.apiKeyRepo.findByHash({
      keyHash,
      keyPrefix,
    })

    if (!apiKey) {
      throw new UnauthorizedException('Invalid API key')
    }

    this.assertApiKeyIsUsable(apiKey)

    const requiredScopes =
      this.reflector.getAllAndOverride<ApiKeyScope[]>(
        API_KEY_SCOPES_META,
        [context.getHandler(), context.getClass()],
      ) ?? []

    this.assertScopes(apiKey, requiredScopes)

    await this.assertProjectAccessIfNeeded(request, apiKey)

    await this.apiKeyRepo.markUsed({
      apiKeyId: apiKey.id,
      ip: request.ip ?? null,
      userAgent: request.headers['user-agent'] ?? null,
    })

    request.apiKey = {
      id: apiKey.id,
      brandId: apiKey.brandId,
      projectId: apiKey.projectId,
      organizationId: apiKey.organizationId,
      scopes: apiKey.scopes,
    }

    request.activeOrganizationId = apiKey.organizationId

    return true
  }

  private extractApiKey(request: Request): string | null {
    const xApiKey = request.headers['x-api-key']

    if (typeof xApiKey === 'string' && xApiKey.trim()) {
      return xApiKey.trim()
    }

    const authorization = request.headers.authorization

    if (!authorization) {
      return null
    }

    const [scheme, token] = authorization.split(' ')

    if (scheme !== 'Bearer' || !token) {
      return null
    }

    return token.trim()
  }

  private hashApiKey(key: string): string {
    return createHash('sha256').update(key).digest('hex')
  }

  private getApiKeyPrefix(key: string): string {
    return key.slice(0, 24)
  }

  private assertApiKeyIsUsable(apiKey: ApiKeyRawEntity): void {
    if ((apiKey.status as ApiKeyStatus) !== ApiKeyStatus.Active) {
      throw new UnauthorizedException('API key is revoked')
    }

    if (apiKey.expiresAt && apiKey.expiresAt <= new Date()) {
      throw new UnauthorizedException('API key is expired')
    }
  }

  private assertScopes(
    apiKey: ApiKeyRawEntity,
    requiredScopes: ApiKeyScope[],
  ): void {
    if (requiredScopes.length === 0) {
      return
    }

    const ownedScopes = new Set(apiKey.scopes)

    for (const scope of requiredScopes) {
      if (!ownedScopes.has(scope)) {
        throw new ForbiddenException('API key scope is not allowed')
      }
    }
  }

  private async assertProjectAccessIfNeeded(
    request: Request,
    apiKey: ApiKeyRawEntity,
  ): Promise<void> {
    const projectId = request.params?.projectId as string

    if (!projectId) {
      return
    }

    if (apiKey.projectId && apiKey.projectId !== projectId) {
      throw new ForbiddenException(
        'API key does not have access to this project',
      )
    }

    await this.projectRepo.findProjectOrFail({
      projectId,
      brandId: apiKey.brandId,
      organizationId: apiKey.organizationId,
    })
  }
}
