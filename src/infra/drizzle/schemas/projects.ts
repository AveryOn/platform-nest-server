import { index, pgTable, text, uniqueIndex } from 'drizzle-orm/pg-core'

import { organizations } from './auth-schema'
import { templateSnapshotsTable } from '~/infra/drizzle/schemas'
import {
  deletedAt,
  id,
  updatedAt,
  createdAt,
  referenceOn,
  name,
  description,
} from '~/infra/drizzle/drizzle.helpers'

export const projectsTable = pgTable(
  'projects',
  {
    id: id(),
    name: name(),
    description: description(),
    slug: text('slug').notNull(),
    organizationId: referenceOn('organization_id', () => organizations).notNull(),
    templateSnapshotId: referenceOn('template_snapshot_id', () => templateSnapshotsTable),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
    deletedAt: deletedAt(),
  },
  (t) => [
    uniqueIndex('projects_slug_unique').on(t.slug),
    index('projects_organization_deleted_idx').on(t.organizationId, t.deletedAt),
    index('projects_template_snapshot_idx').on(t.templateSnapshotId),
  ],
)
