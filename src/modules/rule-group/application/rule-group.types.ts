import {
  type ColorTokenMetadataDto,
  type RadiusTokenMetadataDto,
  type RuleGroupKind,
  type ShadowTokenMetadataDto,
  type TypographyTokenMetadataDto,
} from '~/modules/rule-group/infra/http/rule-group.dto'

export interface RuleGroup {
  // id: string
  // projectId: string
  // parentGroupId: string | null
  // name: string
  // description: string | null
  // kind: string
  // metadata: unknown
  // orderIndex: number
  // isFromTemplate: boolean
  // templateRef: string | null
  // enabled: boolean
  // createdAt: Date
  // updatedAt: Date
  // deletedAt: Date | null
  id: string
  projectId: string | null
  name: string
  description: string | null
  orderIndex: number
  parentGroupId: string | null
  metadata: unknown
  scope: string
  type: RuleGroupKind | null
  createdAt: string | Date
  updatedAt: string | Date | null
  deletedAt: string | Date | null
}

export interface RuleGroupCreateInput {
  name: string
  description?: string
  kind: RuleGroupKind
  parentGroupId?: string | null
  metadata?:
    | ColorTokenMetadataDto
    | TypographyTokenMetadataDto
    | RadiusTokenMetadataDto
    | ShadowTokenMetadataDto
    | null
  orderIndex?: number
}

export interface RuleGroupUpdateInput {
  name?: string
  description?: string | null
  kind?: RuleGroupKind
  parentGroupId?: string | null
  metadata?:
    | ColorTokenMetadataDto
    | TypographyTokenMetadataDto
    | RadiusTokenMetadataDto
    | ShadowTokenMetadataDto
    | null
  orderIndex?: number
  enabled?: boolean
}

export interface RuleGroupReorderInput {
  parentGroupId: string | null
  orderedIds: string[]
}
