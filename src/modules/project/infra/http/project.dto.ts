import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator'
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
