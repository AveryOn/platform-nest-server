import { sql } from 'drizzle-orm'
import {
  index,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core'

import {
  createdAt,
  id,
  name,
  referenceOnText,
  referenceOnUUID,
  varchar64,
} from '~/infra/drizzle/application/drizzle.helpers'
import {
  brandsTable,
  organizations,
  projectsTable,
  users,
} from '~/infra/drizzle/schemas'
import { _ } from '~/shared/const/app.const'

export const apiKeyStatusEnum = pgEnum('api_key_status_enum', [
  'ACTIVE',
  'REVOKED',
])

export const apiKeysTable = pgTable(
  'api_keys',
  {
    id: id(),
    name: name(),
    brandId: referenceOnUUID('brand_id', () => brandsTable, _, {
      onDelete: 'restrict',
    }).notNull(),
    projectId: referenceOnUUID('project_id', () => projectsTable, _, {
      onDelete: 'cascade',
    }),
    organizationId: referenceOnText(
      'organization_id',
      () => organizations,
      _,
      { onDelete: 'cascade' },
    ).notNull(),
    createdByUserId: referenceOnText(
      'created_by_user_id',
      () => users,
      _,
      {
        onDelete: 'cascade',
      },
    ).notNull(),
    keyHash: text('key_hash').notNull(),
    keyPrefix: varchar64('key_prefix').notNull(),
    scopes: jsonb('scopes')
      .$type<string[]>()
      .notNull()
      .default(
        sql`'["ruleset:read","snapshot:read","project:read"]'::jsonb`,
      ),
    status: apiKeyStatusEnum('status').default('ACTIVE').notNull(),
    lastUsedIp: varchar64('last_used_ip'),
    lastUsedUa: text('last_used_ua'),

    expiresAt: timestamp('expires_at', { withTimezone: true }),
    createdAt: createdAt(),
    lastUsedAt: timestamp('last_used_at', {
      withTimezone: true,
    }).defaultNow(),
    revokedAt: timestamp('revoked_at', { withTimezone: true }),
  },
  (t) => [
    uniqueIndex('api_key_hash_uidx').on(t.keyHash),
    uniqueIndex('api_key_name_org_uidx').on(t.name, t.organizationId),

    index('api_key_key_prefix_idx').on(t.keyPrefix),
    index('api_key_created_by_user_id_idx').on(t.createdByUserId),
    index('api_key_org_brand_idx').on(t.organizationId, t.brandId),
    index('api_key_project_org_brand_idx').on(
      t.projectId,
      t.organizationId,
      t.brandId,
    ),
    index('api_key_status_idx').on(t.status),
  ],
)
