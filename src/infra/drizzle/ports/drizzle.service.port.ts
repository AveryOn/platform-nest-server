import type { OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import type { NodePgDatabase } from 'drizzle-orm/node-postgres'
import type * as schema from '~/infra/drizzle/schemas'

export const DRIZZLE_PORT = Symbol('DRIZZLE_PORT')

export abstract class DrizzleServicePort
  implements OnModuleInit, OnModuleDestroy
{
  abstract db: NodePgDatabase<typeof schema>
  abstract onModuleDestroy(): Promise<void>
  abstract onModuleInit(): Promise<void>
}
