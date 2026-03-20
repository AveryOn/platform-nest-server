import { PartialType } from '@nestjs/mapped-types'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator'
import { IsNotEmptyBody } from '~/shared/validators/object.validator'

export class RuleMetadataDto {
  @ApiPropertyOptional({
    example: ['ui', 'button'],
    type: [String],
    description: 'Rule tags',
  })
  @IsOptional()
  tags?: string[]

  @ApiPropertyOptional({
    example: 'button.primary',
    description: 'Rule target',
    type: [String],
  })
  @IsOptional()
  @IsString()
  target?: string;

  [key: string]: any
}

export class CreateRuleDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Rule group id',
    type: [String],
  })
  @IsNotEmpty()
  @IsString()
  groupId: string

  @ApiPropertyOptional({
    example: 'Primary button usage',
    description: 'Rule title',
    type: [String],
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  title?: string

  @ApiProperty({
    example: 'Use primary button for main call to action.',
    description: 'Rule body',
    type: [String],
  })
  @IsNotEmpty()
  @IsString()
  body: string

  @ApiPropertyOptional({
    example: {
      tags: ['ui', 'button'],
      target: 'button.primary',
    },
    description: 'Rule metadata',
    type: Object,
    nullable: true,
  })
  @IsOptional()
  @IsObject()
  metadata?: RuleMetadataDto | null

  @ApiPropertyOptional({
    example: 0,
    description: 'Sort order index',
    type: [Number],
    minimum: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  orderIndex?: number
}

export class RuleResponse {
  @ApiProperty({
    example: 'rule_01HXYZABC123DEF456GHI789JK',
    description: 'Rule ID',
  })
  @IsString()
  id: string

  @ApiProperty({
    example: 'proj_01HXYZABC123DEF456GHI789JK',
    description: 'Project ID',
  })
  @IsString()
  projectId: string

  @ApiProperty({
    example: 'group_01HXYZABC123DEF456GHI789JK',
    description: 'Group ID',
  })
  @IsString()
  groupId: string

  @ApiProperty({
    example: 'Button color rule',
    description: 'Rule title',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  title: string | null

  @ApiProperty({
    example: 'Buttons must use primary color token',
    description: 'Rule body',
  })
  @IsString()
  body: string

  @ApiProperty({
    example: { severity: 'high' },
    description: 'Metadata',
    type: Object,
  })
  metadata: unknown

  @ApiProperty({
    example: 1,
    description: 'Order index',
  })
  @IsInt()
  orderIndex: number

  @ApiProperty({
    example: true,
    description: 'Is from template',
  })
  @IsBoolean()
  isFromTemplate: boolean

  @ApiProperty({
    example: 'rule_ref_button_color',
    description: 'Template reference',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  templateRef: string | null

  @ApiProperty({
    example: true,
    description: 'Is enabled',
  })
  @IsBoolean()
  enabled: boolean

  @ApiProperty({
    example: '2026-03-20T12:00:00.000Z',
    description: 'Created at',
  })
  @IsDateString()
  createdAt: string

  @ApiProperty({
    example: '2026-03-20T12:30:00.000Z',
    description: 'Updated at',
  })
  @IsDateString()
  updatedAt: string

  @ApiProperty({
    example: null,
    description: 'Deleted at',
    nullable: true,
  })
  @IsOptional()
  @IsDateString()
  deletedAt: string | null
}

export class UpdateRuleBaseDto {
  @ApiPropertyOptional({
    example: 'Primary button usage',
    description: 'Rule title',
    type: [String],
    maxLength: 500,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  title?: string | null

  @ApiPropertyOptional({
    example: 'Use primary button for main call to action.',
    description: 'Rule body',
    type: [String],
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  body?: string

  @ApiPropertyOptional({
    example: {
      tags: ['ui', 'button'],
      target: 'button.primary',
    },
    description: 'Rule metadata',
    type: Object,
    nullable: true,
  })
  @IsOptional()
  @IsObject()
  metadata?: RuleMetadataDto | null

  @ApiPropertyOptional({
    example: 0,
    description: 'Sort order index',
    type: [Number],
    minimum: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  orderIndex?: number

  @ApiPropertyOptional({
    example: true,
    description: 'Rule enabled flag',
    type: [Boolean],
  })
  @IsOptional()
  @IsBoolean()
  enabled?: boolean

  @ApiPropertyOptional({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Rule group id',
    type: [String],
  })
  @IsOptional()
  @IsString()
  groupId?: string
}

export class UpdateRuleDto extends PartialType(UpdateRuleBaseDto) {
  @IsNotEmptyBody({
    message: 'At least one field must be provided',
  })
  dummy?: any
}

export class DeleteRuleResponse {
  @ApiProperty({
    example: true,
    description: 'Success Flag',
    type: [Boolean],
  })
  @IsBoolean()
  success: boolean
}

export class ReorderRuleResponse {
  @ApiProperty({
    example: true,
    description: 'Success Flag',
    type: [Boolean],
  })
  @IsBoolean()
  success: boolean
}

export class ReorderBodyDto {
  @ApiProperty({
    example: 'group_01HXYZABC123DEF456GHI789JK',
    description: 'Group ID',
  })
  @IsString()
  @IsNotEmpty()
  groupId: string

  @ApiProperty({
    example: ['rule_1', 'rule_2', 'rule_3'],
    description: 'Ordered list of rule IDs',
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  orderedIds: string[]
}
