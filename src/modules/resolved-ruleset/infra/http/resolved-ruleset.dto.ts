import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsBoolean, IsOptional } from 'class-validator'

export class ResolvedRulesetQueryDto {
  @ApiPropertyOptional({
    example: true,
    description: 'Include metadata payloads inside resolved rules',
    type: Boolean,
    default: true,
  })
  @IsOptional()
  @Transform(({ value }) => value === true || value === 'true')
  @IsBoolean()
  includeMetadata?: boolean
}

export class ResolvedRuleItemResponseDto {
  @ApiProperty({
    example: 'b9cbfc46-f42f-4a9c-9e5f-d3d5b88d9ec7',
    description: 'Rule UUID',
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
    example: '8fd2dbff-e5e7-4781-b22c-b17d061ee8d7',
    description: 'Owner rule group UUID',
    type: String,
    format: 'uuid',
  })
  ruleGroupId: string

  @ApiProperty({
    example: 'When to use',
    description: 'Rule title',
    type: String,
  })
  title: string

  @ApiProperty({
    example: 'Use button for primary actions.',
    description: 'Resolved rule body content',
    type: String,
  })
  body: string

  @ApiProperty({
    example: { tags: ['button', 'usage'], target: 'ui' },
    description: 'Optional flexible metadata payload',
    type: Object,
    nullable: true,
  })
  metadata: Record<string, any> | null

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

  @ApiProperty({
    example: 0,
    description: 'Final order index of the resolved rule in the flat output',
    type: Number,
  })
  orderIndex: number

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

export class ResolvedRulesetResponseDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Owner project UUID',
    type: String,
    format: 'uuid',
  })
  projectId: string

  @ApiProperty({
    example: 1,
    description: 'Total number of resolved rules in the response',
    type: Number,
  })
  total: number

  @ApiProperty({
    example: true,
    description: 'Whether metadata payloads were included in the response',
    type: Boolean,
  })
  includeMetadata: boolean

  @ApiProperty({
    type: ResolvedRuleItemResponseDto,
    isArray: true,
    description: 'Ordered flat list of resolved rules',
  })
  rules: ResolvedRuleItemResponseDto[]
}
