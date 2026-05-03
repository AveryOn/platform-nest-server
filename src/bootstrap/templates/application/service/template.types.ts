import type { RuleGroupType } from '~/modules/rule-group/application/rule-group.type'

export type TemplateBase = {
  slug: string
  name: string
  description?: string | null
  groups: TemplateBaseGroup[]
}

export type TemplateBaseGroup = {
  key: string
  name: string
  description?: string | null
  type: RuleGroupType
  orderIndex: number
  metadata?: Record<string, unknown> | null
  rules?: TemplateBaseRule[]
  children?: TemplateBaseGroup[]
}

export type TemplateBaseRule = {
  key: string
  name: string
  description?: string | null
  orderIndex: number
  metadata?: Record<string, unknown> | null
  body: string
}

export type TemplateSnapshotPayload = {
  schemaVersion: 1
  template: {
    slug: string
    name: string
    description: string | null
  }
  groups: TemplateSnapshotGroup[]
}

export type TemplateSnapshotGroup = {
  key: string
  name: string
  description: string | null
  type: RuleGroupType
  orderIndex: number
  metadata: Record<string, unknown> | null
  rules: TemplateSnapshotRule[]
  children: TemplateSnapshotGroup[]
}

export type TemplateSnapshotRule = {
  key: string
  name: string
  description: string | null
  orderIndex: number
  metadata: Record<string, unknown> | null
  body: string
}

export type TemplateSeedMode = 'apply' | 'check' | 'dry-run' | 'diff'

export type TemplateSeedStatus = 'created' | 'updated' | 'skipped'

export type TemplateSeedResult = {
  slug: string
  status: TemplateSeedStatus
  templateId?: string
  snapshotId?: string
  version?: number
  hash: string
}

export type TemplateSeedApplyResult = {
  results: TemplateSeedResult[]
}

export type TemplateSeedDiffItem = {
  path: string
  type: 'template' | 'group' | 'rule'
  key: string
}

export type TemplateSeedDiff = {
  slug: string
  added: TemplateSeedDiffItem[]
  removed: TemplateSeedDiffItem[]
  changed: TemplateSeedDiffItem[]
}

export type TemplateRecord = {
  id: string
  slug: string
  name: string
  description: string | null
}

export type TemplateSnapshotRecord = {
  id: string
  templateId: string
  version: number
  payload: TemplateSnapshotPayload
  hash: string
  createdAt: Date
}

export type CreateTemplateCmd = {
  slug: string
  name: string
  description: string | null
}

export type UpdateTemplateMetaCmd = {
  id: string
  name: string
  description: string | null
}

export type CreateTemplateSnapshotCmd = {
  templateId: string
  version: number
  payload: TemplateSnapshotPayload
  hash: string
}

export type TemplateSeedCheckStatus = 'synced' | 'outdated' | 'missing'

export type TemplateSeedCheckResult = {
  slug: string
  status: TemplateSeedCheckStatus
  templateId?: string
  latestSnapshotId?: string
  latestVersion?: number
  sourceHash: string
  latestHash?: string
}

export type TemplateSeedCheckApplyResult = {
  results: TemplateSeedCheckResult[]
}

export type TemplateSeedDryRunStatus =
  | 'would-create'
  | 'would-update'
  | 'would-skip'

export type TemplateSeedDryRunResult = {
  slug: string
  status: TemplateSeedDryRunStatus
  templateId?: string
  latestSnapshotId?: string
  nextVersion: number
  hash: string
}

export type TemplateSeedDryRunApplyResult = {
  results: TemplateSeedDryRunResult[]
}

export type TemplateSeedDiffApplyResult = {
  results: TemplateSeedDiff[]
}
