import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common'
import { Pool } from 'pg'
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres'
import * as schema from '~/infra/drizzle/schemas'
import { env } from '~/core/env'
import { AppLoggerService } from '~/core/logger/logger.service'

@Injectable()
export class DrizzleService implements OnModuleInit, OnModuleDestroy {
  private pool: Pool
  db: NodePgDatabase<typeof schema>

  constructor(private readonly logger: AppLoggerService) {
    this.pool = new Pool({ connectionString: env.DATABASE_URL })
    this.db = drizzle(this.pool, { schema })
  }

  async onModuleInit() {
    this.logger.debug('CONNECT TO DATABASE', { scope: 'DrizzleConnect' })
    const client = await this.pool.connect()
    client.release()
  }

  async onModuleDestroy() {
    this.logger.debug('DISCONNECT FROM DATABASE', { scope: 'DrizzleDisconnect' })
    await this.pool.end()
  }
}