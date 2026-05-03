import { brandsTable, projectsTable } from '~/infra/drizzle/schemas'
import { DEV_SEED } from './dev-seed.const'

export async function seedDomain(db: any) {
  await db
    .insert(brandsTable)
    .values([
      {
        id: DEV_SEED.brands.brandA.id,
        name: DEV_SEED.brands.brandA.name,
        organizationId: DEV_SEED.orgA.id,
      },
      {
        id: DEV_SEED.brands.brandB.id,
        name: DEV_SEED.brands.brandB.name,
        organizationId: DEV_SEED.orgB.id,
      },
    ])
    .onConflictDoNothing()

  await db
    .insert(projectsTable)
    .values([
      {
        id: DEV_SEED.projects.projectA.id,
        name: DEV_SEED.projects.projectA.name,
        description: DEV_SEED.projects.projectA.description,
        slug: DEV_SEED.projects.projectA.slug,
        brandId: DEV_SEED.brands.brandA.id,
        organizationId: DEV_SEED.orgA.id,
        templateSnapshotId: null,
      },
      {
        id: DEV_SEED.projects.projectB.id,
        name: DEV_SEED.projects.projectB.name,
        description: DEV_SEED.projects.projectB.description,
        slug: DEV_SEED.projects.projectB.slug,
        brandId: DEV_SEED.brands.brandB.id,
        organizationId: DEV_SEED.orgB.id,
        templateSnapshotId: null,
      },
    ])
    .onConflictDoNothing()
}
