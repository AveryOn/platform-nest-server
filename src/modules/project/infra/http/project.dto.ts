import {
  ApiProperty,
  ApiPropertyOptional,
  PartialType,
} from '@nestjs/swagger'
import { Transform, Type } from 'class-transformer'
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator'
import { SWAGGER_EXAMPLES } from '~/shared/const/swagger.const'
import { IsNotEmptyBody } from '~/shared/validators/object.validator'

export class ProjectGetListQueryDto {
  @ApiPropertyOptional({
    example: 'design',
    description: 'Free-text search by project name',
    type: String,
  })
  @IsOptional()
  @IsString()
  search?: string

  @ApiPropertyOptional({
    example: 1,
    description: 'Page number',
    minimum: 1,
    default: 1,
    type: Number,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number

  @ApiPropertyOptional({
    example: 20,
    description: 'Items per page',
    minimum: 1,
    maximum: 100,
    default: 20,
    type: Number,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number

  @ApiPropertyOptional({
    example: false,
    description: 'Include archived projects in response',
    default: false,
    type: Boolean,
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  includeArchived?: boolean

  @ApiPropertyOptional({
    example: 'c6f33564-2c64-4f7c-bb6f-6e3d7ef21671',
    description: 'Filter by brand UUID',
    format: 'uuid',
    type: String,
  })
  @IsOptional()
  @IsUUID()
  brandId?: string
}

export class ProjectCreateDto {
  @ApiProperty({
    example: 'Main Design System',
    description: 'Human-readable project name',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiPropertyOptional({
    example: 'Project for product UI rules and governance',
    description: 'Optional project description',
    nullable: true,
    type: String,
  })
  @IsOptional()
  @IsString()
  description?: string | null

  @ApiPropertyOptional({
    example: 'c6f33564-2c64-4f7c-bb6f-6e3d7ef21671',
    description: 'Optional brand UUID linked to the project',
    format: 'uuid',
    nullable: true,
    type: String,
  })
  @IsOptional()
  @IsUUID()
  brandId?: string | null

  @ApiPropertyOptional({
    example: '2c0c5af8-7d26-4dd4-a8d6-2f8b0658f1a2',
    description: 'Optional template snapshot UUID used as project base',
    format: 'uuid',
    nullable: true,
    type: String,
  })
  @IsOptional()
  @IsUUID()
  templateSnapshotId?: string | null
}

export class ProjectPatchBaseDto {
  @ApiPropertyOptional({
    example: 'Main Design System v2',
    description: 'Updated human-readable project name',
    type: String,
  })
  @IsOptional()
  @IsString()
  name?: string

  @ApiPropertyOptional({
    example: 'Updated project description',
    description: 'Updated project description',
    nullable: true,
    type: String,
  })
  @IsOptional()
  @IsString()
  description?: string | null

  @ApiPropertyOptional({
    example: 'c6f33564-2c64-4f7c-bb6f-6e3d7ef21671',
    description: 'Updated brand UUID',
    format: 'uuid',
    nullable: true,
    type: String,
  })
  @IsOptional()
  @IsUUID()
  brandId?: string | null

  @ApiPropertyOptional({
    example: '2c0c5af8-7d26-4dd4-a8d6-2f8b0658f1a2',
    description: 'Updated template snapshot UUID',
    format: 'uuid',
    nullable: true,
    type: String,
  })
  @IsOptional()
  @IsUUID()
  templateSnapshotId?: string | null
}

export class ProjectPatchDto extends PartialType(ProjectPatchBaseDto) {
  @IsNotEmptyBody({
    message: 'At least one field must be provided',
  })
  dummy?: any
}

export class ProjectListItemResponseDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Project UUID',
    format: 'uuid',
    type: String,
  })
  id: string

  @ApiProperty({
    example: 'Main Design System',
    description: 'Project name',
    type: String,
  })
  name: string

  @ApiProperty({
    example: 'Main product project',
    description: 'Project description',
    nullable: true,
    type: String,
  })
  description: string | null

  @ApiProperty({
    example: 'c6f33564-2c64-4f7c-bb6f-6e3d7ef21671',
    description: 'Brand UUID',
    format: 'uuid',
    nullable: true,
    type: String,
  })
  brandId: string | null

  @ApiProperty({
    example: 'org_123456',
    description: 'Organization identifier',
    type: String,
  })
  organizationId: string

  @ApiProperty({
    example: '2c0c5af8-7d26-4dd4-a8d6-2f8b0658f1a2',
    description: 'Template snapshot UUID used by project',
    format: 'uuid',
    nullable: true,
    type: String,
  })
  templateSnapshotId: string | null

  @ApiProperty({
    example: false,
    description: 'Soft delete flag',
    type: Boolean,
  })
  isArchived: boolean

  @ApiProperty({
    example: '2026-04-20T12:00:00.000Z',
    description: 'Project creation timestamp in ISO-8601 format',
    type: String,
  })
  createdAt: string

  @ApiProperty({
    example: '2026-04-20T12:30:00.000Z',
    description: 'Project update timestamp in ISO-8601 format',
    type: String,
  })
  updatedAt: string
}

export class ProjectItemResponseDto {
  @ApiProperty({
    example: SWAGGER_EXAMPLES.uuid,
    type: String,
  })
  id: string

  @ApiProperty({
    example: 'Main Design System',
    type: String,
  })
  name: string

  @ApiProperty({
    example: 'Main product project',
    nullable: true,
    type: String,
  })
  description: string | null

  @ApiProperty({
    example: SWAGGER_EXAMPLES.uuid,
    nullable: true,
    type: String,
  })
  brandId: string | null

  @ApiProperty({
    example: SWAGGER_EXAMPLES.betterAuthId,
    type: String,
  })
  organizationId: string

  @ApiProperty({
    example: SWAGGER_EXAMPLES.uuid,
    nullable: true,
    type: String,
  })
  templateSnapshotId: string | null

  @ApiProperty({
    example: SWAGGER_EXAMPLES.boolean,
    type: Boolean,
  })
  isArchived: boolean

  @ApiProperty({
    example: SWAGGER_EXAMPLES.dateISO,
    type: String,
  })
  createdAt: string

  @ApiProperty({
    example: SWAGGER_EXAMPLES.dateISO,
    type: String,
  })
  updatedAt: string
}

export class ProjectListResponseDto {
  @ApiProperty({
    type: () => ProjectListItemResponseDto,
    isArray: true,
    description: 'Paginated list of projects',
  })
  items: ProjectListItemResponseDto[]

  @ApiProperty({
    example: 1,
    description: 'Total number of matched projects',
    type: Number,
  })
  total: number

  @ApiProperty({
    example: 1,
    description: 'Current page number',
    type: Number,
  })
  page: number

  @ApiProperty({
    example: 20,
    description: 'Requested page size',
    type: Number,
  })
  limit: number
}

export class ProjectPatchResponseDto {
  @ApiProperty({
    enum: ['success', 'failed'],
    default: 'success',
    example: 'success',
    description: 'Patch operation status',
    type: String,
  })
  status: 'success' | 'failed'

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Patched project UUID',
    format: 'uuid',
    type: String,
  })
  projectId: string
}

export class ProjectRemoveResponseDto {
  @ApiProperty({
    example: 'success',
    enum: ['success', 'failed'],
  })
  status: string

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    type: String,
    format: 'uuid',
  })
  projectId: string

  @ApiProperty({
    example: '2026-04-20T12:45:00.000Z',
    type: String,
    format: 'date-time',
  })
  archivedAt: string
}
