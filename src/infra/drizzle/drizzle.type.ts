import type { ExtractTablesWithRelations } from 'drizzle-orm'
import type {
  NodePgDatabase,
  NodePgQueryResultHKT,
} from 'drizzle-orm/node-postgres'
import type { PgTransaction } from 'drizzle-orm/pg-core'
import { type db } from '~/infra/drizzle/client'
import type * as schema from '~/infra/drizzle/schemas'

export type Tx = PgTransaction<
  NodePgQueryResultHKT,
  typeof schema,
  ExtractTablesWithRelations<typeof schema>
>

export type Database = typeof db | NodePgDatabase<typeof schema>
