import { index, pgTable, uniqueIndex } from 'drizzle-orm/pg-core'
import {
    createdAt,
    id,
    name,
    referenceOnText,
    updatedAt,
} from '~/infra/drizzle/application/drizzle.helpers'
import { organizations } from '~/infra/drizzle/schemas'
import { _ } from '~/shared/const/app.const'

export const brandsTable = pgTable(
  'brands',
  {
    id: id(),
    name: name(),
    organizationId: referenceOnText(
      'organization_id',
      () => organizations,
      _,
      {
        onDelete: 'cascade',
      },
    ),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [
    index('brands_organization_id_idx').on(t.organizationId),
    uniqueIndex('brands_organization_id_title_uidx').on(
      t.organizationId,
      t.name,
    ),
  ],
)
