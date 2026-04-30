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
