TODOs:

1. Missing constraint for consistency between `scope` and `projectId`

Currently, it is possible to create invalid data:

- `scope = 'project'`, `projectId = null`
- `scope = 'template'`, `projectId != null`

This is a critical domain gap.

A check constraint is required:

- `scope = 'project'` > `project_id IS NOT NULL`
- `scope = 'template'` > `project_id IS NULL`

---

2. In `ruleGroupsTable`:

Block:

```ts
uniqueIndex('rule_groups_project_parent_order_unique').on(
  t.projectId,
  t.parentGroupId,
  t.orderIndex,
),
```

This needs to be reconsidered separately for template nodes where `project_id = null`.

---

3. `projects.brandId` and `projects.organizationId` can become inconsistent

Currently, a project stores both `brandId` and `organizationId`, but the database does not guarantee that the brand belongs to the same organization.

It is possible to create:

- `project.organization_id = org_A`
- `project.brand_id` → brand from `org_B`

This is not an FK error, but a critical tenant isolation issue.

Solutions:

- enforce strict validation at the application layer on every create/update
- or introduce a composite FK / alternative schema design

For MVP, strict application-level validation is sufficient, but mandatory.

---

4. Missing indexes for soft-delete-sensitive reads

Soft delete is used in:

- `projects`
- `rule_groups`
- `rules`

However, indexes do not properly support “active-only” queries.

Example for `rules`:

```ts
uniqueIndex('rules_group_order_unique').on(t.ruleGroupId, t.orderIndex)
```

At minimum, a regular index on `rule_group_id` is required.
In many cases, a partial index on `deleted_at IS NULL` is also needed, especially for editor tree / resolved ruleset queries.

This is not a critical blocker, but a production-level weakness.
