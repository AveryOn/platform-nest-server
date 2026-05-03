import { ApiProperty } from '@nestjs/swagger'
import {
  IsDateString,
  IsNotEmpty,
  IsString,
  IsUUID,
  ValidateIf,
} from 'class-validator'
import { SWAGGER_EXAMPLES } from '~/shared/const/swagger.const'

export class BrandCreateDto {
  @ApiProperty({
    example: 'Main Brand',
    description: 'Human-readable brand name',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  name: string
}

export class BrandItemRes {
  @ApiProperty({
    example: SWAGGER_EXAMPLES.uuid,
    description: 'Brand UUID',
    format: 'uuid',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  id: string

  @ApiProperty({
    example: 'Main Brand',
    description: 'Brand name',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  name: string

  @ApiProperty({
    example: SWAGGER_EXAMPLES.betterAuthId,
    description: 'Organization identifier',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  organizationId: string

  @ApiProperty({
    example: SWAGGER_EXAMPLES.dateISO,
    description: 'Brand creation timestamp in ISO-8601 format',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  @IsDateString()
  createdAt: string

  @ApiProperty({
    example: SWAGGER_EXAMPLES.dateISO,
    description: 'Brand update timestamp in ISO-8601 format',
    type: String,
    nullable: true,
  })
  @ValidateIf((_, value) => value !== null)
  @IsString()
  @IsDateString()
  updatedAt: string | null
}
