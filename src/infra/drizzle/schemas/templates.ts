import { pgTable, uniqueIndex } from 'drizzle-orm/pg-core'
import {
  createdAt,
  description,
  id,
  name,
  updatedAt,
  varchar255,
} from '~/infra/drizzle/application/drizzle.helpers'

export const templatesTable = pgTable(
  'templates',
  {
    id: id(),
    slug: varchar255('slug'),
    name: name(),
    description: description(),

    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [uniqueIndex('templates_slug_unique').on(t.slug)],
)
