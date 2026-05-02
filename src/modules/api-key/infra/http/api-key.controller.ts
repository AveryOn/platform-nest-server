import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common'
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { ApiDataResponse } from '~/core/interceptors/json-response.interceptor'
import {
  ApiKeyItemRes,
  CreateApiKeyDto,
  CreateApiKeyRes,
  GetApiKeysQueryDto,
  RevokeApiKeyRes,
} from '~/modules/api-key/infra/http/api-key.dto'
import {
  API_KEY_SERVICE_PORT,
  type ApiKeyServicePort,
} from '~/modules/api-key/ports/api-key.service.port'
import { SessionGuard } from '~/modules/auth/infra/session.guard'
import { ApiSwaggerTag } from '~/shared/const/app.const'
import { SWAGGER_EXAMPLES } from '~/shared/const/swagger.const'
import { ApiQueries, ValidQuery } from '~/shared/decorators/query'
import type { PaginatedResponse } from '~/shared/paginator/infra/http/paginator.dto'
import { ApiPaginator } from '~/shared/paginator/infra/http/paginator.swagger.helper'

@ApiTags(ApiSwaggerTag.ApiKey)
@Controller({
  path: 'api-keys',
  version: '1',
})
export class ApiKeyController {
  constructor(
    @Inject(API_KEY_SERVICE_PORT)
    private readonly apiKeyService: ApiKeyServicePort,
  ) {}
  // #endregion------------------------------------------
  // [POST] | CREATE API KEY
  // #region POST---------------------------------------
  @Post()
  @UseGuards(SessionGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create API key',
    description:
      'Creates a new API key for CLI/MCP access. The raw key is returned only once in this response.',
    operationId: 'create_api_key',
    tags: [ApiSwaggerTag.ApiKey],
  })
  @ApiBody({
    type: CreateApiKeyDto,
    description: 'Payload for creating an API key',
  })
  @ApiDataResponse({
    type: CreateApiKeyRes,
    status: HttpStatus.CREATED,
    description: 'API key successfully created',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request. Invalid request body',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized. Missing or invalid authentication',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden. No rights to create API key',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Organization, brand, or project not found',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'API key with this name already exists',
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: 'Validation failed',
  })
  async createApiKey(
    @Body()
    body: CreateApiKeyDto,

    @Req()
    req: Request,
  ): Promise<CreateApiKeyRes> {
    return await this.apiKeyService.create({
      name: body.name,
      expiresAt: body.expiresAt,
      brandId: body.brandId,
      projectId: body.projectId,
      createdByUserId: (req as any).user?.id,
      organizationId: (req as any).activeOrganizationId,
    })
  }
  // #endregion------------------------------------------

  // #endregion------------------------------------------
  // [GET] | GET LIST API KEYS
  // #region GET----------------------------------------
  @Get()
  @UseGuards(SessionGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get list API keys',
    description:
      'Returns API keys metadata for the active organization. Raw key values are never returned.',
    operationId: 'get_api_keys',
    tags: [ApiSwaggerTag.ApiKey],
  })
  @ApiQueries([
    {
      name: 'brandId',
      example: SWAGGER_EXAMPLES.betterAuthId,
      required: false,
      type: String,
      description: 'Filter API keys by brand UUID',
    },
    {
      name: 'projectId',
      example: SWAGGER_EXAMPLES.uuid,
      required: false,
      type: String,
      description: 'Filter API keys by project UUID',
    },
  ])
  @ApiPaginator({
    query: {
      type: GetApiKeysQueryDto,
    },
    response: {
      type: ApiKeyItemRes,
      status: HttpStatus.OK,
      description: 'API keys successfully returned',
    },
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized. Missing or invalid authentication',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden. No rights to read API keys',
  })
  async getApiKeys(
    @ValidQuery(GetApiKeysQueryDto)
    query: GetApiKeysQueryDto,

    @Req()
    req: Request,
  ): Promise<PaginatedResponse<ApiKeyItemRes>> {
    return await this.apiKeyService.getList({
      limit: query.limit,
      page: query.page,
      status: query.status,
      projectId: query.projectId,
      brandId: query.brandId,
      userId: (req as any).user?.id,
      organizationId: (req as any).activeOrganizationId,
    })
  }
  // #endregion------------------------------------------

  // #endregion------------------------------------------
  // [GET] | GET API KEY BY ID
  // #region GET----------------------------------------
  @Get(':apiKeyId')
  @UseGuards(SessionGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get API key',
    description:
      'Returns metadata for a single API key. Raw key value is never returned.',
    operationId: 'get_api_key',
    tags: [ApiSwaggerTag.ApiKey],
  })
  @ApiParam({
    name: 'apiKeyId',
    type: String,
    example: SWAGGER_EXAMPLES.uuid,
    format: 'uuid',
    description: 'API key UUID',
  })
  @ApiDataResponse({
    type: ApiKeyItemRes,
    status: HttpStatus.OK,
    description: 'API key successfully returned',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized. Missing or invalid authentication',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden. No rights to read API key',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'API key not found',
  })
  async getApiKey(
    @Param('apiKeyId', ParseUUIDPipe)
    apiKeyId: string,

    @Req()
    req: Request,
  ): Promise<ApiKeyItemRes> {
    return await this.apiKeyService.getById({
      apiKeyId: apiKeyId,
      organizationId: (req as any).activeOrganizationId,
      userId: (req as any).user?.id,
    })
  }
  // #endregion------------------------------------------

  // #endregion------------------------------------------
  // [PATCH] | REVOKE API KEY
  // #region PATCH--------------------------------------
  @Patch(':apiKeyId/revoke')
  @UseGuards(SessionGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Revoke API key',
    description:
      'Revokes an existing API key. Revoked keys can no longer authenticate CLI/MCP requests.',
    operationId: 'revoke_api_key',
    tags: [ApiSwaggerTag.ApiKey],
  })
  @ApiParam({
    name: 'apiKeyId',
    type: String,
    example: SWAGGER_EXAMPLES.uuid,
    description: 'API key UUID',
  })
  @ApiDataResponse({
    type: RevokeApiKeyRes,
    status: HttpStatus.OK,
    description: 'API key successfully revoked',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized. Missing or invalid authentication',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden. No rights to revoke API key',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'API key not found',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'API key is already revoked',
  })
  async revokeApiKey(
    @Param('apiKeyId', ParseUUIDPipe)
    apiKeyId: string,

    @Req()
    req: Request,
  ): Promise<RevokeApiKeyRes> {
    return await this.apiKeyService.revoke({
      apiKeyId: apiKeyId,
      organizationId: (req as any).activeOrganizationId,
      userId: (req as any).user?.id,
    })
  }
  // #endregion------------------------------------------
}
