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
} from '~/infra/drizzle/application/drizzle.helpers'
import { templatesTable } from '~/infra/drizzle/schemas'

export const templateSnapshotsTable = pgTable(
  'template_snapshots',
  {
    id: id(),
    templateId: referenceOnUUID(
      'template_id',
      () => templatesTable,
    ).notNull(),
    version: integer('version').notNull(),
    payload: jsonb('payload').notNull(),
    hash: varchar64('hash').notNull(),
    createdAt: createdAt(),
  },
  (t) => [
    uniqueIndex('ts_t_version_unique').on(t.templateId, t.version),
    index('ts_t_idx').on(t.templateId),
  ],
)
