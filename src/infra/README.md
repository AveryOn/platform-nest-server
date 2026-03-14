# Infra

## Purpose

`infra` — the infrastructure layer.
This is where concrete implementations for interacting with the external world are located.

Infra implements abstractions (ports), but does not contain business logic.

---

## What can be here

- Drizzle / ORM
- Redis
- Cache implementations
- Mail adapters
- Storage adapters (S3 etc.)
- External API clients
- SDK integrations

---

## What must not be here

- Business logic
- Use-cases
- Feature services
- Controllers
- DTO
- Guards (if they are not infra-level)

---

## Dependency rules

- `infra` may depend on `core`
- `infra` must not import business services directly

---

## Principle

Infra represents implementation details.
It can be replaced (Prisma > another ORM) without changing the domain logic.
