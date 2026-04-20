import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsInt, IsOptional, Max, Min } from 'class-validator'

export class PaginationDto {
  @ApiPropertyOptional({ default: 1, type: Number })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page = 1

  @ApiPropertyOptional({ default: 20, maximum: 100, type: Number })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit = 20
}

export class PaginationMetaDto {
  @ApiProperty({ example: 1, type: Number })
  page: number

  @ApiProperty({ example: 20, type: Number })
  limit: number

  @ApiProperty({ example: 200, type: Number })
  total: number

  @ApiProperty({ example: 10, type: Number })
  totalPages: number
}

export class PaginatedResponse<T> {
  @ApiProperty({ isArray: true })
  data: T[]

  @ApiProperty({ type: PaginationMetaDto })
  paginator: PaginationMetaDto
}
