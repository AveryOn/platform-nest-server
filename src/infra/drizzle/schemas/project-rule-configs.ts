import {
  index,
  pgEnum,
  pgTable,
  uniqueIndex,
} from 'drizzle-orm/pg-core'

import {
  createdAt,
  id,
  referenceOnUUID,
  updatedAt,
} from '~/infra/drizzle/drizzle.helpers'
import { projectsTable, rulesTable } from '~/infra/drizzle/schemas'

export const projectRuleConfigStatusEnum = pgEnum(
  'project_rule_config_status',
  ['active', 'hidden'],
)

export const projectRuleConfigsTable = pgTable(
  'project_rule_configs',
  {
    id: id(),
    projectId: referenceOnUUID(
      'project_id',
      () => projectsTable,
    ).notNull(),
    ruleId: referenceOnUUID('rule_id', () => rulesTable).notNull(),
    status: projectRuleConfigStatusEnum('status')
      .default('active')
      .notNull(),
    replacedBy: referenceOnUUID('replaced_by', () => rulesTable),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [
    uniqueIndex('prc_project_rule_unique').on(t.projectId, t.ruleId),
    index('prc_project_status_idx').on(t.projectId, t.status),
  ],
)
