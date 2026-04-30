import type {
  TemplateBase,
  TemplateBaseGroup,
  TemplateBaseRule,
  TemplateSnapshotGroup,
  TemplateSnapshotPayload,
  TemplateSnapshotRule,
} from '~/bootstrap/templates/application/service/template.types'

export function buildTemplateSnapshotPayload(
  template: TemplateBase,
): TemplateSnapshotPayload {
  return {
    schemaVersion: 1,
    template: {
      slug: template.slug.trim(),
      name: template.name.trim(),
      description: normalizeNullableString(template.description),
    },
    groups: normalizeGroups(template.groups),
  }
}

function normalizeGroups(
  groups: TemplateBaseGroup[],
): TemplateSnapshotGroup[] {
  return [...groups]
    .sort(sortByOrderIndex)
    .map((group) => normalizeGroup(group))
}

function normalizeGroup(group: TemplateBaseGroup): TemplateSnapshotGroup {
  return {
    key: group.key.trim(),
    name: group.name.trim(),
    description: normalizeNullableString(group.description),
    type: group.type,
    orderIndex: group.orderIndex,
    metadata: normalizeMetadata(group.metadata),
    rules: normalizeRules(group.rules ?? []),
    children: normalizeGroups(group.children ?? []),
  }
}

function normalizeRules(
  rules: TemplateBaseRule[],
): TemplateSnapshotRule[] {
  return [...rules]
    .sort(sortByOrderIndex)
    .map((rule) => normalizeRule(rule))
}

function normalizeRule(rule: TemplateBaseRule): TemplateSnapshotRule {
  return {
    key: rule.key.trim(),
    name: rule.name.trim(),
    description: normalizeNullableString(rule.description),
    orderIndex: rule.orderIndex,
    metadata: normalizeMetadata(rule.metadata),
    body: rule.body.trim(),
  }
}

function normalizeNullableString(value: string | null | undefined) {
  if (typeof value !== 'string') {
    return null
  }
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

function normalizeMetadata(
  value: Record<string, unknown> | null | undefined,
) {
  return value ?? null
}

function sortByOrderIndex<T extends { orderIndex: number }>(a: T, b: T) {
  return a.orderIndex - b.orderIndex
}
