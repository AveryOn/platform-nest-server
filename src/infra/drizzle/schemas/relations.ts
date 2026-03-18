import { relations } from "drizzle-orm";
import { organizations } from "./auth-schema";
import { projects } from "./projects";
import { ruleGroups } from "./rule-groups";
import { rules } from "./rules";
import { templates, templateSnapshots } from "./templates";

export const organizationProjectsRelations = relations(organizations, ({ many }) => ({
  projects: many(projects),
}));

export const projectRelations = relations(projects, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [projects.organizationId],
    references: [organizations.id],
  }),
  templateSnapshot: one(templateSnapshots, {
    fields: [projects.templateSnapshotId],
    references: [templateSnapshots.id],
  }),
  ruleGroups: many(ruleGroups),
  rules: many(rules),
}));

export const ruleGroupRelations = relations(ruleGroups, ({ one, many }) => ({
  project: one(projects, {
    fields: [ruleGroups.projectId],
    references: [projects.id],
  }),
  parentGroup: one(ruleGroups, {
    fields: [ruleGroups.parentGroupId],
    references: [ruleGroups.id],
    relationName: "parentChild",
  }),
  childGroups: many(ruleGroups, {
    relationName: "parentChild",
  }),
  rules: many(rules),
}));

export const ruleRelations = relations(rules, ({ one }) => ({
  project: one(projects, {
    fields: [rules.projectId],
    references: [projects.id],
  }),
  group: one(ruleGroups, {
    fields: [rules.groupId],
    references: [ruleGroups.id],
  }),
}));

export const templateRelations = relations(templates, ({ many }) => ({
  snapshots: many(templateSnapshots),
}));

export const templateSnapshotRelations = relations(
  templateSnapshots,
  ({ one, many }) => ({
    template: one(templates, {
      fields: [templateSnapshots.templateId],
      references: [templates.id],
    }),
    projects: many(projects),
  })
);
