import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator'
import { IsNotEmptyBody } from '~/shared/validators/object.validator'

export class RuleCreateDto {
  @ApiPropertyOptional({
    example: 'When to use',
    description: 'Optional rule title',
    type: String,
  })
  @IsOptional()
  @IsString()
  title?: string

  @ApiProperty({
    example: 'Use button for primary actions.',
    description: 'Rule body content. Markdown/text supported',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  body: string

  @ApiPropertyOptional({
    example: { tags: ['button', 'usage'], target: 'ui' },
    description: 'Optional flexible metadata payload',
    type: Object,
    nullable: true,
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>

  @ApiProperty({
    example: 1,
    description: 'Order index within rule group',
    type: Number,
    minimum: 0,
  })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  orderIndex: number
}

export class RulePatchBaseDto {
  @ApiPropertyOptional({
    example: 'When to use',
    description: 'Updated rule title',
    type: String,
  })
  @IsOptional()
  @IsString()
  title?: string

  @ApiPropertyOptional({
    example: 'Use button for primary actions.',
    description: 'Updated rule body content',
    type: String,
  })
  @IsOptional()
  @IsString()
  body?: string

  @ApiPropertyOptional({
    example: { tags: ['button', 'usage'], target: 'ui' },
    description: 'Updated flexible metadata payload',
    type: Object,
    nullable: true,
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>
}

export class RulePatchDto extends PartialType(RulePatchBaseDto) {
  @IsNotEmptyBody({
    message: 'At least one field must be provided',
  })
  dummy?: any
}

export class RuleMoveDto {
  @ApiProperty({
    example: '8fd2dbff-e5e7-4781-b22c-b17d061ee8d7',
    description: 'Target rule group UUID',
    type: String,
    format: 'uuid',
  })
  @IsUUID()
  targetGroupId: string

  @ApiProperty({
    example: 2,
    description: 'New order index inside target group',
    type: Number,
    minimum: 0,
  })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  orderIndex: number
}

export class RuleReorderItemDto {
  @ApiProperty({
    example: 'b9cbfc46-f42f-4a9c-9e5f-d3d5b88d9ec7',
    description: 'Rule UUID',
    type: String,
    format: 'uuid',
  })
  @IsUUID()
  id: string

  @ApiProperty({
    example: 0,
    description: 'New order index',
    type: Number,
    minimum: 0,
  })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  orderIndex: number
}

export class RuleReorderInGroupDto {
  @ApiProperty({
    type: RuleReorderItemDto,
    isArray: true,
    description: 'Ordered list of direct rules inside the group',
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => RuleReorderItemDto)
  items: RuleReorderItemDto[]
}

export class RuleItemResponseDto {
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
  title: string

  @ApiProperty({
    example: 'Use button for primary actions.',
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
    example: 1,
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
    nullable: true,
  })
  updatedAt: string | null
}

export class RuleUpdateResponseDto {
  @ApiProperty({
    example: 'success',
    description: 'Operation status',
    type: String,
    enum: ['success', 'failed'],
  })
  status: string

  @ApiProperty({
    example: 'b9cbfc46-f42f-4a9c-9e5f-d3d5b88d9ec7',
    description: 'Affected rule UUID',
    type: String,
    format: 'uuid',
  })
  ruleId: string
}

export class RuleRemoveResponseDto {
  @ApiProperty({
    example: 'success',
    description: 'Archive operation status',
    type: String,
    enum: ['success', 'failed'],
  })
  status: string

  @ApiProperty({
    example: 'b9cbfc46-f42f-4a9c-9e5f-d3d5b88d9ec7',
    description: 'Archived rule UUID',
    type: String,
    format: 'uuid',
  })
  ruleId: string

  @ApiProperty({
    example: '2026-04-20T12:45:00.000Z',
    description: 'Archive timestamp in ISO-8601 format',
    type: String,
    format: 'date-time',
  })
  archivedAt: string
}
