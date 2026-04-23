import type { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { type db } from '~/infra/drizzle/client'
import type * as schema from '~/infra/drizzle/schemas'

export type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0]

export type Database = typeof db | NodePgDatabase<typeof schema>
