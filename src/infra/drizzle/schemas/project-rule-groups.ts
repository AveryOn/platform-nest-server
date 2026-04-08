import { pgTable, index, uniqueIndex, pgEnum } from 'drizzle-orm/pg-core'
import { projectsTable, ruleGroupsTable } from '~/infra/drizzle/schemas'
import { referenceOn } from '~/infra/drizzle/drizzle.helpers'

export const projectRuleGroupStatusEnum = pgEnum('project_rule_group_status', ['active', 'hidden'])

export const projectRuleGroupsTable = pgTable(
  'project_rule_groups',
  {
    projectId: referenceOn('project_id', () => projectsTable).notNull(),
    ruleGroupId: referenceOn('rule_group_id', () => ruleGroupsTable).notNull(),
    status: projectRuleGroupStatusEnum('status').default('active').notNull(),
  },
  (t) => [
    uniqueIndex('prg_pg_unique').on(t.projectId, t.ruleGroupId),
    index('prg_p_status_idx').on(t.projectId, t.status),
  ],
)
