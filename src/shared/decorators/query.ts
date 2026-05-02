import {
  applyDecorators,
  BadRequestException,
  Query,
  type Type,
  ValidationPipe,
} from '@nestjs/common'
import { ApiQuery, type ApiQueryOptions } from '@nestjs/swagger'

/**
 * Creates a validated query parameter decorator for the provided DTO model.
 *
 * Applies transformation, whitelist filtering, forbidden-field rejection,
 * and returns a normalized BadRequestException on validation failure.
 *
 * @example
 * ```ts
 * export class GetApiKeysQueryDto {
 *   @IsOptional()
 *   @IsUUID()
 *   brandId?: string
 *
 *   @IsOptional()
 *   @IsUUID()
 *   projectId?: string
 * }
 *
 * @Get()
 * findAll(
 *   @ValidQuery(GetApiKeysQueryDto)
 *   query: GetApiKeysQueryDto,
 * ) {
 *   return this.apiKeyService.findAll(query)
 * }
 * ```
 */
export const ValidQuery = <T extends Type<any>>(model: T) =>
  Query(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      expectedType: model,
      exceptionFactory: (errors) => {
        return new BadRequestException({
          message: 'Validation failed',
          errors,
        })
      },
    }),
  )

/**
 * Applies multiple Swagger query decorators to a single route handler.
 *
 * @example
 * ```ts
 * @ApiQueries([
 *   {
 *     name: 'brandId',
 *     required: false,
 *     type: String,
 *     description: 'Filter API keys by brand UUID',
 *   },
 *   {
 *     name: 'projectId',
 *     required: false,
 *     type: String,
 *     description: 'Filter API keys by project UUID',
 *   },
 * ])
 * @Get()
 * findAll() {}
 * ```
 */
export function ApiQueries(queries: ApiQueryOptions[]): MethodDecorator {
  return applyDecorators(...queries.map((query) => ApiQuery(query)))
}
