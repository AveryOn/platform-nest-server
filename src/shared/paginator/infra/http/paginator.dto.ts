import { Type } from 'class-transformer'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsInt, IsOptional, Min, Max } from 'class-validator'

export class PaginationDto {
  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page = 1

  @ApiPropertyOptional({ default: 20, maximum: 100 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit = 20
}

export class PaginationMetaDto {
  @ApiProperty({ example: 1 })
  page: number

  @ApiProperty({ example: 20 })
  limit: number

  @ApiProperty({ example: 200 })
  total: number

  @ApiProperty({ example: 10 })
  totalPages: number
}

export class PaginatedResponse<T> {
  @ApiProperty({ isArray: true })
  data: T[]

  @ApiProperty({ type: PaginationMetaDto })
  paginator: PaginationMetaDto
}
