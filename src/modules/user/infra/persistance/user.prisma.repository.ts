import { Inject, Injectable } from '@nestjs/common'
import type { PaginatorServicePort } from '~/shared/paginator/ports/paginator.service.port'
import { PrismaService } from '~/infra/prisma/prisma.service'
import { UserRepositoryPort } from '~/modules/user/ports/user.repository.port'
import { User } from '~/modules/user/application/user.types'
import { PAGINATOR_PORT } from '~/shared/paginator/ports/paginator.service.port'

@Injectable()
export class UserPrismaRepository implements UserRepositoryPort {
  constructor(
    private readonly prisma: PrismaService,

    @Inject(PAGINATOR_PORT)
    private readonly paginator: PaginatorServicePort,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      omit: { password: true } // exclude password from output
    })
    return user
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      omit: { password: true } // exclude password from output
    })
    return user
  }
}
