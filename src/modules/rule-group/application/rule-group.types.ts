import {
  ColorTokenMetadataDto,
  RadiusTokenMetadataDto,
  RuleGroupKind,
  ShadowTokenMetadataDto,
  TypographyTokenMetadataDto,
} from '../infra/http/rule-group.dto'

export interface RuleGroup {
  id: string
  projectId: string
  parentGroupId: string | null
  name: string
  description: string | null
  kind: string
  metadata: unknown
  orderIndex: number
  isFromTemplate: boolean
  templateRef: string | null
  enabled: boolean
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
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
  parentGroupId: string | null;
  orderedIds: string[];
}