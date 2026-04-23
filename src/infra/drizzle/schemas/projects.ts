import { index, pgTable, text, uniqueIndex } from 'drizzle-orm/pg-core'

import {
  createdAt,
  deletedAt,
  description,
  id,
  name,
  referenceOnText,
  referenceOnUUID,
  updatedAt,
} from '~/infra/drizzle/drizzle.helpers'
import {
  brandsTable,
  organizations,
  templateSnapshotsTable,
} from '~/infra/drizzle/schemas'
import { _ } from '~/shared/const/app.const'

export const projectsTable = pgTable(
  'projects',
  {
    id: id(),
    name: name(),
    description: description(),
    slug: text('slug').notNull(),
    brandId: referenceOnUUID('brand_id', () => brandsTable, _, {
      onDelete: 'set null',
    }),
    organizationId: referenceOnText(
      'organization_id',
      () => organizations,
      undefined,
      {
        onDelete: 'cascade',
      },
    ).notNull(),
    templateSnapshotId: referenceOnUUID(
      'template_snapshot_id',
      () => templateSnapshotsTable,
    ),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
    deletedAt: deletedAt(),
  },
  (t) => [
    uniqueIndex('projects_slug_unique').on(t.slug, t.brandId),
    index('projects_organization_deleted_idx').on(
      t.organizationId,
      t.deletedAt,
    ),
    index('projects_template_snapshot_idx').on(t.templateSnapshotId),
  ],
)
