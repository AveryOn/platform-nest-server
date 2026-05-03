import {
  members,
  organizations,
  sessions,
  users,
} from '~/infra/drizzle/schemas'
import { DEV_SEED } from './dev-seed.const'

export async function seedAuth(db: any) {
  const now = new Date()
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)

  await db
    .insert(users)
    .values([
      {
        id: DEV_SEED.users.owner.id,
        name: DEV_SEED.users.owner.name,
        email: DEV_SEED.users.owner.email,
        emailVerified: true,
        image: null,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: DEV_SEED.users.member.id,
        name: DEV_SEED.users.member.name,
        email: DEV_SEED.users.member.email,
        emailVerified: true,
        image: null,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: DEV_SEED.users.noMember.id,
        name: DEV_SEED.users.noMember.name,
        email: DEV_SEED.users.noMember.email,
        emailVerified: true,
        image: null,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: DEV_SEED.users.otherOrg.id,
        name: DEV_SEED.users.otherOrg.name,
        email: DEV_SEED.users.otherOrg.email,
        emailVerified: true,
        image: null,
        createdAt: now,
        updatedAt: now,
      },
    ])
    .onConflictDoNothing()

  await db
    .insert(organizations)
    .values([
      {
        id: DEV_SEED.orgA.id,
        name: DEV_SEED.orgA.name,
        slug: DEV_SEED.orgA.slug,
        logo: null,
        createdAt: now,
        metadata: null,
      },
      {
        id: DEV_SEED.orgB.id,
        name: DEV_SEED.orgB.name,
        slug: DEV_SEED.orgB.slug,
        logo: null,
        createdAt: now,
        metadata: null,
      },
    ])
    .onConflictDoNothing()

  await db
    .insert(members)
    .values([
      {
        id: DEV_SEED.members.owner.id,
        organizationId: DEV_SEED.orgA.id,
        userId: DEV_SEED.users.owner.id,
        role: 'owner',
        createdAt: now,
      },
      {
        id: DEV_SEED.members.member.id,
        organizationId: DEV_SEED.orgA.id,
        userId: DEV_SEED.users.member.id,
        role: 'member',
        createdAt: now,
      },
      {
        id: DEV_SEED.members.otherOrg.id,
        organizationId: DEV_SEED.orgB.id,
        userId: DEV_SEED.users.otherOrg.id,
        role: 'owner',
        createdAt: now,
      },
    ])
    .onConflictDoNothing()

  await db
    .insert(sessions)
    .values([
      {
        id: DEV_SEED.sessions.owner.id,
        token: DEV_SEED.sessions.owner.token,
        userId: DEV_SEED.users.owner.id,
        activeOrganizationId: DEV_SEED.orgA.id,
        expiresAt,
        ipAddress: null,
        userAgent: 'dev-seed',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: DEV_SEED.sessions.member.id,
        token: DEV_SEED.sessions.member.token,
        userId: DEV_SEED.users.member.id,
        activeOrganizationId: DEV_SEED.orgA.id,
        expiresAt,
        ipAddress: null,
        userAgent: 'dev-seed',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: DEV_SEED.sessions.noMember.id,
        token: DEV_SEED.sessions.noMember.token,
        userId: DEV_SEED.users.noMember.id,
        activeOrganizationId: null,
        expiresAt,
        ipAddress: null,
        userAgent: 'dev-seed',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: DEV_SEED.sessions.otherOrg.id,
        token: DEV_SEED.sessions.otherOrg.token,
        userId: DEV_SEED.users.otherOrg.id,
        activeOrganizationId: DEV_SEED.orgB.id,
        expiresAt,
        ipAddress: null,
        userAgent: 'dev-seed',
        createdAt: now,
        updatedAt: now,
      },
    ])
    .onConflictDoNothing()
}
