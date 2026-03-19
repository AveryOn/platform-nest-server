import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { env } from '~/core/env'
import { AppLoggerService } from '~/core/logger/logger.service'

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(private readonly logger: AppLoggerService) {
    const adapter = new PrismaPg({
      connectionString: env.DATABASE_URL,
    })
    super({ adapter })
  }

  async onModuleInit() {
    this.logger.debug('CONNECT TO DATABASE', { scope: 'PrismaConnect' })
    await this.$connect()
  }

  async onModuleDestroy() {
    await this.$disconnect()
  }
}
