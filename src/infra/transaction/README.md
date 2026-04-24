## Transaction Module

### Overview

`TransactionModule` provides a unified way to execute application logic inside a database transaction without coupling the application layer to a specific ORM or database implementation.

It follows the **Ports & Adapters (Hexagonal Architecture)** approach:

- application layer depends on **TransactionPort**
- infrastructure layer provides **DrizzleTxAdapter**

---

### Why this exists

In this system, services often need to:

- execute multiple repository calls
- guarantee atomicity
- ensure consistency across operations

Directly using `DrizzleService` inside application services would:

- break layer boundaries
- tightly couple business logic to Drizzle
- make future DB/ORM changes expensive

This module solves that by introducing a **transaction port abstraction**.

---

### Core concept

Application code works with this abstraction:

```ts
TransactionPort.run(handler)
```

Infrastructure provides the actual implementation:

```ts
DrizzleTxAdapter -> drizzle.db.transaction(...)
```

---

### Architecture

```
Application Layer
  └── uses TransactionPort (TX_PORT)

Infrastructure Layer
  └── DrizzleTxAdapter (implements TransactionPort)

Database
  └── Drizzle ORM / PostgreSQL
```

Binding is done in the module:

```ts
{
  provide: TX_PORT,
  useClass: DrizzleTxAdapter,
}
```

---

### Usage

#### 1. Inject transaction service

```ts
constructor(
  @Inject(TX_PORT)
  private readonly tx: TransactionPort<Tx>,
) {}
```

---

#### 2. Execute transactional logic

```ts
await this.tx.run(async (tx) => {
  await this.repoA.doSomething(tx)
  await this.repoB.doSomething(tx)
})
```

---

### Transaction flow

1. `run()` is called
2. adapter opens DB transaction
3. handler executes with `tx`
4. if success → commit
5. if error → rollback

---

### Transaction context (`tx`)

- passed explicitly to repositories
- ensures all queries use the same connection
- opaque for application layer (should not be inspected)

---

### Repository contract

Repositories must accept optional transaction:

```ts
getSomething(id: string, tx?: Tx)
```

And internally resolve DB instance:

```ts
defineDb(this.drizzle.db, tx)
```

---

### Design decisions

#### 1. Explicit transaction passing

Transaction context is passed manually instead of using:

- global context
- async local storage

Reason:

- explicit > implicit
- easier to reason about
- no hidden side effects

---

#### 2. No direct ORM usage in services

Application services:

- do not import Drizzle
- do not access `drizzle.db`
- only work through ports

---

#### 3. Swappable implementation

You can replace Drizzle with:

- Prisma
- Kysely
- raw SQL

by only changing:

```ts
DrizzleTxAdapter
```

No changes in application layer.

---

### When to use transactions

Use `tx.run()` when:

- multiple writes must be atomic
- consistency between aggregates matters
- you orchestrate multiple repositories

Do NOT use when:

- simple read-only queries
- single repository call without side effects

---

### Anti-patterns

- Calling DrizzleService directly in services
- Mixing transactional and non-transactional repo calls
- Hiding transaction context (implicit magic)
- Returning ORM-specific types outside infra layer
