import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { PartialType } from '@nestjs/mapped-types'
import { IsNotEmptyBody } from '~/shared/validators/object.validator'

export class CreateProjectDto {
  @ApiProperty({
    example: 'My Project',
    description: 'Project name',
    type: [String],
    maxLength: 255,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string

  @ApiPropertyOptional({
    example: 'Project description',
    description: 'Project description',
    type: [String],
    maxLength: 1000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string

  @ApiPropertyOptional({
    example: 'template-1',
    description: 'Template slug',
    type: [String],
  })
  @IsOptional()
  @IsString()
  templateSlug?: string
}

export class ProjectResponse {
  @ApiProperty({
    example: 'proj_01HXYZABC123DEF456GHI789JK',
    description: 'Project ID',
  })
  @IsString()
  id: string

  @ApiProperty({
    example: 'org_01HXYZABC123DEF456GHI789JK',
    description: 'Organization ID',
  })
  @IsString()
  organizationId: string

  @ApiProperty({
    example: 'UI Rules',
    description: 'Project name',
  })
  @IsString()
  name: string

  @ApiProperty({
    example: 'ui-rules',
    description: 'Project slug',
  })
  @IsString()
  slug: string

  @ApiProperty({
    example: 'Project for design system governance',
    description: 'Project description',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  description: string | null

  @ApiProperty({
    example: 'tsnap_01HXYZABC123DEF456GHI789JK',
    description: 'Template snapshot ID',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  templateSnapshotId: string | null

  @ApiProperty({
    example: '2026-03-20T12:00:00.000Z',
    description: 'Project creation date',
  })
  @IsDateString()
  createdAt: string

  @ApiProperty({
    example: '2026-03-20T12:30:00.000Z',
    description: 'Project update date',
  })
  @IsDateString()
  updatedAt: string

  @ApiProperty({
    example: null,
    description: 'Project deletion date',
    nullable: true,
  })
  @IsOptional()
  @IsDateString()
  deletedAt: string | null
}

export class UpdateProjectBaseDto {
  @ApiPropertyOptional({
    example: 'My Project',
    description: 'Project name',
    type: [String],
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  name?: string

  @ApiPropertyOptional({
    example: 'Project description',
    description: 'Project description (nullable)',
    type: [String],
    maxLength: 1000,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string | null
}

export class UpdateProjectDto extends PartialType(UpdateProjectBaseDto) {
  @IsNotEmptyBody({
    message: 'At least one field must be provided',
  })
  dummy?: any
}

export class DeleteProjectResponse {
  @ApiProperty({
    example: true,
    description: 'Success Flag',
    type: [Boolean],
  })
  @IsBoolean()
  success: boolean
}
