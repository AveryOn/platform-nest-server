import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator'
import { ProjectConfigStatus } from '~/modules/project-config/application/project-config.type'
import { IsNotEmptyBody } from '~/shared/validators/object.validator'

export class ProjectRuleGroupConfigPatchDto {
  @ApiProperty({
    example: true,
    description: 'Whether the rule group is active in project context',
    type: Boolean,
    nullable: false,
  })
  @IsNotEmptyBody()
  @Type(() => Boolean)
  @IsBoolean()
  isActive: boolean
}

export class ProjectRuleConfigPatchDto {
  @ApiProperty({
    example: true,
    description: 'Whether the rule is active in project context',
    type: Boolean,
    nullable: false,
  })
  @IsNotEmptyBody()
  @Type(() => Boolean)
  @IsBoolean()
  isActive: boolean
}

export class ProjectRuleGroupConfigRes {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Project UUID',
    type: String,
    format: 'uuid',
  })
  @IsString()
  projectId: string

  @ApiProperty({
    example: '8fd2dbff-e5e7-4781-b22c-b17d061ee8d7',
    description: 'Rule group UUID',
    type: String,
    format: 'uuid',
  })
  @IsString()
  ruleGroupId: string

  @ApiProperty({
    example: true,
    description: 'Whether the rule group is active in project context',
    type: Boolean,
  })
  @IsBoolean()
  isActive: boolean

  @ApiProperty({
    example: ProjectConfigStatus.active,
    description: 'Config status',
    type: String,
    enum: ProjectConfigStatus,
  })
  @IsEnum(ProjectConfigStatus)
  status: ProjectConfigStatus

  @ApiProperty({
    example: '2026-04-20T12:45:00.000Z',
    description: 'Update timestamp in ISO-8601 format',
    type: String,
    format: 'date-time',
  })
  @IsOptional()
  @ValidateIf((_, value) => value !== null)
  @IsString()
  updatedAt: string | null
}

export class ProjectRuleConfigRes {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Project UUID',
    type: String,
    format: 'uuid',
  })
  @IsString()
  projectId: string

  @ApiProperty({
    example: 'b9cbfc46-f42f-4a9c-9e5f-d3d5b88d9ec7',
    description: 'Rule UUID',
    type: String,
    format: 'uuid',
  })
  @IsString()
  ruleId: string

  @ApiProperty({
    example: true,
    description: 'Whether the rule is active in project context',
    type: Boolean,
  })
  @IsBoolean()
  isActive: boolean

  @ApiProperty({
    example: ProjectConfigStatus.active,
    description: 'Config status',
    type: String,
    enum: ProjectConfigStatus,
  })
  @IsString()
  @IsEnum(ProjectConfigStatus)
  status: ProjectConfigStatus

  @ApiProperty({
    example: '2026-04-20T12:45:00.000Z',
    description: 'Update timestamp in ISO-8601 format',
    type: String,
    format: 'date-time',
  })
  @IsOptional()
  @ValidateIf((_, value) => value !== null)
  @IsString()
  updatedAt: string | null
}
