import {
  applyDecorators,
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor,
  Type,
} from '@nestjs/common'
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger'
import { map, Observable } from 'rxjs'
import { PaginationMetaDto } from '~/shared/paginator/infra/http/paginator.dto'

@Injectable()
export class JsonResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const http = context.switchToHttp()
    const res = http.getResponse()

    return next.handle().pipe(
      map((data) => {
        // If the response was sent manually
        if (res.headersSent) return data

        // the response with pagination object
        if ('data' in data && 'paginator' in data) {
          return data
        }

        // не трогаем если это не объект
        if (typeof data !== 'object' || data === null) return data

        return { data }
      }),
    )
  }
}

/**
 * Swagger decorator for describing a standard response
 * wrapped by the global JsonResponseInterceptor.
 *
 * Final HTTP contract:
 *
 * {
 *   data: T
 * }
 *
 * Where T is the model passed to the decorator.
 *
 * Used for endpoints that return a single object
 * (not a paginated result).
 *
 * @param model DTO class describing the structure of the data field.
 */
export const ApiDataResponse = <TModel extends Type<any>>({
  type,
  description,
  status,
  paginated,
}: {
  type: TModel
  status?: HttpStatus
  description?: string
  paginated?: boolean
}) =>
  applyDecorators(
    ApiExtraModels(type, PaginationMetaDto),
    ApiResponse({
      description,
      status: status ? status : HttpStatus.OK,
      schema: paginated
        ? {
            type: 'object',
            properties: {
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(type) },
              },
              paginator: {
                $ref: getSchemaPath(PaginationMetaDto),
              },
            },
          }
        : {
            type: 'object',
            properties: {
              data: { $ref: getSchemaPath(type) },
            },
          },
    }),
  )
