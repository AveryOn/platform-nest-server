import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger'
import { Transform, Type } from 'class-transformer'
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator'
import { IsNotEmptyBody } from '~/shared/validators/object.validator'

export class SystemGetSampleQueryDto {
  @ApiPropertyOptional({
    example: 'test',
    description: 'Description',
  })
  @IsOptional()
  @IsString()
  search?: string

  @ApiPropertyOptional({
    example: 10,
    description: 'Description',
    maximum: 100,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Max(100)
  @Min(1)
  limit?: number

  @ApiPropertyOptional({
    example: true,
    description: 'Description',
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  active?: boolean

  @ApiPropertyOptional({
    example: ['a', 'b'],
    type: [String],
    description: 'Description',
  })
  @IsOptional()
  @Transform(({ value }) => (Array.isArray(value) ? value : value?.split(',')))
  tags?: string[]

  @ApiPropertyOptional({
    example: { key: 'exmaple' },
    description: 'Description',
  })
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? JSON.parse(value) : value))
  meta?: Record<string, any>
}

export class SystemGetSampleResponse {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'UUID',
  })
  @IsUUID()
  @IsString()
  id: string

  @ApiProperty({
    example: 'Example',
    description: 'Name of the sample',
  })
  @IsString()
  name: string

  @ApiProperty({
    example: 42,
    description: 'Count',
    maximum: 100,
    minimum: 1,
  })
  @IsNumber()
  @Max(100)
  @Min(1)
  count: number

  @ApiProperty({
    example: true,
    description: 'Is Enabled',
  })
  @IsBoolean()
  enabled: boolean

  @ApiProperty({
    example: ['one', 'two'],
    type: [String],
    description: 'Array of strings',
  })
  items: string[]

  @ApiProperty({
    example: { nested: { key: 'value' } },
    type: Object,
    description: 'Is Sample Object',
  })
  metadata: Record<string, any>
}

export class SystemPostSampleDto {
  @ApiProperty({
    example: 'Name',
    description: 'Description',
    type: [String],
  })
  @IsNotEmpty()
  @IsString()
  name: string

  @ApiProperty({
    example: 10,
    description: 'Description',
    type: [Number],
  })
  @IsInt()
  @Max(100)
  @Min(0)
  @IsNotEmpty()
  quantity: number

  @ApiProperty({
    example: true,
    description: 'Description',
    type: [Boolean],
  })
  @IsBoolean()
  @IsNotEmpty()
  enabled: boolean
}

export class SystemPostSampleResponse {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Description',
  })
  id: string

  @ApiProperty({
    example: 'example name',
    description: 'Description',
  })
  name: string

  @ApiProperty({
    example: 10,
    description: 'Description',
  })
  quantity: number

  @ApiProperty({
    example: true,
    description: 'Description',
  })
  enabled: boolean

  @ApiProperty({
    example: '2026-02-25T21:30:00.000Z',
    description: 'Description',
  })
  @IsDate()
  createdAt: string
}

export class SystemPatchSampleBaseDto {
  @ApiProperty({
    example: 'example name',
    description: 'Description',
    type: [String],
  })
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiProperty({
    example: 42,
    description: 'Description',
    type: [Number],
  })
  @IsNotEmpty()
  @IsInt()
  @Max(100)
  @Min(0)
  quantity: number

  @ApiProperty({
    example: true,
    description: 'Description',
    type: [Boolean],
  })
  @IsBoolean()
  @IsNotEmpty()
  enabled: boolean
}

export class SystemPatchSampleDto extends PartialType(SystemPatchSampleBaseDto) {
  @IsNotEmptyBody({
    message: 'At least one field must be provided',
  })
  /** dummy will not actually be used, but triggers validation for an empty request body */
  dummy?: any
}

export class SystemPatchSampleResponse {
  @ApiProperty({
    enum: ['success', 'failed'],
    default: 'success',
    example: 'success',
  })
  @IsEnum(['success', 'failed'])
  @IsString()
  @IsNotEmpty()
  status: 'success' | 'failed'
}
