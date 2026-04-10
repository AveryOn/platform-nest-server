import { desc, eq } from 'drizzle-orm'
import { type DrizzleService } from '~/infra/drizzle/drizzle.service'
import {
  projectsTable,
  ruleGroupsTable,
  rulesTable,
  templateSnapshotsTable,
  templatesTable,
} from '~/infra/drizzle/schemas'
import type { RuleGroupKind } from '~/modules/rule-group/infra/http/rule-group.dto'
import { createId } from '~/shared/crypto/hash.crypto'

interface TemplateGroupDef {
  ref: string
  name: string
  description?: string
  kind: string
  order_index: number
  metadata?: Record<string, unknown> | null
  rules?: TemplateRuleDef[]
  children?: TemplateGroupDef[]
}

interface TemplateRuleDef {
  ref: string
  title?: string
  body: string
  metadata?: Record<string, unknown> | null
  order_index: number
}

export async function stampTemplate(
  projectId: string,
  templateSlug: string,
  drizzle: DrizzleService,
) {
  const template = await drizzle.db.query.templatesTable.findFirst({
    where: eq(templatesTable.slug, templateSlug),
  })
  if (!template) {
    throw new Error(`Template '${templateSlug}' not found`)
  }

  const snapshot = await drizzle.db.query.templateSnapshotsTable.findFirst({
    where: eq(templateSnapshotsTable.templateId, template.id),
    orderBy: desc(templateSnapshotsTable.version),
  })
  if (!snapshot) {
    throw new Error('No snapshot found for template')
  }

  // const definition = snapshot.definition as TemplateDefinition
  const definition = { groups: [] }

  const groupInserts: (typeof ruleGroupsTable.$inferInsert)[] = []
  const ruleInserts: (typeof rulesTable.$inferInsert)[] = []

  function processGroup(group: TemplateGroupDef, parentId: string | null) {
    const groupId = createId()

    groupInserts.push({
      id: groupId,
      projectId,
      parentGroupId: parentId,
      name: group.name,
      description: group.description ?? null,
      type: group.kind as RuleGroupKind,
      metadata: group.metadata ?? null,
      orderIndex: group.order_index,
    })

    for (const rule of group.rules ?? []) {
      ruleInserts.push({
        id: createId(),
        ruleGroupId: groupId,
        name: rule.title ?? '',
        body: rule.body,
        metadata: rule.metadata ?? '',
        orderIndex: rule.order_index,
      })
    }

    for (const child of group.children ?? []) {
      processGroup(child, groupId)
    }
  }

  for (const rootGroup of definition.groups) {
    processGroup(rootGroup, null)
  }

  await drizzle.db.transaction(async (tx) => {
    if (groupInserts.length > 0) {
      await tx.insert(ruleGroupsTable).values(groupInserts)
    }
    if (ruleInserts.length > 0) {
      await tx.insert(rulesTable).values(ruleInserts)
    }
    await tx
      .update(projectsTable)
      .set({ templateSnapshotId: snapshot.id })
      .where(eq(projectsTable.id, projectId))
  })

  return {
    groupsCreated: groupInserts.length,
    rulesCreated: ruleInserts.length,
  }
}
