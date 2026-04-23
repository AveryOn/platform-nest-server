import { ApiProperty } from '@nestjs/swagger'

export class TemplateItemResponseDto {
  @ApiProperty({
    example: '2f972727-e95d-4564-b1bc-7dc95d44c7a3',
    description: 'Template UUID',
    type: String,
    format: 'uuid',
  })
  id: string

  @ApiProperty({
    example: 'shadcn-ui',
    description: 'Stable template slug',
    type: String,
  })
  slug: string

  @ApiProperty({
    example: 'shadcn/ui',
    description: 'Human-readable template name',
    type: String,
  })
  name: string

  @ApiProperty({
    example: 'Default UI rules template based on shadcn/ui structure',
    description: 'Template description',
    type: String,
    nullable: true,
  })
  description: string | null

  @ApiProperty({
    example: '2026-04-20T12:00:00.000Z',
    description: 'Creation timestamp in ISO-8601 format',
    type: String,
    format: 'date-time',
  })
  createdAt: string

  @ApiProperty({
    example: '2026-04-20T12:30:00.000Z',
    description: 'Update timestamp in ISO-8601 format',
    type: String,
    format: 'date-time',
  })
  updatedAt: string
}

export class TemplatesListResponseDto {
  @ApiProperty({
    example: 1,
    description: 'Total number of available templates',
    type: Number,
  })
  total: number

  @ApiProperty({
    type: TemplateItemResponseDto,
    isArray: true,
    description: 'List of available templates',
  })
  items: TemplateItemResponseDto[]
}

export class TemplateSnapshotItemResponseDto {
  @ApiProperty({
    example: '0d3fe3b9-a578-420e-9556-d316ece261d3',
    description: 'Template snapshot UUID',
    type: String,
    format: 'uuid',
  })
  id: string

  @ApiProperty({
    example: '2f972727-e95d-4564-b1bc-7dc95d44c7a3',
    description: 'Owner template UUID',
    type: String,
    format: 'uuid',
  })
  templateId: string

  @ApiProperty({
    example: 1,
    description:
      'Monotonic template snapshot version inside template scope',
    type: Number,
    minimum: 1,
  })
  version: number

  @ApiProperty({
    example:
      'f8ac10f23c5b5bc1167bda84b833e5c057a77d2f2f5a9174709b4f0c2d7fcb45',
    description:
      'Deterministic content hash of template snapshot payload',
    type: String,
  })
  hash: string

  @ApiProperty({
    example: '2026-04-20T12:45:00.000Z',
    description: 'Creation timestamp in ISO-8601 format',
    type: String,
    format: 'date-time',
  })
  createdAt: string
}

export class TemplateSnapshotsListResponseDto {
  @ApiProperty({
    example: '2f972727-e95d-4564-b1bc-7dc95d44c7a3',
    description: 'Owner template UUID',
    type: String,
    format: 'uuid',
  })
  templateId: string

  @ApiProperty({
    example: 1,
    description: 'Total number of template snapshots',
    type: Number,
  })
  total: number

  @ApiProperty({
    type: TemplateSnapshotItemResponseDto,
    isArray: true,
    description: 'Ordered list of template snapshots',
  })
  items: TemplateSnapshotItemResponseDto[]
}
