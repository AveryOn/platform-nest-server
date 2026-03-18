import {
    boolean,
    foreignKey,
    index,
    integer,
    jsonb,
    pgTable,
    text,
    timestamp,
  } from "drizzle-orm/pg-core";
  
  import { projects } from "./projects";
  
  export const ruleGroups = pgTable(
    "rule_groups",
    {
      id: text("id").primaryKey(),
      projectId: text("project_id")
        .notNull()
        .references(() => projects.id, { onDelete: "cascade" }),
      parentGroupId: text("parent_group_id"),
      name: text("name").notNull(),
      description: text("description"),
      kind: text("kind").notNull(),
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
      foreignKey({
        columns: [t.parentGroupId],
        foreignColumns: [t.id],
      }).onDelete("cascade"),
      index("rg_project_parent_order_idx").on(t.projectId, t.parentGroupId, t.orderIndex),
      index("rg_project_idx").on(t.projectId),
      index("rg_project_kind_idx").on(t.projectId, t.kind),
    ]
  );
  