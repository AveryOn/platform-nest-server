import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator'
import { ExportFormat } from '~/modules/export/application/export.type'
import { SWAGGER_EXAMPLES } from '~/shared/const/swagger.const'

export class ExportProjectReq {
  @ApiProperty({
    enum: ExportFormat,
    example: ExportFormat.markdown,
    description: 'Export output format.',
    type: String,
  })
  @IsEnum(ExportFormat)
  format: ExportFormat

  @ApiPropertyOptional({
    example: true,
    description:
      'If true, creates an immutable project snapshot before returning the export result.',
    type: Boolean,
  })
  @IsOptional()
  @IsBoolean()
  createSnapshot?: boolean
}

export class ExportProjectRes {
  @ApiProperty({
    example: '2f972727-e95d-4564-b1bc-7dc95d44c7a3',
    description: 'Project UUID.',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  projectId: string

  @ApiProperty({
    enum: ExportFormat,
    example: ExportFormat.markdown,
    description: 'Export output format',
    type: String,
  })
  format: ExportFormat

  @ApiProperty({
    oneOf: [
      {
        type: 'string',
        example: SWAGGER_EXAMPLES.exportRulesetMd,
      },
      {
        type: 'object',
        example: SWAGGER_EXAMPLES.exportRulesetJson,
      },
    ],
    examples: [
      SWAGGER_EXAMPLES.exportRulesetMd,
      SWAGGER_EXAMPLES.exportRulesetJson,
    ],
    description: 'Exported ruleset content in the requested format',
    type: Object,
  })
  content: string | object

  @ApiPropertyOptional({
    example: '8cd5bf9e-eb16-4a0b-8ff8-0995ac87638a',
    description:
      'Created snapshot UUID. Exists only when snapshot creation is requested',
    type: String,
  })
  snapshotId?: string

  @ApiPropertyOptional({
    example: 1,
    description:
      'Created snapshot version. Exists only when snapshot creation is requested',
    type: Number,
  })
  snapshotVersion?: number
}
