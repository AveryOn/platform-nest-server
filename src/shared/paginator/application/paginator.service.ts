import z from 'zod'
import { Injectable } from '@nestjs/common'
import { AppError, ERROR } from '~/core/error/app-error'
import { AppLoggerService } from '~/core/logger/logger.service'
import {
  ConfigPaginatorInput,
  ConfigPaginatorData,
  PaginationMeta,
  ResponsePaginatorInput,
} from '~/shared/paginator/application/paginator.types'
import { PaginatorServicePort } from '~/shared/paginator/ports/paginator.service.port'

const numCheck = (num: number, min = 1) =>
  z.number().min(min).safeParse(num)

@Injectable()
export class PaginatorService implements PaginatorServicePort {
  protected page: number = 0
  protected limit: number = 0

  constructor(private readonly logger: AppLoggerService) {}

  /**
   * Sets the `page` and `limit` parameters for pagination
   * @returns Returns `skip` and `take` values for data retrieval via ORM
   * */
  public config({
    limit,
    page,
  }: ConfigPaginatorInput): ConfigPaginatorData {
    this.page = page
    this.limit = limit

    if (!numCheck(this.page).success || !numCheck(this.limit).success) {
      throw new AppError(ERROR.INVALID_DATA, this.logger).log('', {
        scope: 'paginator.BuildConfig',
        context: {
          page: this.page,
          limit: this.limit,
        },
      })
    }

    const skip = (page - 1) * limit
    const take = limit

    if (!numCheck(skip, 0).success || !numCheck(take).success) {
      throw new AppError(ERROR.INVALID_DATA, this.logger).log('', {
        scope: 'paginator.BuildConfig',
        context: {
          skip,
          take,
        },
      })
    }

    return {
      skip,
      take,
    }
  }

  /** Prepares the response for the paginator */
  public response<T>({
    data,
    total,
  }: ResponsePaginatorInput<T>): PaginationMeta {
    const totalPages = Math.ceil(total / this.limit)

    if (!data || !Array.isArray(data)) {
      throw new AppError(ERROR.INVALID_DATA, this.logger).log(
        '`data` must be an Array>',
        {
          context: {
            data,
          },
          scope: 'paginator.Response',
        },
      )
    }
    if (!numCheck(totalPages, 0).success) {
      throw new AppError(ERROR.INVALID_DATA, this.logger).log('', {
        scope: 'paginator.Response',
        context: {
          totalPages,
        },
      })
    }

    const meta = {
      page: this.page,
      limit: this.limit,
      total: total,
      totalPages: totalPages,
    }
    this.close()
    return meta
  }

  /** Clears the memory of the class instance */
  private close() {
    this.limit = 0
    this.page = 0
  }
}
