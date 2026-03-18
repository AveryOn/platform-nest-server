import { Inject, Injectable } from '@nestjs/common'
import type { PaginatorServicePort } from '~/shared/paginator/ports/paginator.service.port'
import { UserRepositoryPort } from '~/modules/user/ports/user.repository.port'
import { GetUsersInput, User } from '~/modules/user/application/user.types'
import { PAGINATOR_PORT } from '~/shared/paginator/ports/paginator.service.port'
import { DrizzleService } from '~/infra/drizzle/drizzle.service'
import { users } from '~/infra/drizzle/schemas'
import { eq } from 'drizzle-orm'
import { PaginatedOutput } from '~/shared/paginator/application/paginator.types'

@Injectable()
export class UserDrizzleRepository implements UserRepositoryPort {
  constructor(
    private readonly drizzle: DrizzleService,

    @Inject(PAGINATOR_PORT)
    private readonly paginator: PaginatorServicePort,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    
    const [user] = await this.drizzle.db
        .select()
        .from(users)
        .where(eq(users.email, email));
    return user
  }

  async findById(id: string): Promise<User | null> {
    const [user] = await this.drizzle.db
        .select()
        .from(users)
        .where(eq(users.id, id));
        
    console.debug('HELLO WORLD', { user })
    return user
  }

  async findMany(input: GetUsersInput): Promise<PaginatedOutput<User>> {
      return {
        data: [],
        paginator: {
            limit: 1,
            page: 1,
            total: 1,
            totalPages: 1,
        }
      }
  }
}
