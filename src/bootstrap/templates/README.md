# Template Seeding System

## Purpose

`Template Seeding System` is a bootstrap module of the backend application responsible for preparing and versioning system project templates.

The module takes a template described in TypeScript code, normalizes it, validates it, builds a deterministic snapshot payload, computes a hash, and saves the result to the following tables:

- `templates`
- `template_snapshots`

The primary goal of the module is to provide a safe and reproducible way to store initial templates that can later be used when creating projects.

Example: the `shadcn` template is used as the base structure of rule groups and rules for a new project.

---

## Core Idea

The system operates as a pipeline:

```txt
Template Source
  -> normalize
  -> validate
  -> build snapshot payload
  -> build stable hash
  -> compare with latest DB snapshot
  -> skip | create new template snapshot
```

If the template content has not changed, a new snapshot version is not created.

If the template content has changed, a new immutable snapshot is created with an incremented version.

---

## Source of Truth

The source of truth for a template is a TypeScript file in the directory:

```txt
src/bootstrap/templates/assets
```

Example:

```txt
src/bootstrap/templates/assets/shadcn.template.ts
```

The template is described as a `TemplateBase` object.

---

## Template Source Structure

Minimal template structure:

```ts
export const shadcnTemplate: TemplateBase = {
  slug: 'shadcn',
  name: 'Shadcn Template',
  description: null,
  groups: [
    {
      key: 'components',
      name: 'Components',
      description: null,
      type: RuleGroupType.category,
      orderIndex: 0,
      metadata: null,
      rules: [],
      children: [],
    },
  ],
}
```

---

## Core Entities

### Template

Template is a logical record of a template.

Stored in the table:

```txt
templates
```

Fields:

- `id`
- `slug`
- `name`
- `description`
- `created_at`
- `updated_at`

`slug` must be unique.

---

### Template Snapshot

Template Snapshot is an immutable version of a template.

Stored in the table:

```txt
template_snapshots
```

Fields:

- `id`
- `template_id`
- `version`
- `payload`
- `hash`
- `created_at`

Invariants:

- a snapshot is not updated;
- a snapshot is not deleted;
- a new version is created only when the payload changes;
- the version increments monotonically within a single template;
- `(template_id, version)` must be unique.

---

## Snapshot Payload

Snapshot payload is a normalized representation of a template.

Shape:

```ts
export type TemplateSnapshotPayload = {
  schemaVersion: 1
  template: {
    slug: string
    name: string
    description: string | null
  }
  groups: TemplateSnapshotGroup[]
}
```

Group:

```ts
export type TemplateSnapshotGroup = {
  key: string
  name: string
  description: string | null
  type: RuleGroupType
  orderIndex: number
  metadata: Record<string, unknown> | null
  rules: TemplateSnapshotRule[]
  children: TemplateSnapshotGroup[]
}
```

Rule:

```ts
export type TemplateSnapshotRule = {
  key: string
  name: string
  description: string | null
  orderIndex: number
  metadata: Record<string, unknown> | null
  body: string
}
```

---

## The `key` Field

`key` is a stable identifier of an element within the template source.

Used for:

- validation;
- diff;
- determining added / removed / changed elements;
- future controlled merge;
- linking project-owned data to the original template snapshot.

Requirements:

- `key` must not be empty;
- group keys must be unique within a template;
- rule keys must be unique within a template;
- `key` is not a database primary key;
- `key` does not replace `id` in runtime tables.

---

## Normalization

Before saving, the source template is transformed into a normalized payload.

Normalization does the following:

- trim on `slug`;
- trim on `name`;
- trim on `description`;
- empty `description` becomes `null`;
- missing `metadata` becomes `null`;
- missing `rules` becomes `[]`;
- missing `children` becomes `[]`;
- groups are sorted by `orderIndex`;
- rules are sorted by `orderIndex`;
- rule `body` is cleaned via trim.

---

## Validation

Before creating a snapshot, validation is performed.

Checked:

- `template.slug` is not empty;
- `template.name` is not empty;
- `template.groups` is an array;
- `schemaVersion` is supported;
- group `key` is not empty;
- group `key` is unique;
- group `name` is not empty;
- group `type` is specified;
- group `type` belongs to the allowed enum;
- group `orderIndex` is an integer;
- group `orderIndex >= 0`;
- sibling group `orderIndex` is not duplicated;
- rule `key` is not empty;
- rule `key` is unique;
- rule `name` is not empty;
- rule `body` is not empty;
- rule `orderIndex` is an integer;
- rule `orderIndex >= 0`;
- sibling rule `orderIndex` is not duplicated;
- `metadata` must be JSON-serializable.

If validation fails, the seed process terminates with an error.

---

## Hash

A SHA-256 hash is computed for the snapshot payload.

The hash is used to determine whether the template has changed.

If the hash of the latest snapshot matches the hash of the current source payload:

```txt
new snapshot is not created
```

If the hash differs:

```txt
new snapshot is created
```

The hash must be computed from a stable serialized payload, not from a regular `JSON.stringify`, so that object key order does not cause false changes.

---

## Module Architecture

Directory:

```txt
src/bootstrap/templates
```

Structure:

```txt
src/bootstrap/templates
├── application
│   ├── scripts
│   │   ├── apply-template-snapshot.script.ts
│   │   ├── build-template-snapshot.script.ts
│   │   ├── check-template-snapshot.script.ts
│   │   ├── diff-template-snapshot.script.ts
│   │   └── dry-run-template-snapshot.script.ts
│   └── service
│       ├── template-snapshot.service.ts
│       ├── template-source.service.ts
│       └── template.types.ts
├── assets
│   └── shadcn.template.ts
├── infra
│   ├── cli
│   │   └── seed-templates.cli.ts
│   └── persistence
│       ├── drizzle.template.repo.ts
│       └── drizzle.template-snapshot.repo.ts
├── ports
│   ├── template-registry.service.port.ts
│   ├── template-snapshot.repo.port.ts
│   ├── template-snapshot.service.port.ts
│   └── template.repo.port.ts
└── template-seeding-system.module.ts
```

---

## Core Components

### `TemplateSeedingSystemModule`

File:

```txt
src/bootstrap/templates/template-seeding-system.module.ts
```

Registers providers:

- `TemplateSnapshotService`
- `TemplateSourceService`
- `DrizzleTemplateRepo`
- `DrizzleTemplateSnapshotRepo`

Registers DI ports:

- `TEMPLATE_SNAPSHOT_SERVICE_PORT`
- `TEMPLATE_REGISTRY_SERVICE_PORT`
- `TEMPLATE_REPO_PORT`
- `TEMPLATE_SNAPSHOT_REPO_PORT`

---

### `TemplateSourceService`

File:

```txt
src/bootstrap/templates/application/service/template-source.service.ts
```

Responsible for registering source templates.

Current implementation returns:

```ts
return [shadcnTemplate]
```

To add a new template, you need to:

1. create it in `src/bootstrap/templates/assets`;
2. import it into `TemplateSourceService`;
3. add it to the `getTemplates()` array.

---

### `TemplateSnapshotService`

File:

```txt
src/bootstrap/templates/application/service/template-snapshot.service.ts
```

The main application service of the module.

Responsible for:

- apply;
- check;
- dry-run;
- diff;
- build payload;
- validate source;
- validate payload;
- compare hash;
- create new snapshot;
- update template metadata;
- detect template changes.

---

### `build-template-snapshot.script.ts`

File:

```txt
src/bootstrap/templates/application/scripts/build-template-snapshot.script.ts
```

Responsible for the transformation:

```txt
TemplateBase -> TemplateSnapshotPayload
```

Does not write to the DB.

---

### Persistence repositories

Files:

```txt
src/bootstrap/templates/infra/persistence/drizzle.template.repo.ts
src/bootstrap/templates/infra/persistence/drizzle.template-snapshot.repo.ts
```

Responsible for working with the tables:

- `templates`
- `template_snapshots`

Via Drizzle ORM.

---

## CLI

CLI entrypoint:

```txt
src/bootstrap/templates/infra/cli/seed-templates.cli.ts
```

The CLI is launched via `npm scripts`.

---

## Commands

### Apply

Creates a template and template snapshot if they are absent or if the payload has changed.

```bash
npm run db:seed:templates
```

Equivalent mode:

```bash
tsx src/bootstrap/templates/infra/cli/seed-templates.cli.ts apply
```

Behavior:

- if the template is absent — creates the template;
- if the snapshot is absent — creates version `1`;
- if the latest snapshot hash matches the source hash — skips;
- if the hash differs — creates a new snapshot version.

Example result:

```json
{
  "results": [
    {
      "slug": "shadcn",
      "status": "created",
      "templateId": "c6d92370-e81c-4663-ab72-9a08aa9278cf",
      "snapshotId": "8cd5bf9e-eb16-4a0b-8ff8-0995ac87638a",
      "version": 1,
      "hash": "50629501e318e200d3969e0807d0dc13b266931a087327bae811831b7ddddd6e"
    }
  ]
}
```

If run again without changes:

```json
{
  "results": [
    {
      "slug": "shadcn",
      "status": "skipped",
      "templateId": "c6d92370-e81c-4663-ab72-9a08aa9278cf",
      "snapshotId": "8cd5bf9e-eb16-4a0b-8ff8-0995ac87638a",
      "version": 1,
      "hash": "50629501e318e200d3969e0807d0dc13b266931a087327bae811831b7ddddd6e"
    }
  ]
}
```

---

### Check

Checks whether the source template is synchronized with the latest snapshot in the DB.

```bash
npm run db:seed:templates:check
```

Behavior:

- `synced` — source matches the latest snapshot;
- `outdated` — source differs from the latest snapshot;
- `missing` — template or snapshot is absent in the DB.

Example:

```json
{
  "results": [
    {
      "slug": "shadcn",
      "status": "synced",
      "templateId": "c6d92370-e81c-4663-ab72-9a08aa9278cf",
      "latestSnapshotId": "8cd5bf9e-eb16-4a0b-8ff8-0995ac87638a",
      "latestVersion": 1,
      "sourceHash": "50629501e318e200d3969e0807d0dc13b266931a087327bae811831b7ddddd6e",
      "latestHash": "50629501e318e200d3969e0807d0dc13b266931a087327bae811831b7ddddd6e"
    }
  ]
}
```

---

### Dry-run

Shows what apply would do, but without writing to the DB.

```bash
npm run db:seed:templates:dry-run
```

Statuses:

- `would-create` — template/snapshot would be created;
- `would-update` — a new snapshot version would be created;
- `would-skip` — no changes.

Example:

```json
{
  "results": [
    {
      "slug": "shadcn",
      "status": "would-skip",
      "templateId": "c6d92370-e81c-4663-ab72-9a08aa9278cf",
      "latestSnapshotId": "8cd5bf9e-eb16-4a0b-8ff8-0995ac87638a",
      "nextVersion": 1,
      "hash": "50629501e318e200d3969e0807d0dc13b266931a087327bae811831b7ddddd6e"
    }
  ]
}
```

---

### Diff

Shows the changes between the current source template and the latest snapshot in the DB.

```bash
npm run db:seed:templates:diff
```

Diff shows:

- added;
- removed;
- changed.

Comparison is performed by `key`.

Example with no changes:

```json
{
  "results": [
    {
      "slug": "shadcn",
      "added": [],
      "removed": [],
      "changed": []
    }
  ]
}
```

Example with changes:

```json
{
  "results": [
    {
      "slug": "shadcn",
      "added": [
        {
          "path": "components/card",
          "type": "group",
          "key": "card"
        }
      ],
      "removed": [],
      "changed": [
        {
          "path": "components/button/button-rule-1",
          "type": "rule",
          "key": "button-rule-1"
        }
      ]
    }
  ]
}
```

---

## NPM scripts

The following commands must be added to `package.json`:

```json
{
  "scripts": {
    "db:seed:templates": "tsx src/bootstrap/templates/infra/cli/seed-templates.cli.ts apply",
    "db:seed:templates:check": "tsx src/bootstrap/templates/infra/cli/seed-templates.cli.ts check",
    "db:seed:templates:dry-run": "tsx src/bootstrap/templates/infra/cli/seed-templates.cli.ts dry-run",
    "db:seed:templates:diff": "tsx src/bootstrap/templates/infra/cli/seed-templates.cli.ts diff"
  }
}
```

---

## Requirements to Run

Before running template seeding, the following conditions must be met:

1. Dependencies installed:

```bash
npm install
```

2. Environment variables for DB connection configured.

3. PostgreSQL accessible.

4. Drizzle schema contains the tables:

```txt
templates
template_snapshots
```

5. Migrations applied.

6. The `template_snapshots` table must have the column:

```txt
hash
```

7. `TemplateSeedingSystemModule` must be connected in `AppModule`.

8. The project must have a transaction layer available via `TX_PORT`.

---

## Getting Started from Scratch

### 1. Check the schema

Verify that the following tables exist:

```txt
templates
template_snapshots
```

Minimum:

```sql
select column_name
from information_schema.columns
where table_name = 'template_snapshots';
```

Expected fields:

```txt
id
template_id
version
payload
hash
created_at
```

---

### 2. Apply migrations

```bash
npm run db:migrate
```

The command name may differ depending on the current `package.json`.

---

### 3. Check the source template

Verify that the template is registered:

```txt
src/bootstrap/templates/assets/shadcn.template.ts
```

And connected in:

```txt
src/bootstrap/templates/application/service/template-source.service.ts
```

Example:

```ts
@Injectable()
export class TemplateSourceService implements TemplateRegistryServicePort {
  getTemplates(): TemplateBase[] {
    return [shadcnTemplate]
  }
}
```

---

### 4. Run dry-run

```bash
npm run db:seed:templates:dry-run
```

If the template has not been seeded yet, the expected status is:

```txt
would-create
```

---

### 5. Run apply

```bash
npm run db:seed:templates
```

Expected first result:

```txt
status: created
version: 1
```

---

### 6. Check idempotency

Run apply again:

```bash
npm run db:seed:templates
```

Expected result:

```txt
status: skipped
version: 1
```

If a new version is created without changing the source template, the hash is unstable or the payload changes between runs.

---

### 7. Check via check

```bash
npm run db:seed:templates:check
```

Expected result:

```txt
status: synced
```

---

### 8. Check via diff

```bash
npm run db:seed:templates:diff
```

If there are no changes:

```txt
added: []
removed: []
changed: []
```

---

## How to Add a New Template

### 1. Create an asset file

For example:

```txt
src/bootstrap/templates/assets/custom.template.ts
```

```ts
import { RuleGroupType } from '~/modules/rule-group/application/rule-group.type'
import type { TemplateBase } from '~/bootstrap/templates/application/service/template.types'

export const customTemplate: TemplateBase = {
  slug: 'custom',
  name: 'Custom Template',
  description: null,
  groups: [
    {
      key: 'components',
      name: 'Components',
      description: null,
      type: RuleGroupType.category,
      orderIndex: 0,
      metadata: null,
      rules: [],
      children: [],
    },
  ],
}
```

---

### 2. Register the template

File:

```txt
src/bootstrap/templates/application/service/template-source.service.ts
```

```ts
@Injectable()
export class TemplateSourceService implements TemplateRegistryServicePort {
  getTemplates(): TemplateBase[] {
    return [shadcnTemplate, customTemplate]
  }
}
```

---

### 3. Check dry-run

```bash
npm run db:seed:templates:dry-run
```

---

### 4. Apply

```bash
npm run db:seed:templates
```

---

## How to Modify an Existing Template

### 1. Modify the source template

For example:

```txt
src/bootstrap/templates/assets/shadcn.template.ts
```

You can modify:

- name;
- description;
- group;
- rule;
- metadata;
- orderIndex;
- body;
- children;
- rules.

---

### 2. Check diff

```bash
npm run db:seed:templates:diff
```

---

### 3. Check dry-run

```bash
npm run db:seed:templates:dry-run
```

Expected status:

```txt
would-update
```

---

### 4. Apply changes

```bash
npm run db:seed:templates
```

Expected status:

```txt
updated
```

The snapshot version must increment:

```txt
version: previousVersion + 1
```

---

## Runtime Usage

The template seeding system is not used as a regular runtime module of business logic.

Its primary purpose is:

- bootstrap;
- local development;
- deployment preparation;
- production seed;
- template versioning.

The output of the module is used by other parts of the backend system.

The primary consumer of the output:

```txt
Project creation flow
```

When creating a project, the backend can take a specific `template_snapshot.payload` and copy its contents into project-owned tables:

- `rule_groups`
- `rules`

---

## Copy-on-create Model

The current project model uses the `copy-on-create` approach.

This means:

1. A project is created based on a specific `template_snapshot`.
2. `template_snapshot.payload` is used as the source.
3. Rule groups and rules are copied into project-owned tables.
4. The project becomes the owner of this data.
5. Runtime queries operate on the project's `rule_groups` and `rules`.
6. The template snapshot remains a reference to the original version of the template.

Important:

The template seeding system only creates template snapshots.

It must not perform copy-on-create directly.

Copy-on-create must reside in the project creation flow or a separate application service.

---

## Boundaries of Responsibility

The Template Seeding System is responsible for:

- registering source templates;
- normalizing templates;
- validating templates;
- building the snapshot payload;
- computing the hash;
- creating `templates` records;
- creating `template_snapshots` records;
- checking the relevance of source templates;
- dry-run;
- diff.

The Template Seeding System is not responsible for:

- creating projects;
- copying the template payload into a project;
- creating project rule groups;
- creating project rules;
- the project config layer;
- resolved ruleset;
- export;
- permissions;
- REST API for templates.

---

## Invariants

- Template source is stored in code.
- Template snapshot is stored in the DB.
- Snapshot is immutable.
- Snapshot is append-only.
- Snapshot version increments only when the payload changes.
- An identical payload does not create a new version.
- `key` is required for groups and rules.
- `key` must be stable.
- `orderIndex` must be deterministic.
- Source template must not depend on data from a specific project.
- Template seeding must not mutate existing snapshots.
- Template seeding must not create project-owned rules/groups.
- Diff compares elements by `key`.

---

## Common Errors

### Error: `column "hash" does not exist`

Cause:

The database does not match the current Drizzle schema.

The code expects the column:

```txt
template_snapshots.hash
```

But it does not exist in the actual table.

Solution:

- create and apply a migration;
- or recreate the dev database;
- or add the column manually.

---

### Error: duplicated group key

Cause:

In one template, two groups have the same `key`.

Example:

```ts
{
  key: 'radius',
  type: RuleGroupType.category,
  children: [
    {
      key: 'radius',
      type: RuleGroupType.token,
    },
  ],
}
```

Solution:

Make the keys unique:

```ts
{
  key: 'radius',
  type: RuleGroupType.category,
  children: [
    {
      key: 'radius-base',
      type: RuleGroupType.token,
    },
  ],
}
```

---

### Error: duplicated orderIndex

Cause:

Within a single sibling level, two groups or two rules have the same `orderIndex`.

Solution:

Check the order within a single `children` or `rules` array.

---

### Error: repeated `updated` without changing source

Cause:

The payload or hash is unstable between runs.

Check:

- stable hash serializer;
- object key order;
- absence of runtime-generated values;
- absence of `Date.now()`;
- absence of random values;
- absence of unstable metadata.

---

## Recommended Development Workflow

Before modifying a template:

```bash
npm run db:seed:templates:check
```

After modifying a template:

```bash
npm run db:seed:templates:diff
```

Check what will be done:

```bash
npm run db:seed:templates:dry-run
```

Apply:

```bash
npm run db:seed:templates
```

Check the result:

```bash
npm run db:seed:templates:check
```

---

## Minimal Smoke Test

```bash
npm run db:seed:templates:dry-run
npm run db:seed:templates
npm run db:seed:templates
npm run db:seed:templates:check
npm run db:seed:templates:diff
```

Expected:

1. First `apply` creates a snapshot.
2. Second `apply` returns `skipped`.
3. `check` returns `synced`.
4. `diff` returns empty arrays `added`, `removed`, `changed`.

---

## Current State

At the current stage the following are implemented:

- source template format;
- `shadcn` template source;
- normalized snapshot payload;
- validation;
- stable hash;
- `apply`;
- `check`;
- `dry-run`;
- `diff`;
- Drizzle persistence layer;
- Nest module;
- CLI entrypoint;
- NPM commands.

The next logical stage:

```txt
Project creation integration
```

That is, implementation of copy-on-create:

```txt
template_snapshot.payload -> project rule_groups/rules
```
