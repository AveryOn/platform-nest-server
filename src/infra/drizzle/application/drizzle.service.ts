import { Inject, Injectable } from '@nestjs/common'
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import { env } from '~/core/env'
import { LOGGER_PORT } from '~/core/logger/logger.port'
import { AppLoggerService } from '~/core/logger/logger.service'
import * as schema from '~/infra/drizzle/schemas'
import type { DrizzleServicePort } from '../ports/drizzle.service.port'

@Injectable()
export class DrizzleService implements DrizzleServicePort {
  private pool: Pool
  db: NodePgDatabase<typeof schema>

  constructor(
    @Inject(LOGGER_PORT)
    private readonly logger: AppLoggerService,
  ) {
    this.pool = new Pool({
      connectionString: env.DATABASE_URL,
    })
    this.db = drizzle(this.pool, { schema })
  }

  async onModuleInit() {
    this.logger.debug('CONNECT TO DATABASE', {
      scope: 'DrizzleConnect',
    })
    const client = await this.pool.connect()
    client.release()
  }

  async onModuleDestroy() {
    this.logger.debug('DISCONNECT FROM DATABASE', {
      scope: 'DrizzleDisconnect',
    })
    await this.pool.end()
  }
}
