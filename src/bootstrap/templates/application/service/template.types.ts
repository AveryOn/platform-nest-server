import type { RuleGroupTypeKey } from '~/infra/drizzle/schemas'

export type JsonBody<T> = Record<string, T>

export interface TemplateRule {
  ref: string
  key: string // stable identifier (build-time only)
  title?: string
  orderIndex: number
  body: JsonBody<any> | string
  metadata?: JsonBody<any>
}

export interface TemplateGroup {
  ref: string
  type: RuleGroupTypeKey
  key: string // stable identifier (build-time only)
  name: string
  orderIndex: number
  children?: TemplateGroup[]
  rules?: TemplateRule[]
  metadata?: JsonBody<any>
}

export interface TemplateBase {
  slug: string
  name: string
  groups: TemplateGroup[]
}
