import { IntersectionType } from '@nestjs/swagger'
import { PaginationDto, } from '~/shared/paginator/infra/http/paginator.dto'


export class MockDto {}

export function WithPaginationQuery() {
  return IntersectionType(MockDto, PaginationDto)
}
