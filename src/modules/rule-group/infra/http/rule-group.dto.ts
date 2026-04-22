import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator'
import {
  RuleGroupType,
  type RuleGroupTypeKey,
} from '~/modules/rule-group/application/rule-group.type'
import { IsNotEmptyBody } from '~/shared/validators/object.validator'

export class RuleGroupCreateDto {
  @ApiProperty({
    example: 'Button',
    description: 'Rule group name',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiPropertyOptional({
    example: 'Rules for button component',
    description: 'Optional rule group description',
    nullable: true,
    type: String,
  })
  @IsOptional()
  @IsString()
  description?: string

  @ApiPropertyOptional({
    example: 'component',
    description: 'Rule group semantic type',
    enum: RuleGroupType,
    default: RuleGroupType.section,
    type: String,
  })
  @IsOptional()
  @IsEnum(RuleGroupType)
  type?: RuleGroupTypeKey

  @ApiPropertyOptional({
    example: '8fd2dbff-e5e7-4781-b22c-b17d061ee8d7',
    description: 'Parent rule group UUID. Null means root group',
    format: 'uuid',
    nullable: true,
    type: String,
  })
  @IsOptional()
  @IsUUID()
  parentGroupId?: string

  @ApiProperty({
    example: 1,
    description: 'Order index within sibling list',
    minimum: 0,
    type: Number,
  })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  orderIndex: number
}

export class RuleGroupPatchBaseDto {
  @ApiPropertyOptional({
    example: 'Button v2',
    description: 'Updated rule group name',
    type: String,
  })
  @IsOptional()
  @IsString()
  name?: string

  @ApiPropertyOptional({
    example: 'Updated description',
    description: 'Updated rule group description',
    nullable: true,
    type: String,
  })
  @IsOptional()
  @IsString()
  description?: string

  @ApiPropertyOptional({
    example: 'component',
    description: 'Updated rule group semantic type',
    enum: RuleGroupType,
    type: String,
  })
  @IsOptional()
  @IsEnum(RuleGroupType)
  type?: RuleGroupTypeKey
}

export class RuleGroupPatchDto extends PartialType(RuleGroupPatchBaseDto) {
  @IsNotEmptyBody({
    message: 'At least one field must be provided',
  })
  dummy?: any
}

export class RuleGroupMoveDto {
  @ApiPropertyOptional({
    example: '8fd2dbff-e5e7-4781-b22c-b17d061ee8d7',
    description: 'New parent rule group UUID. Null means move to root',
    format: 'uuid',
    nullable: true,
    type: String,
  })
  @IsOptional()
  @IsUUID()
  parentGroupId?: string

  @ApiProperty({
    example: 2,
    description: 'New order index within target sibling list',
    minimum: 0,
    type: Number,
  })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  orderIndex: number
}

export class RuleGroupReorderItemDto {
  @ApiProperty({
    example: '5c0f7db5-cf42-4f0d-95a7-e8c0f2d96f0f',
    description: 'Rule group UUID',
    format: 'uuid',
    type: String,
  })
  @IsUUID()
  id: string

  @ApiProperty({
    example: 0,
    description: 'New order index',
    minimum: 0,
    type: Number,
  })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  orderIndex: number
}

export class RuleGroupReorderChildrenDto {
  @ApiProperty({
    type: () => RuleGroupReorderItemDto,
    isArray: true,
    description: 'Ordered list of direct child rule groups',
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => RuleGroupReorderItemDto)
  items: RuleGroupReorderItemDto[]
}

export class RuleGroupReorderRootDto {
  @ApiProperty({
    type: () => RuleGroupReorderItemDto,
    isArray: true,
    description: 'Ordered list of root rule groups in project',
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => RuleGroupReorderItemDto)
  items: RuleGroupReorderItemDto[]
}

export class RuleGroupItemResponseDto {
  @ApiProperty({
    example: '5c0f7db5-cf42-4f0d-95a7-e8c0f2d96f0f',
    description: 'Rule group UUID',
    format: 'uuid',
    type: String,
  })
  id: string

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Owner project UUID',
    format: 'uuid',
    type: String,
  })
  projectId: string

  @ApiProperty({
    example: '8fd2dbff-e5e7-4781-b22c-b17d061ee8d7',
    description: 'Parent rule group UUID. Null means root group',
    format: 'uuid',
    nullable: true,
    type: String,
  })
  parentGroupId: string | null

  @ApiProperty({
    example: 'Button',
    description: 'Rule group name',
    type: String,
  })
  name: string

  @ApiProperty({
    example: 'Rules for button component',
    description: 'Rule group description',
    nullable: true,
    type: String,
  })
  description: string | null

  @ApiProperty({
    example: 'component',
    description: 'Rule group semantic type',
    enum: RuleGroupType,
    type: String,
  })
  type: RuleGroupType

  @ApiProperty({
    example: 1,
    description: 'Order index within sibling list',
    type: Number,
  })
  orderIndex: number

  @ApiProperty({
    example: '2026-04-20T12:00:00.000Z',
    description: 'Creation timestamp in ISO-8601 format',
    format: 'date-time',
    type: String,
  })
  createdAt: string

  @ApiProperty({
    example: '2026-04-20T12:30:00.000Z',
    description: 'Update timestamp in ISO-8601 format',
    format: 'date-time',
    type: String,
  })
  updatedAt: string
}

export class RuleGroupUpdateResponseDto {
  @ApiProperty({
    example: 'success',
    description: 'Operation status',
    enum: ['success', 'failed'],
    type: String,
  })
  status: string

  @ApiProperty({
    example: '5c0f7db5-cf42-4f0d-95a7-e8c0f2d96f0f',
    description: 'Affected rule group UUID',
    format: 'uuid',
    type: String,
  })
  groupId: string
}

export class RuleGroupRemoveResponseDto {
  @ApiProperty({
    example: 'success',
    description: 'Archive operation status',
    enum: ['success', 'failed'],
    type: String,
  })
  status: string

  @ApiProperty({
    example: '5c0f7db5-cf42-4f0d-95a7-e8c0f2d96f0f',
    description: 'Archived rule group UUID',
    format: 'uuid',
    type: String,
  })
  groupId: string

  @ApiProperty({
    example: '2026-04-20T12:45:00.000Z',
    description: 'Archive timestamp in ISO-8601 format',
    format: 'date-time',
    type: String,
  })
  archivedAt: string
}
