import { PartialType } from '@nestjs/mapped-types'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsBoolean,
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
