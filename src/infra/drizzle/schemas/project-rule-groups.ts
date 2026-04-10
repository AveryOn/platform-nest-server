import { index, pgEnum, pgTable, uniqueIndex } from 'drizzle-orm/pg-core'
import { referenceOnUUID } from '~/infra/drizzle/drizzle.helpers'
import { projectsTable, ruleGroupsTable } from '~/infra/drizzle/schemas'

export const projectRuleGroupStatusEnum = pgEnum('project_rule_group_status', ['active', 'hidden'])

export const projectRuleGroupsTable = pgTable(
  'project_rule_groups',
  {
    projectId: referenceOnUUID('project_id', () => projectsTable).notNull(),
    ruleGroupId: referenceOnUUID('rule_group_id', () => ruleGroupsTable).notNull(),
    status: projectRuleGroupStatusEnum('status').default('active').notNull(),
  },
  (t) => [
    uniqueIndex('prg_pg_unique').on(t.projectId, t.ruleGroupId),
    index('prg_p_status_idx').on(t.projectId, t.status),
  ],
)
