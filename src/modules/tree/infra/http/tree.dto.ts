import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Transform, Type } from 'class-transformer'
import { IsBoolean, IsOptional, ValidateNested } from 'class-validator'
import { RuleGroupType } from '~/modules/rule-group/application/rule-group.type'

export class ProjectTreeDto {
  @ApiPropertyOptional({
    example: true,
    description: 'Include hidden rule groups and rules in editor tree response',
    type: Boolean,
    default: true,
  })
  @IsOptional()
  @Transform(({ value }) => value === true || value === 'true')
  @IsBoolean()
  includeHidden?: boolean

  @ApiPropertyOptional({
    example: true,
    description: 'Include metadata payloads inside rule items',
    type: Boolean,
    default: true,
  })
  @IsOptional()
  @Transform(({ value }) => value === true || value === 'true')
  @IsBoolean()
  includeMetadata?: boolean
}

export class RuleTreeItemResponse {
  @ApiProperty({
    example: 'b9cbfc46-f42f-4a9c-9e5f-d3d5b88d9ec7',
    description: 'Rule UUID',
    type: String,
    format: 'uuid',
  })
  id: string

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
  name: string

  @ApiProperty({
    example: 'Use button for primary actions',
    description: 'Rule body content',
    type: String,
  })
  body: string

  @ApiProperty({
    example: { tags: ['button', 'usage'], target: 'ui' },
    description: 'Flexible metadata payload',
    type: Object,
    nullable: true,
  })
  metadata: Record<string, any> | null

  @ApiProperty({
    example: 0,
    description: 'Order index inside rule group',
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

export class ProjectTreeNodeResponse {
  @ApiProperty({
    example: '7c917903-d8f3-445b-bec8-122c4cf3a411',
    description: 'Rule group UUID',
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
    example: '7c917903-d8f3-445b-bec8-122c4cf3a411',
    description: 'Parent rule group UUID. Null means root group',
    type: String,
    format: 'uuid',
    nullable: true,
  })
  parentGroupId: string | null

  @ApiProperty({
    example: 'Components',
    description: 'Rule group name',
    type: String,
  })
  name: string

  @ApiProperty({
    example: 'Component rules',
    description: 'Rule group description',
    type: String,
    nullable: true,
  })
  description: string | null

  @ApiProperty({
    example: RuleGroupType.category,
    description: 'Rule group semantic type',
    type: String,
    enum: Object.values(RuleGroupType),
  })
  type: RuleGroupType

  @ApiProperty({
    example: 0,
    description: 'Order index within sibling list',
    type: Number,
  })
  orderIndex: number

  @ApiProperty({
    example: false,
    description: 'Whether this node is hidden at project configuration level',
    type: Boolean,
  })
  isHidden: boolean

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

  @ApiProperty({
    type: RuleTreeItemResponse,
    isArray: true,
    description: 'Direct rules that belong to this rule group',
  })
  @ValidateNested({ each: true })
  @Type(() => RuleTreeItemResponse)
  rules: RuleTreeItemResponse[]

  @ApiProperty({
    type: () => ProjectTreeNodeResponse,
    isArray: true,
    description: 'Direct child rule groups',
  })
  @ValidateNested({ each: true })
  @Type(() => ProjectTreeNodeResponse)
  children: ProjectTreeNodeResponse[]
}

export class ProjectTreeResponse {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Owner project UUID',
    type: String,
    format: 'uuid',
  })
  projectId: string

  @ApiProperty({
    example: true,
    description: 'Whether hidden nodes were included in the response',
    type: Boolean,
  })
  includeHidden: boolean

  @ApiProperty({
    example: true,
    description: 'Whether metadata field were included in the rule groups and rules',
    type: Boolean,
  })
  includeMetadata: boolean

  @ApiProperty({
    type: () => ProjectTreeNodeResponse,
    isArray: true,
    description: 'Ordered list of root rule groups with nested children and direct rules',
  })
  @ValidateNested({ each: true })
  @Type(() => ProjectTreeNodeResponse)
  tree: ProjectTreeNodeResponse[]
}
