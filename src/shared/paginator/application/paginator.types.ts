export type ConfigPaginatorInput = { page: number; limit: number }
export type ConfigPaginatorData = { skip: number; take: number }

export type ResponsePaginatorInput<T> = { data: T; total: number }
export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface PaginatedOutput<T> {
  data: T[]
  paginator: PaginationMeta
}
