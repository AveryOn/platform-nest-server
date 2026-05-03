import { Inject, Injectable } from '@nestjs/common'
import { createHash, randomBytes } from 'node:crypto'
import { AppError } from '~/core/error/app-error'
import { ErrorEnum } from '~/core/error/app-error.dict'
import { LOGGER_PORT } from '~/core/logger/logger.port'
import type { AppLoggerService } from '~/core/logger/logger.service'
import type { TransactionContext } from '~/infra/transaction/application/transaction.type'
import {
  TX_PORT,
  type TransactionPort,
} from '~/infra/transaction/ports/transaction.port'
import {
  ApiKeyMode,
  ApiKeyStatus,
  DEFAULT_API_KEY_SCOPES,
  type ApiKeyEntity,
  type ApiKeyRawEntity,
  type ApiKeyServiceCmd,
  type ApiKeyServiceRes,
} from '~/modules/api-key/application/api-key.type'
import {
  API_KEY_REPO_PORT,
  type ApiKeyRepoPort,
} from '~/modules/api-key/ports/api-key.repo.port'
import { type ApiKeyServicePort } from '~/modules/api-key/ports/api-key.service.port'
import {
  BRAND_REPO_PORT,
  type BrandRepoPort,
} from '~/modules/brand/ports/brand.repo.port'
import {
  PROJECT_REPO_PORT,
  type ProjectRepoPort,
} from '~/modules/project/ports/project.repo.port'

@Injectable()
export class ApiKeyService implements ApiKeyServicePort {
  constructor(
    @Inject(API_KEY_REPO_PORT)
    private readonly apiKeyRepo: ApiKeyRepoPort,

    @Inject(BRAND_REPO_PORT)
    private readonly brandRepo: BrandRepoPort,

    @Inject(PROJECT_REPO_PORT)
    private readonly projectRepo: ProjectRepoPort,

    @Inject(TX_PORT)
    private readonly transaction: TransactionPort<TransactionContext>,

    @Inject(LOGGER_PORT)
    private readonly logger: AppLoggerService,
  ) {}

  async create(
    cmd: ApiKeyServiceCmd.Create,
  ): Promise<ApiKeyServiceRes.Create> {
    return await this.transaction.run(async (tx) => {
      await this.brandRepo.findBrandOrFail(
        {
          brandId: cmd.brandId,
          organizationId: cmd.organizationId,
        },
        tx,
      )

      if (cmd.projectId) {
        await this.projectRepo.findProjectOrFail(
          {
            projectId: cmd.projectId,
            brandId: cmd.brandId,
            organizationId: cmd.organizationId,
          },
          tx,
        )
      }

      const existingApiKey = await this.apiKeyRepo.findByName(
        {
          name: cmd.name,
          organizationId: cmd.organizationId,
        },
        tx,
      )

      if (existingApiKey) {
        throw new AppError(ErrorEnum.CONFLICT, this.logger).log(
          'API key with this name already exists',
        )
      }

      const expiresAt = cmd.expiresAt ? new Date(cmd.expiresAt) : null

      if (expiresAt && Number.isNaN(expiresAt.getTime())) {
        throw new AppError(ErrorEnum.UNPROCESSABLE, this.logger).log(
          'Invalid API key expiration date',
        )
      }

      if (expiresAt && expiresAt <= new Date()) {
        throw new AppError(ErrorEnum.UNPROCESSABLE, this.logger).log(
          'API key expiration date must be in the future',
        )
      }

      const key = this.generateApiKey()
      const keyHash = this.hashApiKey(key)
      const keyPrefix = this.getApiKeyPrefix(key)

      const apiKey = await this.apiKeyRepo.create(
        {
          name: cmd.name,
          brandId: cmd.brandId,
          projectId: cmd.projectId ?? null,
          organizationId: cmd.organizationId,
          createdByUserId: cmd.createdByUserId,
          keyHash,
          keyPrefix,
          scopes: DEFAULT_API_KEY_SCOPES,
          expiresAt,
        },
        tx,
      )

      return {
        ...this.toEntity(apiKey),
        key,
      }
    })
  }

  async getList(
    cmd: ApiKeyServiceCmd.GetList,
  ): Promise<ApiKeyServiceRes.GetList> {
    return await this.transaction.run(async (tx) => {
      const result = await this.apiKeyRepo.getList(
        {
          limit: cmd.limit,
          page: cmd.page,
          status: cmd.status,
          brandId: cmd.brandId,
          projectId: cmd.projectId,
          organizationId: cmd.organizationId,
        },
        tx,
      )

      return {
        data: result.data.map((item) => this.toEntity(item)),
        paginator: result.paginator,
      }
    })
  }

  async getById(
    cmd: ApiKeyServiceCmd.GetById,
  ): Promise<ApiKeyServiceRes.GetById> {
    const apiKey = await this.apiKeyRepo.getById({
      apiKeyId: cmd.apiKeyId,
      organizationId: cmd.organizationId,
    })
    if (!apiKey) {
      throw new AppError(ErrorEnum.CONFLICT, this.logger).log(
        'API key not found',
      )
    }

    return this.toEntity(apiKey)
  }

  async revoke(
    cmd: ApiKeyServiceCmd.Revoke,
  ): Promise<ApiKeyServiceRes.Revoke> {
    return await this.transaction.run(async (tx) => {
      const existingApiKey = await this.apiKeyRepo.getById(
        {
          apiKeyId: cmd.apiKeyId,
          organizationId: cmd.organizationId,
        },
        tx,
      )

      if (!existingApiKey) {
        throw new AppError(ErrorEnum.SOURCE_NOT_FOUND, this.logger).log(
          'API key not found',
        )
      }

      if (
        (existingApiKey.status as ApiKeyStatus) === ApiKeyStatus.Revoked
      ) {
        throw new AppError(ErrorEnum.CONFLICT, this.logger).log(
          'API key is already revoked',
        )
      }

      const apiKey = await this.apiKeyRepo.revoke(
        {
          apiKeyId: cmd.apiKeyId,
          organizationId: cmd.organizationId,
        },
        tx,
      )

      if (!apiKey) {
        throw new AppError(ErrorEnum.SOURCE_NOT_FOUND, this.logger).log(
          'API key not found',
        )
      }

      return this.toEntity(apiKey)
    })
  }

  private generateApiKey(): string {
    return `uir_sk_live_${randomBytes(32).toString('base64url')}`
  }

  private hashApiKey(key: string): string {
    return createHash('sha256').update(key).digest('hex')
  }

  private getApiKeyPrefix(key: string): string {
    return key.slice(0, 24)
  }

  private toEntity(raw: ApiKeyRawEntity): ApiKeyEntity {
    return {
      id: raw.id,
      name: raw.name,
      keyPrefix: raw.keyPrefix,
      brandId: raw.brandId,
      projectId: raw.projectId,
      organizationId: raw.organizationId,
      createdByUserId: raw.createdByUserId,
      mode: ApiKeyMode.ReadOnly,
      scopes: raw.scopes,
      status: raw.status as ApiKeyStatus,
      createdAt: raw.createdAt.toISOString(),
      lastUsedAt: raw.lastUsedAt?.toISOString() ?? null,
      expiresAt: raw.expiresAt?.toISOString() ?? null,
      revokedAt: raw.revokedAt?.toISOString() ?? null,
    }
  }
}
