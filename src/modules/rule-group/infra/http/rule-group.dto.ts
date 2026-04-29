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
import {
  RuleGroupScope,
  RuleGroupType,
  type RuleGroupMetadata,
} from '~/modules/rule-group/application/rule-group.type'
import { OperationStatus } from '~/shared/const/app.const'
import { IsNotEmptyBody } from '~/shared/validators/object.validator'

export class RuleGroupCreateDto {
  @ApiProperty({
    example: 'Button',
    description: 'Rule group name',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  name: string

  @ApiPropertyOptional({
    example: 'Rules for button component',
    description: 'Optional rule group description',
    nullable: true,
    type: String,
  })
  @IsOptional()
  @ValidateIf((_, value) => value !== null)
  @IsString()
  description?: string | null

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
  metadata?: RuleGroupMetadata

  @ApiProperty({
    example: RuleGroupType.component,
    default: RuleGroupType.section,
    description: 'Rule group semantic type',
    enum: RuleGroupType,
    type: String,
    nullable: true,
  })
  @IsOptional()
  @ValidateIf((_, value) => value !== null)
  @IsString()
  @IsEnum(RuleGroupType)
  type?: RuleGroupType | null

  @ApiPropertyOptional({
    example: '8fd2dbff-e5e7-4781-b22c-b17d061ee8d7',
    description: 'Parent rule group UUID. Null means root group',
    format: 'uuid',
    nullable: true,
    type: String,
  })
  @IsOptional()
  @ValidateIf((_, value) => value !== null)
  @IsString()
  @IsUUID()
  parentGroupId?: string | null

  @ApiProperty({
    example: 1,
    description: 'Order index within sibling list',
    minimum: 0,
    type: Number,
  })
  @IsNotEmpty()
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
  @ValidateIf((_, value) => value !== null)
  @IsString()
  description?: string | null

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
  metadata?: RuleGroupMetadata

  @ApiPropertyOptional({
    example: RuleGroupType.component,
    description: 'Updated rule group semantic type',
    enum: RuleGroupType,
    type: String,
  })
  @IsOptional()
  @IsString()
  @IsEnum(RuleGroupType)
  type?: RuleGroupType | null
}

export class RuleGroupPatchDto extends PartialType(
  RuleGroupPatchBaseDto,
) {
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
  @ValidateIf((_, value) => value !== null)
  @IsString()
  @IsUUID()
  parentGroupId: string | null

  @ApiProperty({
    example: 2,
    description: 'New order index within target sibling list',
    minimum: 0,
    type: Number,
  })
  @IsNotEmpty()
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
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  id: string

  @ApiProperty({
    example: 0,
    description: 'New order index',
    minimum: 0,
    type: Number,
  })
  @IsNotEmpty()
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
  @ValidateNested({
    each: true,
  })
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
  @ValidateNested({
    each: true,
  })
  @Type(() => RuleGroupReorderItemDto)
  items: RuleGroupReorderItemDto[]
}

export class RuleGroupItemRes {
  @ApiProperty({
    example: '5c0f7db5-cf42-4f0d-95a7-e8c0f2d96f0f',
    description: 'Rule group UUID',
    format: 'uuid',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  id: string

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Owner project UUID',
    format: 'uuid',
    nullable: true,
    type: String,
  })
  @IsOptional()
  @ValidateIf((_, value) => value !== null)
  @IsString()
  @IsUUID()
  projectId: string | null

  @ApiProperty({
    example: '8fd2dbff-e5e7-4781-b22c-b17d061ee8d7',
    description: 'Parent rule group UUID. Null means root group',
    format: 'uuid',
    nullable: true,
    type: String,
  })
  @IsOptional()
  @ValidateIf((_, value) => value !== null)
  @IsString()
  @IsUUID()
  parentGroupId: string | null

  @ApiProperty({
    example: 'Button',
    description: 'Rule group name',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  name: string

  @ApiProperty({
    example: 'Rules for button component',
    description: 'Rule group description',
    nullable: true,
    type: String,
  })
  @IsOptional()
  @ValidateIf((_, value) => value !== null)
  @IsString()
  description: string | null

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
  metadata?: RuleGroupMetadata

  @ApiProperty({
    example: RuleGroupScope.project,
    default: RuleGroupScope.project,
    description: 'Rule group scope',
    enum: RuleGroupScope,
    type: String,
    nullable: false,
  })
  @IsNotEmpty()
  @IsString()
  @IsEnum(RuleGroupScope)
  scope: RuleGroupScope

  @ApiProperty({
    example: RuleGroupType.component,
    description: 'Rule group semantic type',
    enum: RuleGroupType,
    type: String,
    nullable: true,
  })
  @IsOptional()
  @ValidateIf((_, value) => value !== null)
  @IsString()
  @IsEnum(RuleGroupType)
  type: RuleGroupType | null

  @ApiProperty({
    example: 1,
    description: 'Order index within sibling list',
    type: Number,
  })
  @IsNotEmpty()
  @IsNumber()
  orderIndex: number

  @ApiProperty({
    example: '2026-04-20T12:00:00.000Z',
    description: 'Creation timestamp in ISO-8601 format',
    format: 'date-time',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  @IsDateString()
  createdAt: string

  @ApiProperty({
    example: '2026-04-20T12:30:00.000Z',
    description: 'Update timestamp in ISO-8601 format',
    format: 'date-time',
    type: String,
    nullable: true,
  })
  @IsOptional()
  @ValidateIf((_, value) => value !== null)
  @IsString()
  @IsDateString()
  updatedAt: string | null
}

export class RuleGroupUpdateRes {
  @ApiProperty({
    example: OperationStatus.success,
    description: 'Archive operation status',
    enum: OperationStatus,
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  @IsEnum(OperationStatus)
  status: OperationStatus

  @ApiProperty({
    example: '5c0f7db5-cf42-4f0d-95a7-e8c0f2d96f0f',
    description: 'Affected rule group UUID',
    format: 'uuid',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  groupId: string
}

export class RuleGroupMoveRes {
  @ApiProperty({
    example: OperationStatus.success,
    description: 'Operation status',
    enum: OperationStatus,
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  @IsEnum(OperationStatus)
  status: OperationStatus

  @ApiProperty({
    example: '5c0f7db5-cf42-4f0d-95a7-e8c0f2d96f0f',
    description: 'Moved rule group UUID',
    format: 'uuid',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  groupId: string

  @ApiProperty({
    example: [
      '5c0f7db5-cf42-4f0d-95a7-e8c0f2d96f0f',
      '8fd2dbff-e5e7-4781-b22c-b17d061ee8d7',
    ],
    description: 'Affected rule group UUIDs',
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

export class RuleGroupReorderChildrenRes {
  @ApiProperty({
    example: OperationStatus.success,
    description: 'Operation status',
    enum: OperationStatus,
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  @IsEnum(OperationStatus)
  status: OperationStatus

  @ApiProperty({
    example: '5c0f7db5-cf42-4f0d-95a7-e8c0f2d96f0f',
    description: 'Parent rule group UUID',
    format: 'uuid',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  groupId: string

  @ApiProperty({
    example: [
      '5c0f7db5-cf42-4f0d-95a7-e8c0f2d96f0f',
      '8fd2dbff-e5e7-4781-b22c-b17d061ee8d7',
    ],
    description: 'Affected child rule group UUIDs',
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

export class RuleGroupReorderRootRes {
  @ApiProperty({
    example: OperationStatus.success,
    description: 'Operation status',
    enum: OperationStatus,
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  @IsEnum(OperationStatus)
  status: OperationStatus

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Project UUID',
    format: 'uuid',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  projectId: string

  @ApiProperty({
    example: [
      '5c0f7db5-cf42-4f0d-95a7-e8c0f2d96f0f',
      '8fd2dbff-e5e7-4781-b22c-b17d061ee8d7',
    ],
    description: 'Affected root rule group UUIDs',
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

export class RuleGroupDeleteRes {
  @ApiProperty({
    example: OperationStatus.success,
    description: 'Archive operation status',
    enum: OperationStatus,
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  @IsEnum(OperationStatus)
  status: OperationStatus

  @ApiProperty({
    example: '5c0f7db5-cf42-4f0d-95a7-e8c0f2d96f0f',
    description: 'Archived rule group UUID',
    format: 'uuid',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  groupId: string

  @ApiProperty({
    example: '2026-04-20T12:45:00.000Z',
    description: 'Archive timestamp in ISO-8601 format',
    format: 'date-time',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  @IsDateString()
  deletedAt: string
}
