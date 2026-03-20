import { desc, eq } from 'drizzle-orm'
import { DrizzleService } from '~/infra/drizzle/drizzle.service'
import {
  projects,
  ruleGroups,
  rules,
  templates,
  templateSnapshots,
} from '~/infra/drizzle/schemas'
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

interface TemplateDefinition {
  groups: TemplateGroupDef[]
}

export async function stampTemplate(
  projectId: string,
  templateSlug: string,
  drizzle: DrizzleService,
) {
  const template = await drizzle.db.query.templates.findFirst({
    where: eq(templates.slug, templateSlug),
  })
  if (!template) {
    throw new Error(`Template '${templateSlug}' not found`)
  }

  const snapshot = await drizzle.db.query.templateSnapshots.findFirst({
    where: eq(templateSnapshots.templateId, template.id),
    orderBy: desc(templateSnapshots.version),
  })
  if (!snapshot) {
    throw new Error('No snapshot found for template')
  }

  const definition = snapshot.definition as TemplateDefinition

  const groupInserts: (typeof ruleGroups.$inferInsert)[] = []
  const ruleInserts: (typeof rules.$inferInsert)[] = []

  function processGroup(group: TemplateGroupDef, parentId: string | null) {
    const groupId = createId()

    groupInserts.push({
      id: groupId,
      projectId,
      parentGroupId: parentId,
      name: group.name,
      description: group.description ?? null,
      kind: group.kind,
      metadata: group.metadata ?? null,
      orderIndex: group.order_index,
      isFromTemplate: true,
      templateRef: group.ref,
      enabled: true,
    })

    for (const rule of group.rules ?? []) {
      ruleInserts.push({
        id: createId(),
        projectId,
        groupId,
        title: rule.title ?? null,
        body: rule.body,
        metadata: rule.metadata ?? null,
        orderIndex: rule.order_index,
        isFromTemplate: true,
        templateRef: rule.ref,
        enabled: true,
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
      await tx.insert(ruleGroups).values(groupInserts)
    }
    if (ruleInserts.length > 0) {
      await tx.insert(rules).values(ruleInserts)
    }
    await tx
      .update(projects)
      .set({ templateSnapshotId: snapshot.id })
      .where(eq(projects.id, projectId))
  })

  return {
    groupsCreated: groupInserts.length,
    rulesCreated: ruleInserts.length,
  }
}
