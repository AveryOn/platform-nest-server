import {
    index,
    integer,
    jsonb,
    pgTable,
    text,
    timestamp,
    uniqueIndex,
  } from "drizzle-orm/pg-core";
  
  export const templates = pgTable(
    "templates",
    {
      id: text("id").primaryKey(),
      slug: text("slug").notNull(),
      name: text("name").notNull(),
      description: text("description"),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at")
        .defaultNow()
        .notNull()
        .$onUpdate(() => new Date()),
    },
    (t) => [uniqueIndex("templates_slug_idx").on(t.slug)]
  );
  
  export const templateSnapshots = pgTable(
    "template_snapshots",
    {
      id: text("id").primaryKey(),
      templateId: text("template_id")
        .notNull()
        .references(() => templates.id, { onDelete: "cascade" }),
      version: integer("version").notNull(),
      definition: jsonb("definition").notNull(),
      createdAt: timestamp("created_at").defaultNow().notNull(),
    },
    (t) => [
      uniqueIndex("ts_template_version_idx").on(t.templateId, t.version),
      index("ts_template_idx").on(t.templateId),
    ]
  );
  