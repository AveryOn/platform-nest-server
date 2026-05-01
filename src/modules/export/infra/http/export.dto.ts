import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsBoolean, IsEnum, IsOptional } from 'class-validator'
import { ExportFormat } from '~/modules/export/application/export.type'

export class ExportProjectReq {
  @ApiProperty({
    enum: ExportFormat,
    example: ExportFormat.markdown,
    description: 'Export output format.',
  })
  @IsEnum(ExportFormat)
  format: ExportFormat

  @ApiPropertyOptional({
    example: true,
    description:
      'If true, creates an immutable project snapshot before returning the export result.',
  })
  @IsOptional()
  @IsBoolean()
  createSnapshot?: boolean
}

export class ExportProjectRes {
  @ApiProperty({
    example: '2f972727-e95d-4564-b1bc-7dc95d44c7a3',
    description: 'Project UUID.',
  })
  projectId: string

  @ApiProperty({
    enum: ExportFormat,
    example: ExportFormat.markdown,
    description: 'Export output format.',
  })
  format: ExportFormat

  @ApiProperty({
    oneOf: [{ type: 'string' }, { type: 'object' }],
    description: 'Exported ruleset content in the requested format.',
  })
  content: string | object

  @ApiPropertyOptional({
    example: '8cd5bf9e-eb16-4a0b-8ff8-0995ac87638a',
    description:
      'Created snapshot UUID. Exists only when snapshot creation is requested.',
  })
  snapshotId?: string

  @ApiPropertyOptional({
    example: 1,
    description:
      'Created snapshot version. Exists only when snapshot creation is requested.',
  })
  snapshotVersion?: number
}
