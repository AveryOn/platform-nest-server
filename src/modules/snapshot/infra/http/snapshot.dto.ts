import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
  IsBoolean,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator'
import { ResolvedRuleItemResponse } from '~/modules/resolved-ruleset/infra/http/resolved-ruleset.dto'
import { PaginationDto } from '~/shared/paginator/infra/http/paginator.dto'

export class ProjectSnapshotCreateDto {
  @ApiPropertyOptional({
    example: false,
    description:
      'If true, backend may skip creation when current resolved payload hash matches the latest snapshot',
    type: Boolean,
    default: false,
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  skipIfUnchanged?: boolean

  @ApiPropertyOptional({
    example: 'Manual snapshot before export',
    description: 'Optional human-readable comment for snapshot creation',
    type: String,
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  comment?: string
}

export class ProjectSnapshotItemRes {
  @ApiProperty({
    example: '4d52ad0c-5506-4fd0-a6c9-0da4bbf8f8bb',
    description: 'Snapshot UUID',
    type: String,
    format: 'uuid',
  })
  id: string

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Owner project UUID',
    type: String,
    format: 'uuid',
  })
  projectId: string

  @ApiProperty({
    example: 1,
    description: 'Monotonic snapshot version inside project scope',
    type: Number,
    minimum: 1,
  })
  version: number

  @ApiProperty({
    example:
      'f8ac10f23c5b5bc1167bda84b833e5c057a77d2f2f5a9174709b4f0c2d7fcb45',
    description: 'Deterministic content hash of snapshot payload',
    type: String,
  })
  hash: string

  @ApiPropertyOptional({
    example: 'Manual snapshot before export',
    description: 'Optional snapshot comment',
    type: String,
    nullable: true,
  })
  comment?: string | null

  @ApiProperty({
    example: '2026-04-20T12:45:00.000Z',
    description: 'Creation timestamp in ISO-8601 format',
    type: String,
    format: 'date-time',
  })
  createdAt: string
}

export class ProjectSnapshotsListQuery extends PaginationDto {}

export class ProjectSnapshotsListRes {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Owner project UUID',
    type: String,
    format: 'uuid',
  })
  projectId: string

  @ApiProperty({
    example: 1,
    description: 'Total number of snapshots for the project',
    type: Number,
  })
  total: number

  @ApiProperty({
    type: ProjectSnapshotItemRes,
    isArray: true,
    description: 'Ordered list of project snapshots',
  })
  items: ProjectSnapshotItemRes[]
}

export class SnapshotPayloadRuleItemRes {
  @ApiProperty({
    example: 'b9cbfc46-f42f-4a9c-9e5f-d3d5b88d9ec7',
    description: 'Rule UUID inside snapshot payload',
    type: String,
    format: 'uuid',
  })
  id: string

  @ApiProperty({
    example: 'When to use',
    description: 'Rule title',
    type: String,
  })
  name: string

  @ApiProperty({
    example: 'Use button for primary actions.',
    description: 'Resolved rule body content',
    type: String,
  })
  body: string

  @ApiProperty({
    example: ['Components', 'Button', 'When to use'],
    description: 'Resolved semantic path to the rule',
    type: String,
    isArray: true,
  })
  path: string[]

  @ApiProperty({
    example: '0001.0001.0001',
    description: 'Stable deterministic order key of the resolved rule',
    type: String,
  })
  orderKey: string
}

export class SnapshotPayloadDto {
  @ApiProperty({
    type: ResolvedRuleItemResponse,
    isArray: true,
    description:
      'Flat ordered list of resolved rules stored in snapshot payload',
  })
  rules: ResolvedRuleItemResponse[]
}

export class ProjectSnapshotPayloadRes {
  @ApiProperty({
    example: '4d52ad0c-5506-4fd0-a6c9-0da4bbf8f8bb',
    description: 'Snapshot UUID',
    type: String,
    format: 'uuid',
  })
  snapshotId: string

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Owner project UUID',
    type: String,
    format: 'uuid',
  })
  projectId: string

  @ApiProperty({
    example: 1,
    description: 'Snapshot version inside project scope',
    type: Number,
  })
  version: number

  @ApiProperty({
    type: SnapshotPayloadDto,
    description: 'Materialized snapshot payload',
  })
  payload: SnapshotPayloadDto
}

export class ProjectSnapshotStatusRes {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Owner project UUID',
    type: String,
    format: 'uuid',
  })
  projectId: string

  @ApiProperty({
    example: true,
    description: 'Whether the project has at least one snapshot',
    type: Boolean,
  })
  hasSnapshots: boolean

  @ApiProperty({
    example: false,
    description:
      'Whether latest snapshot is outdated compared to live project data',
    type: Boolean,
  })
  isOutdated: boolean

  @ApiProperty({
    example: '4d52ad0c-5506-4fd0-a6c9-0da4bbf8f8bb',
    description: 'Latest snapshot UUID',
    type: String,
    format: 'uuid',
    nullable: true,
  })
  latestSnapshotId: string | null

  @ApiProperty({
    example: 1,
    description: 'Latest snapshot version',
    type: Number,
    nullable: true,
  })
  latestVersion: number | null

  @ApiProperty({
    example: '2026-04-20T12:45:00.000Z',
    description: 'Latest snapshot creation timestamp in ISO-8601 format',
    type: String,
    format: 'date-time',
    nullable: true,
  })
  lastCreatedAt: string | null
}
