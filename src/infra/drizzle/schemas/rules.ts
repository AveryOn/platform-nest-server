import { isNull } from 'drizzle-orm'
import {
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  uniqueIndex,
} from 'drizzle-orm/pg-core'

import {
  createdAt,
  deletedAt,
  description,
  id,
  name,
  referenceOnUUID,
  updatedAt,
} from '~/infra/drizzle/application/drizzle.helpers'
import { projectsTable, ruleGroupsTable } from '~/infra/drizzle/schemas'

export const ruleScopeEnum = pgEnum('rule_scope', ['template', 'project'])

export const rulesTable = pgTable(
  'rules',
  {
    id: id(),
    projectId: referenceOnUUID('project_id', () => projectsTable),
    ruleGroupId: referenceOnUUID(
      'rule_group_id',
      () => ruleGroupsTable,
    ).notNull(),
    scope: ruleScopeEnum('scope').default('project').notNull(),
    orderIndex: integer('order_index').notNull(),
    name: name(),
    description: description(),
    metadata: jsonb('metadata'),
    body: text('body').notNull(),

    createdAt: createdAt(),
    updatedAt: updatedAt(),
    deletedAt: deletedAt(),
  },
  (t) => [
    uniqueIndex('rules_group_order_unique')
      .on(t.ruleGroupId, t.orderIndex)
      .where(isNull(t.deletedAt)),

    index('rules_group_order_idx').on(t.ruleGroupId, t.orderIndex),

    index('rules_project_idx').on(t.projectId),
  ],
)

export type RuleScopeKey = (typeof ruleScopeEnum.enumValues)[number]

export const RuleScope: Record<RuleScopeKey, RuleScopeKey> = {
  project: 'project',
  template: 'template',
} as const
