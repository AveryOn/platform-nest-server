import { ApiProperty } from '@nestjs/swagger'
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator'
import { PaginationDto } from '~/shared/paginator/infra/http/paginator.dto'

export class TemplateItemRes {
  @ApiProperty({
    example: '2f972727-e95d-4564-b1bc-7dc95d44c7a3',
    description: 'Template UUID',
    type: String,
    format: 'uuid',
  })
  @IsNotEmpty()
  @IsString()
  id: string

  @ApiProperty({
    example: 'shadcn-ui',
    description: 'Stable template slug',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  slug: string

  @ApiProperty({
    example: 'shadcn/ui',
    description: 'Human-readable template name',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  name: string

  @ApiProperty({
    example: 'Default UI rules template based on shadcn/ui structure',
    description: 'Template description',
    type: String,
    nullable: true,
  })
  @IsOptional()
  @ValidateIf((_, value) => value !== null)
  @IsString()
  description: string | null

  @ApiProperty({
    example: '2026-04-20T12:00:00.000Z',
    description: 'Creation timestamp in ISO-8601 format',
    type: String,
    format: 'date-time',
  })
  @IsNotEmpty()
  @IsString()
  createdAt: string

  @ApiProperty({
    example: '2026-04-20T12:30:00.000Z',
    description: 'Update timestamp in ISO-8601 format',
    type: String,
    format: 'date-time',
  })
  @IsOptional()
  @ValidateIf((_, value) => value !== null)
  @IsString()
  updatedAt: string | null
}

export class TemplateGetListQueryDto extends PaginationDto {}

export class TemplateSnapshotItemRes {
  @ApiProperty({
    example: '0d3fe3b9-a578-420e-9556-d316ece261d3',
    description: 'Template snapshot UUID',
    type: String,
    format: 'uuid',
  })
  @IsString()
  @IsNotEmpty()
  id: string

  @ApiProperty({
    example: '2f972727-e95d-4564-b1bc-7dc95d44c7a3',
    description: 'Owner template UUID',
    type: String,
    format: 'uuid',
  })
  @IsString()
  @IsNotEmpty()
  templateId: string

  @ApiProperty({
    example: 1,
    description:
      'Monotonic template snapshot version inside template scope',
    type: Number,
    minimum: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  version: number

  @ApiProperty({
    example:
      'f8ac10f23c5b5bc1167bda84b833e5c057a77d2f2f5a9174709b4f0c2d7fcb45',
    description:
      'Deterministic content hash of template snapshot payload',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  hash: string

  @ApiProperty({
    example: '2026-04-20T12:45:00.000Z',
    description: 'Creation timestamp in ISO-8601 format',
    type: String,
    format: 'date-time',
  })
  @IsString()
  @IsNotEmpty()
  createdAt: string
}

export class TemplateSnapshotGetListQueryDto extends PaginationDto {}
