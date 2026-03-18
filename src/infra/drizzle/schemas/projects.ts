import { sql } from "drizzle-orm";
import { index, pgTable, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";

import { organizations } from "./auth-schema";
import { templateSnapshots } from "./templates";

export const projects = pgTable(
  "projects",
  {
    id: text("id").primaryKey(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    description: text("description"),
    templateSnapshotId: text("template_snapshot_id").references(
      () => templateSnapshots.id,
      { onDelete: "set null" }
    ),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
    deletedAt: timestamp("deleted_at"),
  },
  (t) => [
    index("projects_org_idx").on(t.organizationId),
    uniqueIndex("projects_org_slug_uidx")
      .on(t.organizationId, t.slug)
      .where(sql`deleted_at IS NULL`)
  ]
);
