import { pgTable, integer, jsonb, uniqueIndex, index } from 'drizzle-orm/pg-core'
import { templatesTable } from '~/infra/drizzle/schemas'
import { id, createdAt, referenceOn } from '~/infra/drizzle/drizzle.helpers'

export const templateSnapshotsTable = pgTable(
  'template_snapshots',
  {
    id: id(),
    templateId: referenceOn('template_id', () => templatesTable).notNull(),
    version: integer('version').notNull(),
    payload: jsonb('payload').notNull(),
    createdAt: createdAt(),
  },
  (table) => [
    uniqueIndex('ts_t_version_unique').on(table.templateId, table.version),
    index('ts_t_idx').on(table.templateId),
  ],
)
