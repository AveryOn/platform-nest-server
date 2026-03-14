# Shared

## Purpose

`shared` — reusable utilities that do not belong to a specific feature and are not infrastructure.

Shared does not contain business logic.

---

## What can be here

- Common utils
- Helpers
- Constants
- Base DTO
- Common decorators
- Common pipes
- Common types
- General-purpose enums
- Formatting / transformations

---

## What must not be here

- Feature services
- Repositories
- Persistence
- Prisma / Redis
- Business rules
- Use-cases
- HTTP controllers

---

## Rules

- `shared` may be used in `modules`
- `shared` may be used in `core`
- `shared` must not depend on `modules`
- `shared` must not depend on `infra`

---

## Important

`shared` is not a “folder for everything”.
If something starts knowing about a specific feature — it is no longer shared.
