import type { PrismaService } from '~/infra/prisma/prisma.service'
import type { AuthRepository } from '~/modules/auth/auth.repository'

export class PrismaAuthRepository implements AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(email: string): Promise<boolean> {
    await this.prisma.user.create({
      data: { email },
    })
    return true
  }

  async findByEmail(email: string) {
    await Promise.resolve()
    return { id: '1', email } // stub
  }
}
