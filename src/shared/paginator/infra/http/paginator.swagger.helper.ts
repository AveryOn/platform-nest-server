import { applyDecorators, HttpStatus, type Type } from '@nestjs/common'
import {
  ApiExtraModels,
  ApiQuery,
  ApiResponse,
  getSchemaPath,
} from '@nestjs/swagger'
import { DECORATORS } from '@nestjs/swagger/dist/constants'
import { PaginationMetaDto } from '~/shared/paginator/infra/http/paginator.dto'

function createApiQueriesFromDto(dto: Type<any>) {
  const properties =
    Reflect.getMetadata(
      DECORATORS.API_MODEL_PROPERTIES_ARRAY,
      dto.prototype,
    ) ?? []

  return properties.map((propertyKey: string) => {
    const name = propertyKey.replace(':', '')

    const metadata =
      Reflect.getMetadata(
        DECORATORS.API_MODEL_PROPERTIES,
        dto.prototype,
        name,
      ) ?? {}

    return ApiQuery({
      name,
      required: metadata.required ?? false,
      type: metadata.type ?? String,
      description: metadata.description,
      example: metadata.example,
      schema: {
        default: metadata.default,
        maximum: metadata.maximum,
        minimum: metadata.minimum,
      },
    })
  })
}

type ApiPaginatorOptions<
  TQuery extends Type<any>,
  TResponse extends Type<any>,
> = {
  query?: {
    type?: TQuery
  }
  response: {
    type: TResponse
    status?: HttpStatus
    description?: string
  }
}

export const ApiPaginator = <
  TQuery extends Type<any>,
  TResponse extends Type<any>,
>({
  query,
  response,
}: ApiPaginatorOptions<TQuery, TResponse>) =>
  applyDecorators(
    ...(query?.type ? createApiQueriesFromDto(query.type) : []),

    ApiExtraModels(response.type, PaginationMetaDto),
    ApiResponse({
      status: response.status ?? HttpStatus.OK,
      description: response.description,
      schema: {
        type: 'object',
        properties: {
          data: {
            type: 'array',
            items: {
              $ref: getSchemaPath(response.type),
            },
          },
          paginator: {
            $ref: getSchemaPath(PaginationMetaDto),
          },
        },
      },
    }),
  )
