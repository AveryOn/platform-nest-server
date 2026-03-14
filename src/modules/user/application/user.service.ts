import type { PaginatorServicePort } from '~/shared/paginator/ports/paginator.service.port'
import type { UserServicePort } from '~/modules/user/ports/user.service.port'
import { Inject, Injectable } from '@nestjs/common'
import { USER_REPOSITORY_PORT, type UserRepositoryPort } from '~/modules/user/ports/user.repository.port'
import { PAGINATOR_PORT } from '~/shared/paginator/ports/paginator.service.port'
import { FindUserInput, GetUsersInput, User } from '~/modules/user/application/user.types'
import { AppLoggerService } from '~/core/logger/logger.service'
import { PaginatedOutput } from '~/shared/paginator/application/paginator.types'
import { AppError, ERROR } from '~/core/error/app-error'
import { REDIS_PORT, type RedisServicePort } from '~/infra/redis/ports/redis.service.port'

@Injectable()
export class UserService implements UserServicePort {
  constructor (
    private readonly logger: AppLoggerService,
    @Inject(USER_REPOSITORY_PORT)
    private readonly userRepository: UserRepositoryPort,

    @Inject(PAGINATOR_PORT)
    private readonly paginator: PaginatorServicePort,

    @Inject(REDIS_PORT)
    private readonly redis: RedisServicePort,
  ) {}

  async getUsers(dto: GetUsersInput): Promise<PaginatedOutput<User>> {
    try {
      // await this.userRepository.getUsers(dto)
      this.redis.set('example:key:field', 'hello world', '66m')
      return {
        data: [],
        paginator: {
          limit: 1,
          page: 1,
          total: 200,
          totalPages: 200,
        }
      }
    } catch (err) {
      console.error(err)
      throw new AppError(ERROR.UNKNOWN, this.logger)
    }
  }

  async find(input: FindUserInput): Promise<User> {

    this.logger.info('FindUserInput', { context: { input } })

    return {
      id: 'asd',
      email: 'ex@ex.ex',
      firstName: 'Alex',
      lastName: 'Mercer',
      createdAt: new Date().toISOString(),
      updatedAt: null,
      deletedAt: null,
      phoneNumber: null,
    }
  }
}
