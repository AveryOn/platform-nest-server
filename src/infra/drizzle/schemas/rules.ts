import { integer, jsonb, pgTable, text, uniqueIndex } from 'drizzle-orm/pg-core'

import {
  createdAt,
  deletedAt,
  description,
  id,
  name,
  referenceOnUUID,
  updatedAt,
} from '~/infra/drizzle/drizzle.helpers'
import { ruleGroupsTable } from '~/infra/drizzle/schemas/rule-groups'

export const rulesTable = pgTable(
  'rules',
  {
    id: id(),
    ruleGroupId: referenceOnUUID('rule_group_id', () => ruleGroupsTable).notNull(),
    orderIndex: integer('order_index').notNull(),
    name: name(),
    description: description(),
    metadata: jsonb('metadata'),
    body: text('body').notNull(),

    createdAt: createdAt(),
    updatedAt: updatedAt(),
    deletedAt: deletedAt(),
  },
  (t) => [uniqueIndex('rules_group_order_unique').on(t.ruleGroupId, t.orderIndex)],
)
