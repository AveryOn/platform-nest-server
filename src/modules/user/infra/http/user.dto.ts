import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator'
import { SWAGGER_EXAMPLES } from '~/shared/const/swagger.const'
import { WithPaginationQuery } from '~/shared/paginator/infra/http/paginator-factory.helper'

export class GetUserResponse {
  @ApiProperty({
    example: SWAGGER_EXAMPLES.uuid,
    description: 'Identification of user',
  })
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  id: string

  @ApiProperty({ example: SWAGGER_EXAMPLES.email, description: 'User Email' })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string

  @ApiPropertyOptional({
    example: SWAGGER_EXAMPLES.firstName,
    description: 'User firstname',
  })
  @IsString()
  @IsOptional()
  firstName: string | null

  @ApiPropertyOptional({
    example: SWAGGER_EXAMPLES.lastName,
    description: 'User lastname',
  })
  @IsString()
  @IsOptional()
  lastName: string | null

  @ApiPropertyOptional({
    example: SWAGGER_EXAMPLES.phoneNumber,
    description: 'User phone number',
  })
  @IsString()
  @IsOptional()
  phoneNumber: string | null

  @ApiProperty({
    example: SWAGGER_EXAMPLES.dateISO,
    description: 'Date of creation row',
  })
  @IsDate()
  @IsNotEmpty()
  createdAt: string

  @ApiProperty({
    example: SWAGGER_EXAMPLES.dateISO,
    description: 'Date of updation row',
  })
  @IsDate()
  @IsOptional()
  updatedAt: string | null

  @ApiProperty({ example: null, description: 'Date of deletion row' })
  @IsDate()
  @IsOptional()
  deletedAt: string | null
}

export class UserQueryDto extends WithPaginationQuery() {
  @ApiPropertyOptional({
    example: SWAGGER_EXAMPLES.firstName,
    description: 'User name',
  })
  @IsString()
  @IsOptional()
  name?: string
}

export class FindUserDto {
  @ApiPropertyOptional({
    example: SWAGGER_EXAMPLES.email,
    description: 'User Email',
  })
  @IsString()
  @IsEmail()
  @IsOptional()
  email?: string

  @ApiPropertyOptional({
    example: SWAGGER_EXAMPLES.uuid,
    description: 'User ID',
  })
  @IsUUID()
  @IsString()
  @IsOptional()
  id?: string
}
