Prisma Migrations Workflow

1. Общие принципы

- Источник истины — `schema.prisma`.
- Любое изменение структуры БД должно проходить через миграции.
- Старые миграции не редактируются.
- `db push` не используется в проектах с миграциями.
- Dev и Prod используют разные команды.

---

2. Создание новой миграции (Dev)

Алгоритм:

1. Изменить `schema.prisma`.
2. Выполнить:

```bash
npx prisma migrate dev --name <migration_name>
```

Пример:

```bash
npx prisma migrate dev --name add_fullname_to_user
```

Результат:

- Создаётся новая папка в `prisma/migrations`.
- Миграция применяется к локальной БД.
- Обновляется Prisma Client.
- Проверяется корректность через shadow database.

---

3. Применение миграций (Production)

В production среде:

```bash
npx prisma migrate deploy
```

Поведение:

- Применяются уже существующие миграции.
- Новые миграции не создаются.
- Shadow database не используется.

---

4. Полный сброс БД (Dev only)

Используется при рассинхронизации схемы:

```bash
npx prisma migrate reset
```

Поведение:

- Удаляет все таблицы.
- Применяет все миграции заново.
- Перегенерирует Prisma Client.

Использовать только в dev.

---

5. Генерация клиента вручную

Если требуется:

```bash
npx prisma generate
```

Обычно вызывается автоматически после `migrate dev`.

---

6. Запрещённые действия

- Не редактировать существующие SQL-файлы миграций.
- Не удалять записи из `_prisma_migrations` вручную.
- Не использовать `db push` вместе с `migrate`.
- Не применять `migrate dev` в production.

---

7. Инвариант

Изменение `schema.prisma` → новая миграция → commit миграции в репозиторий → deploy через `migrate deploy`.
