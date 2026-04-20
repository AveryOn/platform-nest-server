import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsBoolean, IsOptional } from 'class-validator'
import { IsNotEmptyBody } from '~/shared/validators/object.validator'

export enum ProjectConfigStatus {
  success = 'success',
  failed = 'failed',
}

export class ProjectRuleGroupConfigPatchBaseDto {
  @ApiPropertyOptional({
    example: false,
    description: 'Whether the rule group is hidden in project context',
    type: Boolean,
    nullable: true,
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isHidden?: boolean

  @ApiPropertyOptional({
    example: true,
    description: 'Whether the rule group is active in project context',
    type: Boolean,
    nullable: true,
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isActive?: boolean
}

export class ProjectRuleGroupConfigPatchDto extends PartialType(
  ProjectRuleGroupConfigPatchBaseDto,
) {
  @IsNotEmptyBody({
    message: 'At least one field must be provided',
  })
  dummy?: any
}

export class ProjectRuleConfigPatchBaseDto {
  @ApiPropertyOptional({
    example: false,
    description: 'Whether the rule is hidden in project context',
    type: Boolean,
    nullable: true,
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isHidden?: boolean

  @ApiPropertyOptional({
    example: true,
    description: 'Whether the rule is active in project context',
    type: Boolean,
    nullable: true,
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isActive?: boolean
}

export class ProjectRuleConfigPatchDto extends PartialType(ProjectRuleConfigPatchBaseDto) {
  @IsNotEmptyBody({
    message: 'At least one field must be provided',
  })
  dummy?: any
}

export class ProjectRuleGroupConfigResponseDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Project UUID',
    type: String,
    format: 'uuid',
  })
  projectId: string

  @ApiProperty({
    example: '8fd2dbff-e5e7-4781-b22c-b17d061ee8d7',
    description: 'Rule group UUID',
    type: String,
    format: 'uuid',
  })
  ruleGroupId: string

  @ApiProperty({
    example: false,
    description: 'Whether the rule group is hidden in project context',
    type: Boolean,
  })
  isHidden: boolean

  @ApiProperty({
    example: true,
    description: 'Whether the rule group is active in project context',
    type: Boolean,
  })
  isActive: boolean

  @ApiProperty({
    example: 'success',
    description: 'Operation status',
    type: String,
    enum: ProjectConfigStatus,
  })
  status: ProjectConfigStatus

  @ApiProperty({
    example: '2026-04-20T12:45:00.000Z',
    description: 'Update timestamp in ISO-8601 format',
    type: String,
    format: 'date-time',
  })
  updatedAt: string
}

export class ProjectRuleConfigResponseDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Project UUID',
    type: String,
    format: 'uuid',
  })
  projectId: string

  @ApiProperty({
    example: 'b9cbfc46-f42f-4a9c-9e5f-d3d5b88d9ec7',
    description: 'Rule UUID',
    type: String,
    format: 'uuid',
  })
  ruleId: string

  @ApiProperty({
    example: false,
    description: 'Whether the rule is hidden in project context',
    type: Boolean,
  })
  isHidden: boolean

  @ApiProperty({
    example: true,
    description: 'Whether the rule is active in project context',
    type: Boolean,
  })
  isActive: boolean

  @ApiProperty({
    example: 'success',
    description: 'Operation status',
    type: String,
    enum: ProjectConfigStatus,
  })
  status: ProjectConfigStatus

  @ApiProperty({
    example: '2026-04-20T12:45:00.000Z',
    description: 'Update timestamp in ISO-8601 format',
    type: String,
    format: 'date-time',
  })
  updatedAt: string
}
