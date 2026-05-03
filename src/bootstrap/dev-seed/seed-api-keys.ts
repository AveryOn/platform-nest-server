import { createHash } from 'node:crypto'

import { apiKeysTable } from '~/infra/drizzle/schemas'
import { DEV_SEED } from './dev-seed.const'

function hashApiKey(raw: string) {
  return createHash('sha256').update(raw).digest('hex')
}

export async function seedApiKeys(db: any) {
  await db
    .insert(apiKeysTable)
    .values([
      {
        id: DEV_SEED.apiKeys.readOnly.id,
        name: DEV_SEED.apiKeys.readOnly.name,
        brandId: DEV_SEED.brands.brandA.id,
        projectId: DEV_SEED.projects.projectA.id,
        organizationId: DEV_SEED.orgA.id,
        createdByUserId: DEV_SEED.users.owner.id,
        keyHash: hashApiKey(DEV_SEED.apiKeys.readOnly.raw),
        keyPrefix: DEV_SEED.apiKeys.readOnly.prefix,
        mode: 'READ_ONLY',
        scopes: [
          'project:read',
          'ruleset:read',
          'snapshot:read',
          'snapshot:payload:read',
          'export:read',
        ],
        status: 'ACTIVE',
        expiresAt: null,
        revokedAt: null,
      },
      {
        id: DEV_SEED.apiKeys.writable.id,
        name: DEV_SEED.apiKeys.writable.name,
        brandId: DEV_SEED.brands.brandA.id,
        projectId: DEV_SEED.projects.projectA.id,
        organizationId: DEV_SEED.orgA.id,
        createdByUserId: DEV_SEED.users.owner.id,
        keyHash: hashApiKey(DEV_SEED.apiKeys.writable.raw),
        keyPrefix: DEV_SEED.apiKeys.writable.prefix,
        mode: 'WRITABLE',
        scopes: [
          'project:read',
          'ruleset:read',
          'snapshot:read',
          'snapshot:payload:read',
          'export:read',
          'project:write',
          'rule-group:write',
          'rule:write',
          'snapshot:write',
          'export:write',
        ],
        status: 'ACTIVE',
        expiresAt: null,
        revokedAt: null,
      },
      {
        id: DEV_SEED.apiKeys.revoked.id,
        name: DEV_SEED.apiKeys.revoked.name,
        brandId: DEV_SEED.brands.brandA.id,
        projectId: DEV_SEED.projects.projectA.id,
        organizationId: DEV_SEED.orgA.id,
        createdByUserId: DEV_SEED.users.owner.id,
        keyHash: hashApiKey(DEV_SEED.apiKeys.revoked.raw),
        keyPrefix: DEV_SEED.apiKeys.revoked.prefix,
        mode: 'READ_ONLY',
        scopes: [
          'project:read',
          'ruleset:read',
          'snapshot:read',
          'snapshot:payload:read',
          'export:read',
        ],
        status: 'REVOKED',
        expiresAt: null,
        revokedAt: new Date(),
      },
    ])
    .onConflictDoNothing()
}
