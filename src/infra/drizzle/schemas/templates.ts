import { pgTable, text, uniqueIndex } from 'drizzle-orm/pg-core'
import { createdAt, description, id, name, updatedAt } from '~/infra/drizzle/drizzle.helpers'

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
  (t) => [uniqueIndex('templates_slug_unique').on(t.slug)],
)
