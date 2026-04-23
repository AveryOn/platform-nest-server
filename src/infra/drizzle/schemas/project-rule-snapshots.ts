import {
  index,
  integer,
  jsonb,
  pgTable,
  uniqueIndex,
} from 'drizzle-orm/pg-core'
import {
  createdAt,
  id,
  referenceOnUUID,
  varchar64,
} from '~/infra/drizzle/drizzle.helpers'
import { projectsTable } from '~/infra/drizzle/schemas'

export const projectRuleSnapshotsTable = pgTable(
  'project_rule_snapshots',
  {
    id: id(),
    projectId: referenceOnUUID(
      'project_id',
      () => projectsTable,
    ).notNull(),
    version: integer('version').notNull(),
    payload: jsonb('payload').notNull(),
    hash: varchar64('hash').notNull(),
    createdAt: createdAt(),
  },
  (t) => [
    uniqueIndex('p_r_snapshots_p_ver_unique').on(
      t.projectId,
      t.version,
    ),
    index('p_r_snapshots_p_idx').on(t.projectId),
  ],
)
