import { integer, jsonb, pgTable, uniqueIndex } from 'drizzle-orm/pg-core'

import {
  createdAt,
  deletedAt,
  description,
  id,
  name,
  referenceOn,
  updatedAt,
} from '~/infra/drizzle/drizzle.helpers'
import { ruleGroupsTable } from './rule-groups'

export const rules = pgTable(
  'rules',
  {
    id: id(),
    ruleGroupId: referenceOn('rule_group_id', () => ruleGroupsTable).notNull(),
    orderIndex: integer('order_index').notNull(),
    name: name(),
    description: description(),
    metadata: jsonb('metadata'),
    body: jsonb('body').notNull(),

    createdAt: createdAt(),
    updatedAt: updatedAt(),
    deletedAt: deletedAt(),
  },
  (t) => [uniqueIndex('rules_group_order_unique').on(t.ruleGroupId, t.orderIndex)],
)
