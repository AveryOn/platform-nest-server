import { index, integer, jsonb, pgTable, uniqueIndex } from 'drizzle-orm/pg-core'

import { projectsTable } from '~/infra/drizzle/schemas'
import { pgEnum } from 'drizzle-orm/pg-core'
import {
  deletedAt,
  id,
  updatedAt,
  createdAt,
  referenceOn,
  name,
  description,
} from '~/infra/drizzle/drizzle.helpers'

export const ruleGroupScopeEnum = pgEnum('rule_group_scope', ['template', 'project'])

export const ruleGroupTypeEnum = pgEnum('rule_group_type', [
  'category',
  'token',
  'section',
  'component',
  'variant',
])

export const ruleGroupsTable = pgTable(
  'rule_groups',
  {
    id: id(),
    projectId: referenceOn('project_id', () => projectsTable),
    parentGroupId: referenceOn('parent_group_id', () => ruleGroupsTable),
    scope: ruleGroupScopeEnum('scope').default('project').notNull(),
    name: name(),
    description: description(),
    orderIndex: integer('order_index').notNull(),
    type: ruleGroupTypeEnum('type'),
    metadata: jsonb('metadata'),

    createdAt: createdAt(),
    updatedAt: updatedAt(),
    deletedAt: deletedAt(),
  },
  (t) => [
    uniqueIndex('rule_groups_parent_order_unique').on(t.parentGroupId, t.orderIndex),
    index('rule_groups_project_parent_order_idx').on(t.projectId, t.parentGroupId, t.orderIndex),
  ],
)
