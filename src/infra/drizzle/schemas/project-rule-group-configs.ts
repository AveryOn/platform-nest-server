import { index, pgEnum, pgTable, uniqueIndex } from 'drizzle-orm/pg-core'

import {
  createdAt,
  id,
  referenceOnUUID,
  updatedAt,
} from '~/infra/drizzle/application/drizzle.helpers'
import { projectsTable, ruleGroupsTable } from '~/infra/drizzle/schemas'

export const projectRuleGroupConfigStatus = pgEnum(
  'project_rule_group_config_status',
  ['active', 'hidden'],
)

export const projectRuleGroupConfigsTable = pgTable(
  'project_rule_group_configs',
  {
    id: id(),
    projectId: referenceOnUUID(
      'project_id',
      () => projectsTable,
    ).notNull(),
    ruleGroupId: referenceOnUUID(
      'rule_group_id',
      () => ruleGroupsTable,
    ).notNull(),
    status: projectRuleGroupConfigStatus('status')
      .default('active')
      .notNull(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [
    uniqueIndex('prgc_project_rule_group_unique').on(
      t.projectId,
      t.ruleGroupId,
    ),
    index('prgc_project_status_idx').on(t.projectId, t.status),
  ],
)
