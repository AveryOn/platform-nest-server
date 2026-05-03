import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  ValidateIf,
} from 'class-validator'
import {
  ApiKeyMode,
  ApiKeyScope,
  ApiKeyStatus,
} from '~/modules/api-key/application/api-key.type'
import { PaginationDto } from '~/shared/paginator/infra/http/paginator.dto'

export class CreateApiKeyDto {
  @ApiProperty({
    example: 'Cursor MCP',
    description: 'Human-readable API key name',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  name: string

  @ApiProperty({
    example: 'c6f33564-2c64-4f7c-bb6f-6e3d7ef21671',
    description: 'Brand UUID',
    format: 'uuid',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  brandId: string

  @ApiPropertyOptional({
    example: '9f1d4f9b-1ad7-4f10-98cb-8d5fbdfcfe5a',
    description:
      'Project UUID. If provided, the API key is scoped to this project',
    format: 'uuid',
    type: String,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @IsUUID()
  projectId?: string | null

  @ApiPropertyOptional({
    example: '2026-12-31T23:59:59.000Z',
    description: 'API key expiration date',
    type: String,
    format: 'date-time',
  })
  @IsOptional()
  @IsString()
  @IsDateString()
  expiresAt?: string

  // @ApiPropertyOptional({
  //   example: [
  //     ApiKeyScope.ProjectRead,
  //     ApiKeyScope.RulesetRead,
  //     ApiKeyScope.SnapshotRead,
  //     ApiKeyScope.SnapshotPayloadRead,
  //     ApiKeyScope.ExportRead,
  //   ],
  //   description: 'Allowed API key scopes',
  //   enum: ApiKeyScope,
  //   isArray: true,
  // })
  // @IsOptional()
  // @IsArray()
  // @IsString({ each: true })
  // @IsEnum(ApiKeyScope, { each: true })
  // scopes?: ApiKeyScope[]
}

export class ApiKeyItemRes {
  @ApiProperty({
    example: '1fd0d0e7-f4a1-4ec5-9d7b-d80791b7ccf1',
    description: 'API key UUID',
    format: 'uuid',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  id: string

  @ApiProperty({
    example: 'Cursor MCP',
    description: 'Human-readable API key name',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  name: string

  @ApiProperty({
    example: 'uir_live_abc123',
    description: 'Visible API key prefix',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  keyPrefix: string

  @ApiProperty({
    example: 'c6f33564-2c64-4f7c-bb6f-6e3d7ef21671',
    description: 'Brand UUID',
    format: 'uuid',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  brandId: string

  @ApiPropertyOptional({
    example: '9f1d4f9b-1ad7-4f10-98cb-8d5fbdfcfe5a',
    description: 'Project UUID',
    format: 'uuid',
    type: String,
    nullable: true,
  })
  @IsOptional()
  @ValidateIf((_, value) => value !== null)
  @IsString()
  @IsUUID()
  projectId?: string | null

  @ApiProperty({
    example: 'org_abc123',
    description: 'Organization ID',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  organizationId: string

  @ApiProperty({
    example: 'user_abc123',
    description: 'User ID who created the API key',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  createdByUserId: string

  @ApiProperty({
    example: ApiKeyMode.ReadOnly,
    description: 'API key access mode',
    enum: ApiKeyMode,
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  @IsEnum(ApiKeyMode)
  mode: ApiKeyMode

  @ApiPropertyOptional({
    example: [
      ApiKeyScope.ProjectRead,
      ApiKeyScope.RulesetRead,
      ApiKeyScope.SnapshotRead,
      ApiKeyScope.SnapshotPayloadRead,
      ApiKeyScope.ExportRead,
    ],
    description: 'Allowed API key scopes',
    enum: ApiKeyScope,
    isArray: true,
    type: Array,
  })
  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  @IsEnum(ApiKeyScope, { each: true })
  scopes: ApiKeyScope[]

  @ApiProperty({
    example: ApiKeyStatus.Active,
    description: 'API key status',
    enum: ApiKeyStatus,
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  @IsEnum(ApiKeyStatus)
  status: ApiKeyStatus

  @ApiProperty({
    example: '2026-05-02T12:00:00.000Z',
    description: 'API key creation date',
    type: String,
    format: 'date-time',
  })
  @IsNotEmpty()
  @IsString()
  @IsDateString()
  createdAt: string

  @ApiPropertyOptional({
    example: '2026-05-02T12:30:00.000Z',
    description: 'Last usage date',
    type: String,
    format: 'date-time',
  })
  @IsOptional()
  @ValidateIf((_, value) => value !== null)
  @IsString()
  @IsDateString()
  lastUsedAt?: string | null

  @ApiPropertyOptional({
    example: '2026-12-31T23:59:59.000Z',
    description: 'Expiration date',
    type: String,
    format: 'date-time',
  })
  @IsOptional()
  @ValidateIf((_, value) => value !== null)
  @IsString()
  @IsDateString()
  expiresAt?: string | null

  @ApiPropertyOptional({
    example: '2026-05-02T13:00:00.000Z',
    description: 'Revocation date',
    type: String,
    format: 'date-time',
  })
  @IsOptional()
  @ValidateIf((_, value) => value !== null)
  @IsString()
  @IsDateString()
  revokedAt?: string | null
}

export class CreateApiKeyRes extends ApiKeyItemRes {
  @ApiProperty({
    example: 'uir_sk_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    description: 'Raw API key. Returned only once after creation',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  key: string
}

export class GetApiKeysQueryDto extends PaginationDto {
  @ApiPropertyOptional({
    example: 'c6f33564-2c64-4f7c-bb6f-6e3d7ef21671',
    description: 'Filter by brand UUID',
    format: 'uuid',
    type: String,
  })
  @IsOptional()
  @IsString()
  @IsUUID()
  brandId?: string

  @ApiPropertyOptional({
    example: '9f1d4f9b-1ad7-4f10-98cb-8d5fbdfcfe5a',
    description: 'Filter by project UUID',
    format: 'uuid',
    type: String,
  })
  @IsOptional()
  @IsString()
  @IsUUID()
  projectId?: string

  @ApiPropertyOptional({
    example: ApiKeyStatus.Active,
    description: 'Filter by API key status',
    enum: ApiKeyStatus,
    type: String,
  })
  @IsOptional()
  @IsString()
  @IsEnum(ApiKeyStatus)
  status?: ApiKeyStatus
}

export class GetApiKeyParamsDto {
  @ApiProperty({
    example: '1fd0d0e7-f4a1-4ec5-9d7b-d80791b7ccf1',
    description: 'API key UUID',
    format: 'uuid',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  apiKeyId: string
}

export class RevokeApiKeyParamsDto extends GetApiKeyParamsDto {}

export class RevokeApiKeyRes extends ApiKeyItemRes {}
