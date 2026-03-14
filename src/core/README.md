# Core

## Purpose

`core` is the application skeleton.
It contains the foundation without which the application cannot function.

Core does not contain business logic and does not depend on feature modules.

---

## What can be here

- Global modules (`@Global`)
- ConfigModule
- LoggerModule
- Base guards
- Global filters
- Interceptors
- Pipes
- Common architectural abstractions
- DI tokens
- Base exceptions
- Health / bootstrap infrastructure

---

## What must not be here

- Feature modules
- Repositories
- Drizzle / Redis implementations
- Business logic
- Use-cases
- HTTP controllers

---

## Dependency rules

- `core` must not import `modules`
- `core` must not depend on `infra`
- `core` may only use basic external libraries

---

## Principle

Core is a stable layer.
It changes rarely.
It defines the architectural rules for the entire project.
