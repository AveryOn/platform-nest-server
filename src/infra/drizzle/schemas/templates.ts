import { pgTable, text, uniqueIndex } from 'drizzle-orm/pg-core'
import { id, createdAt, name, description, updatedAt } from '~/infra/drizzle/drizzle.helpers'

export const templatesTable = pgTable(
  'templates',
  {
    id: id(),
    slug: text('slug').notNull(),
    name: name(),
    description: description(),

    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (table) => [uniqueIndex('templates_slug_unique').on(table.slug)],
)
