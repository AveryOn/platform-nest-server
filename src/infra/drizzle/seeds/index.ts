import { eq } from 'drizzle-orm'
import { randomUUID } from 'node:crypto'

import { db, pool } from '~/infra/drizzle/client'
import { templates, templateSnapshots } from '~/infra/drizzle/schemas'
import { shadcnTemplateDefinition } from './shadcn-template'

const createId = () => randomUUID()

async function seed() {
  const slug = 'shadcn-ui'

  const existingTemplate = await db.query.templates.findFirst({
    where: eq(templates.slug, slug),
  })

  let templateId = existingTemplate?.id

  if (!templateId) {
    templateId = createId()

    await db.insert(templates).values({
      id: templateId,
      slug,
      name: 'shadcn/ui',
      description: 'Complete shadcn/ui design system template',
    })
  }

  const latestSnapshot = await db.query.templateSnapshots.findFirst({
    where: eq(templateSnapshots.templateId, templateId),
    orderBy: (table, { desc }) => [desc(table.version)],
  })

  await db.insert(templateSnapshots).values({
    id: createId(),
    templateId,
    version: (latestSnapshot?.version ?? 0) + 1,
    definition: shadcnTemplateDefinition,
  })
}

seed()
  .then(async () => {
    await pool.end()
    process.exit(0)
  })
  .catch(async (error) => {
    console.error(error)
    await pool.end()
    process.exit(1)
  })