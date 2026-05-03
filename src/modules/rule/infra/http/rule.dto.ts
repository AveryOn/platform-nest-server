import {
  ApiProperty,
  ApiPropertyOptional,
  PartialType,
} from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateIf,
  ValidateNested,
} from 'class-validator'
import { RuleScope } from '~/modules/rule/application/rule.type'
import { OperationStatus } from '~/shared/const/app.const'
import { IsNotEmptyBody } from '~/shared/validators/object.validator'

export class RuleCreateDto {
  @ApiPropertyOptional({
    example: 'When to use',
    description: 'Required rule name',
    type: String,
    nullable: false,
  })
  @IsNotEmpty()
  @IsString()
  name: string

  @ApiProperty({
    example: 'Use button for primary actions.',
    description: 'Rule body content. Markdown/text supported',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  body: string

  @ApiPropertyOptional({
    example: {
      tags: ['button', 'usage'],
      target: 'ui',
    },
    description: 'Optional flexible metadata payload',
    type: Object,
    nullable: true,
  })
  @IsOptional()
  @ValidateIf((_, value) => value !== null)
  @IsObject()
  metadata?: Record<string, unknown> | null

  @ApiProperty({
    example: 1,
    description: 'Order index within rule group',
    type: Number,
    minimum: 0,
  })
  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  orderIndex: number
}

export class RulePatchBaseDto {
  @ApiPropertyOptional({
    example: 'When to use',
    description: 'Updated rule name',
    type: String,
  })
  @IsOptional()
  @IsString()
  name?: string

  @ApiPropertyOptional({
    example: 'Use button for primary actions.',
    description: 'Updated rule body content',
    type: String,
  })
  @IsOptional()
  @IsString()
  body?: string

  @ApiPropertyOptional({
    example: {
      tags: ['button', 'usage'],
      target: 'ui',
    },
    description: 'Updated flexible metadata payload',
    type: Object,
    nullable: true,
  })
  @IsOptional()
  @ValidateIf((_, value) => value !== null)
  @IsObject()
  metadata?: Record<string, unknown> | null
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
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  targetGroupId: string

  @ApiProperty({
    example: 2,
    description: 'New order index inside target group',
    type: Number,
    minimum: 0,
  })
  @IsNotEmpty()
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
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  id: string

  @ApiProperty({
    example: 0,
    description: 'New order index',
    type: Number,
    minimum: 0,
  })
  @IsNotEmpty()
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
  @ValidateNested({
    each: true,
  })
  @Type(() => RuleReorderItemDto)
  items: RuleReorderItemDto[]
}

export class RuleItemRes {
  @ApiProperty({
    example: 'b9cbfc46-f42f-4a9c-9e5f-d3d5b88d9ec7',
    description: 'Rule UUID',
    type: String,
    format: 'uuid',
  })
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  id: string

  @ApiProperty({
    example: '8fd2dbff-e5e7-4781-b22c-b17d061ee8d7',
    description: 'Owner rule group UUID',
    type: String,
    format: 'uuid',
  })
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  ruleGroupId: string

  @ApiProperty({
    example: '8fd2dbff-e5e7-4781-b22c-b17d061ee8d7',
    description: 'Owner project UUID',
    type: String,
    format: 'uuid',
    nullable: true,
  })
  @IsOptional()
  @ValidateIf((_, value) => value !== null)
  @IsString()
  @IsUUID()
  projectId: string | null

  @ApiProperty({
    example: 'When to use',
    description: 'Rule name',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  name: string

  @ApiProperty({
    example: RuleScope.project,
    description: 'Scope of rule',
    type: String,
    enum: [RuleScope.project, RuleScope.template],
  })
  @IsNotEmpty()
  @IsString()
  @IsEnum(RuleScope)
  scope: RuleScope

  @ApiProperty({
    example: 'Use button for primary actions.',
    description: 'Rule body content',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  body: string

  @ApiProperty({
    example: {
      tags: ['button', 'usage'],
      target: 'ui',
    },
    description: 'Flexible metadata payload',
    type: Object,
    nullable: true,
  })
  @IsOptional()
  @ValidateIf((_, value) => value !== null)
  @IsObject()
  metadata: Record<string, unknown> | null

  @ApiProperty({
    example: 1,
    description: 'Order index inside rule group',
    type: Number,
  })
  @IsNotEmpty()
  @IsNumber()
  orderIndex: number

  @ApiProperty({
    example: '2026-04-20T12:00:00.000Z',
    description: 'Creation timestamp in ISO-8601 format',
    type: String,
    format: 'date-time',
  })
  @IsNotEmpty()
  @IsString()
  @IsDateString()
  createdAt: string

  @ApiProperty({
    example: '2026-04-20T12:30:00.000Z',
    description: 'Update timestamp in ISO-8601 format',
    type: String,
    format: 'date-time',
    nullable: true,
  })
  @IsOptional()
  @ValidateIf((_, value) => value !== null)
  @IsString()
  @IsDateString()
  updatedAt: string | null
}

export class RuleDeleteRes {
  @ApiProperty({
    example: 'success',
    description: 'Archive operation status',
    type: String,
    enum: [OperationStatus.success, OperationStatus.failed],
  })
  @IsNotEmpty()
  @IsString()
  @IsEnum(OperationStatus)
  status: OperationStatus

  @ApiProperty({
    example: 'b9cbfc46-f42f-4a9c-9e5f-d3d5b88d9ec7',
    description: 'Archived rule UUID',
    type: String,
    format: 'uuid',
  })
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  ruleId: string

  @ApiProperty({
    example: '2026-04-20T12:45:00.000Z',
    description: 'Archive timestamp in ISO-8601 format',
    type: String,
    format: 'date-time',
  })
  @IsNotEmpty()
  @IsString()
  @IsDateString()
  deletedAt: string
}

export class RuleUpdateRes {
  @ApiProperty({
    example: OperationStatus.success,
    description: 'Operation status',
    type: String,
    enum: [OperationStatus.success, OperationStatus.failed],
  })
  @IsNotEmpty()
  @IsString()
  @IsEnum(OperationStatus)
  status: OperationStatus

  @ApiProperty({
    example: 'b9cbfc46-f42f-4a9c-9e5f-d3d5b88d9ec7',
    description: 'Affected rule UUID',
    type: String,
    format: 'uuid',
  })
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  ruleId: string
}

export class RuleMoveRes {
  @ApiProperty({
    example: OperationStatus.success,
    description: 'Operation status',
    type: String,
    enum: [OperationStatus.success, OperationStatus.failed],
  })
  @IsNotEmpty()
  @IsString()
  @IsEnum(OperationStatus)
  status: OperationStatus

  @ApiProperty({
    example: 'b9cbfc46-f42f-4a9c-9e5f-d3d5b88d9ec7',
    description: 'Moved rule UUID',
    type: String,
    format: 'uuid',
  })
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  ruleId: string

  @ApiProperty({
    example: [
      'b9cbfc46-f42f-4a9c-9e5f-d3d5b88d9ec7',
      'c5e51f0c-36aa-43e2-9e18-57c1f1e3d5e1',
    ],
    description: 'Affected rule UUIDs',
    type: String,
    isArray: true,
    format: 'uuid',
  })
  @IsArray()
  @IsNotEmpty({ each: true })
  @IsString({ each: true })
  @IsUUID(undefined, { each: true })
  affectedIds: string[]
}

export class RuleReorderInGroupRes {
  @ApiProperty({
    example: OperationStatus.success,
    description: 'Operation status',
    type: String,
    enum: [OperationStatus.success, OperationStatus.failed],
  })
  @IsNotEmpty()
  @IsString()
  @IsEnum(OperationStatus)
  status: OperationStatus

  @ApiProperty({
    example: '8fd2dbff-e5e7-4781-b22c-b17d061ee8d7',
    description: 'Rule group UUID',
    type: String,
    format: 'uuid',
  })
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  groupId: string

  @ApiProperty({
    example: [
      'b9cbfc46-f42f-4a9c-9e5f-d3d5b88d9ec7',
      'c5e51f0c-36aa-43e2-9e18-57c1f1e3d5e1',
    ],
    description: 'Affected rule UUIDs',
    type: String,
    isArray: true,
    format: 'uuid',
  })
  @IsArray()
  @IsNotEmpty({ each: true })
  @IsString({ each: true })
  @IsUUID(undefined, { each: true })
  affectedIds: string[]
}
