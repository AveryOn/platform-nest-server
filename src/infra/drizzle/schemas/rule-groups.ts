import { isNull } from 'drizzle-orm'
import {
  foreignKey,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  uniqueIndex,
  uuid,
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
import { projectsTable } from '~/infra/drizzle/schemas'

export const ruleGroupScopeEnum = pgEnum('rule_group_scope', [
  'template',
  'project',
])

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
    projectId: referenceOnUUID('project_id', () => projectsTable),
    parentGroupId: uuid('parent_group_id'),
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
    foreignKey({
      columns: [t.parentGroupId],
      foreignColumns: [t.id],
      name: 'rule_groups_parent_group_id_fkey',
    }),

    uniqueIndex('rule_groups_project_parent_order_unique')
      .on(t.projectId, t.parentGroupId, t.orderIndex)
      .where(isNull(t.deletedAt)),

    index('rule_groups_project_parent_order_idx').on(
      t.projectId,
      t.parentGroupId,
      t.orderIndex,
    ),
  ],
)

export type RuleGroupScopeKey =
  (typeof ruleGroupScopeEnum.enumValues)[number]
export type RuleGroupTypeKey =
  (typeof ruleGroupTypeEnum.enumValues)[number]

export const RuleGroupScope: Record<
  RuleGroupScopeKey,
  RuleGroupScopeKey
> = {
  project: 'project',
  template: 'template',
} as const

export const RuleGroupType: Record<RuleGroupTypeKey, RuleGroupTypeKey> = {
  category: 'category',
  component: 'component',
  section: 'section',
  token: 'token',
  variant: 'variant',
} as const
