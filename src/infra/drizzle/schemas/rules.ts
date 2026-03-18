import { sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

import { projects } from "./projects";
import { ruleGroups } from "./rule-groups";

export const rules = pgTable(
  "rules",
  {
    id: text("id").primaryKey(),
    projectId: text("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    groupId: text("group_id")
      .notNull()
      .references(() => ruleGroups.id, { onDelete: "cascade" }),
    title: text("title"),
    body: text("body").notNull(),
    metadata: jsonb("metadata"),
    orderIndex: integer("order_index").notNull().default(0),
    isFromTemplate: boolean("is_from_template").notNull().default(false),
    templateRef: text("template_ref"),
    enabled: boolean("enabled").notNull().default(true),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
    deletedAt: timestamp("deleted_at"),
  },
  (t) => [
    index("rules_group_order_idx").on(t.groupId, t.orderIndex),
    index("rules_project_idx").on(t.projectId),
    index("rules_project_active_idx")
      .on(t.projectId, t.enabled)
      .where(sql`deleted_at IS NULL`),
  ]
);
