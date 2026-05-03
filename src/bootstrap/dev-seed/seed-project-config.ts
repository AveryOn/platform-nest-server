import {
  projectRuleConfigsTable,
  projectRuleGroupConfigsTable,
} from '~/infra/drizzle/schemas'
import { DEV_SEED } from './dev-seed.const'

export async function seedProjectConfig(db: any) {
  await db
    .insert(projectRuleGroupConfigsTable)
    .values({
      projectId: DEV_SEED.projects.projectA.id,
      ruleGroupId: DEV_SEED.ruleGroups.buttonAccessibility,
      status: 'hidden',
    })
    .onConflictDoNothing()

  await db
    .insert(projectRuleConfigsTable)
    .values({
      projectId: DEV_SEED.projects.projectA.id,
      ruleId: DEV_SEED.rules.colorContrast,
      status: 'hidden',
      replacedBy: null,
    })
    .onConflictDoNothing()
}
