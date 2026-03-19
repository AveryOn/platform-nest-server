import { PartialType } from '@nestjs/mapped-types'
import {
  ApiExtraModels,
  ApiProperty,
  ApiPropertyOptional,
  getSchemaPath,
} from '@nestjs/swagger'
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
  ValidateIf,
  ValidateNested,
} from 'class-validator'
import { Type } from 'class-transformer'
import { IsNotEmptyBody } from '~/shared/validators/object.validator'

// TODO exclude of here
export const RULE_GROUP_KINDS = [
  'category',
  'component',
  'variant',
  'section',
  'token',
] as const

// TODO exclude of here
export type RuleGroupKind =
  | 'category'
  | 'component'
  | 'variant'
  | 'section'
  | 'token'

export class ColorTokenMetadataDto {
  @ApiProperty({
    example: 'color',
    description: 'Token type',
    enum: ['color'],
  })
  @IsString()
  @IsNotEmpty()
  token_type: 'color'

  @ApiProperty({
    example: '#ffffff',
    description: 'Token value',
    type: [String],
  })
  @IsString()
  @IsNotEmpty()
  value: string

  @ApiPropertyOptional({
    example: '--color-primary',
    description: 'CSS variable',
    type: [String],
  })
  @IsOptional()
  @IsString()
  css_var?: string
}

export class TypographyTokenMetadataDto {
  @ApiProperty({
    example: 'typography',
    description: 'Token type',
    enum: ['typography'],
  })
  @IsString()
  @IsNotEmpty()
  token_type: 'typography'

  @ApiProperty({
    example: '16px',
    description: 'Token value',
    type: [String],
  })
  @IsString()
  @IsNotEmpty()
  value: string

  @ApiPropertyOptional({
    example: '24px',
    description: 'Line height',
    type: [String],
  })
  @IsOptional()
  @IsString()
  line_height?: string

  @ApiPropertyOptional({
    example: '600',
    description: 'Font weight',
    type: [String],
  })
  @IsOptional()
  @IsString()
  font_weight?: string

  @ApiPropertyOptional({
    example: 'Inter',
    description: 'Font family',
    type: [String],
  })
  @IsOptional()
  @IsString()
  font_family?: string

  @ApiPropertyOptional({
    example: '-0.02em',
    description: 'Letter spacing',
    type: [String],
  })
  @IsOptional()
  @IsString()
  letter_spacing?: string

  @ApiPropertyOptional({
    example: '--font-body',
    description: 'CSS variable',
    type: [String],
  })
  @IsOptional()
  @IsString()
  css_var?: string
}

export class RadiusTokenMetadataDto {
  @ApiProperty({
    example: 'radius',
    description: 'Token type',
    enum: ['radius'],
  })
  @IsString()
  @IsNotEmpty()
  token_type: 'radius'

  @ApiProperty({
    example: '8px',
    description: 'Token value',
    type: [String],
  })
  @IsString()
  @IsNotEmpty()
  value: string

  @ApiPropertyOptional({
    example: '--radius-md',
    description: 'CSS variable',
    type: [String],
  })
  @IsOptional()
  @IsString()
  css_var?: string
}

export class ShadowTokenMetadataDto {
  @ApiProperty({
    example: 'shadow',
    description: 'Token type',
    enum: ['shadow'],
  })
  @IsString()
  @IsNotEmpty()
  token_type: 'shadow'

  @ApiProperty({
    example: '0 4px 12px rgba(0, 0, 0, 0.15)',
    description: 'Token value',
    type: [String],
  })
  @IsString()
  @IsNotEmpty()
  value: string

  @ApiPropertyOptional({
    example: '--shadow-card',
    description: 'CSS variable',
    type: [String],
  })
  @IsOptional()
  @IsString()
  css_var?: string
}

@ApiExtraModels(
  ColorTokenMetadataDto,
  TypographyTokenMetadataDto,
  RadiusTokenMetadataDto,
  ShadowTokenMetadataDto,
)
export class CreateRuleGroupDto {
  @ApiProperty({
    example: 'Colors',
    description: 'Rule group name',
    type: [String],
    maxLength: 255,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string

  @ApiPropertyOptional({
    example: 'Core color tokens',
    description: 'Rule group description',
    type: [String],
    maxLength: 1000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string

  @ApiProperty({
    example: 'token',
    description: 'Rule group kind',
    enum: RULE_GROUP_KINDS,
  })
  @IsEnum(RULE_GROUP_KINDS)
  @IsString()
  @IsNotEmpty()
  kind: RuleGroupKind

  @ApiPropertyOptional({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Parent group id',
    nullable: true,
  })
  @IsOptional()
  @IsUUID()
  @IsString()
  parentGroupId?: string | null

  @ApiPropertyOptional({
    example: 0,
    description: 'Sort order index',
    minimum: 0,
    type: [Number],
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  orderIndex?: number

  @ApiPropertyOptional({
    description: 'Token metadata. Required when kind is token',
    nullable: true,
    oneOf: [
      { $ref: getSchemaPath(ColorTokenMetadataDto) },
      { $ref: getSchemaPath(TypographyTokenMetadataDto) },
      { $ref: getSchemaPath(RadiusTokenMetadataDto) },
      { $ref: getSchemaPath(ShadowTokenMetadataDto) },
      { type: 'null' },
    ],
  })
  @IsOptional()
  @ValidateIf((o) => o.metadata !== null && o.metadata !== undefined)
  @ValidateNested()
  @Type(() => Object)
  metadata?:
    | ColorTokenMetadataDto
    | TypographyTokenMetadataDto
    | RadiusTokenMetadataDto
    | ShadowTokenMetadataDto
    | null

  @ValidateIf((o) => o.kind === 'token')
  @IsNotEmpty({
    message: "metadata is required when kind is 'token'",
  })
  metadataRequiredCheck?: any
}

@ApiExtraModels(
  ColorTokenMetadataDto,
  TypographyTokenMetadataDto,
  RadiusTokenMetadataDto,
  ShadowTokenMetadataDto,
)
export class UpdateRuleGroupBaseDto {
  @ApiPropertyOptional({
    example: 'Colors',
    description: 'Rule group name',
    type: [String],
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name?: string

  @ApiPropertyOptional({
    example: 'Core color tokens',
    description: 'Rule group description',
    type: [String],
    maxLength: 1000,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string | null

  @ApiPropertyOptional({
    example: 'token',
    description: 'Rule group kind',
    enum: RULE_GROUP_KINDS,
  })
  @IsOptional()
  @IsEnum(RULE_GROUP_KINDS)
  @IsString()
  kind?: RuleGroupKind

  @ApiPropertyOptional({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Parent group id',
    nullable: true,
  })
  @IsOptional()
  @IsUUID()
  @IsString()
  parentGroupId?: string | null

  @ApiPropertyOptional({
    description: 'Token metadata',
    nullable: true,
    oneOf: [
      { $ref: getSchemaPath(ColorTokenMetadataDto) },
      { $ref: getSchemaPath(TypographyTokenMetadataDto) },
      { $ref: getSchemaPath(RadiusTokenMetadataDto) },
      { $ref: getSchemaPath(ShadowTokenMetadataDto) },
      { type: 'null' },
    ],
  })
  @IsOptional()
  @ValidateIf((o) => o.metadata !== null && o.metadata !== undefined)
  @ValidateNested()
  @Type(() => Object)
  metadata?:
    | ColorTokenMetadataDto
    | TypographyTokenMetadataDto
    | RadiusTokenMetadataDto
    | ShadowTokenMetadataDto
    | null

  @ApiPropertyOptional({
    example: 0,
    description: 'Sort order index',
    minimum: 0,
    type: [Number],
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  orderIndex?: number

  @ApiPropertyOptional({
    example: true,
    description: 'Rule group enabled flag',
    type: [Boolean],
  })
  @IsOptional()
  @IsBoolean()
  enabled?: boolean
}

export class UpdateRuleGroupDto extends PartialType(UpdateRuleGroupBaseDto) {
  @IsNotEmptyBody({
    message: 'At least one field must be provided',
  })
  dummy?: any
}
