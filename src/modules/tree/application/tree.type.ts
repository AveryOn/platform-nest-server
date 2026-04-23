import type { RuleGroupType } from '~/modules/rule-group/application/rule-group.type'

/** Tree leaf (rules) */
export interface RuleTreeLeaf {
  /** Rule UUID */
  id: string

  /** Owner rule group UUID */
  ruleGroupId: string

  /** Rule name */
  name: string

  /** Use button for primary actions */
  body: string

  /** Flexible metadata payload */
  metadata: Record<string, any> | null

  /** Order index inside rule group */
  orderIndex: number

  /** Creation timestamp in ISO-8601 format */
  createdAt: string

  /** Update timestamp in ISO-8601 format */
  updatedAt: string
}

/** Tree node (rule group) */
export interface RuleTreeNode {
  /** Rule group UUID */
  id: string

  /** Owner project UUID */
  projectId: string

  /** Parent rule group UUID. Null means root group */
  parentGroupId: string | null

  /** Rule group name */
  name: string

  /** Rule group description */
  description: string | null

  /**
   * Rule group semantic type
   * @example `category` | `component`| `section` | `token` | `variant`
   * */
  type: RuleGroupType

  /** Order index within sibling list */
  orderIndex: number

  /** Whether this node is hidden at project configuration level */
  isHidden: boolean

  /** Creation timestamp in ISO-8601 format */
  createdAt: string

  /** Update timestamp in ISO-8601 format */
  updatedAt: string

  /** Direct rules that belong to this rule group */
  rules: RuleTreeLeaf[]

  /** Direct child rule groups */
  children: RuleTreeNode[]
}

export namespace TreeServiceCmd {
  export interface GetTree {
    projectId: string
    includeHidden?: boolean
    includeMetadata?: boolean
  }
}

export namespace TreeServiceResult {
  export interface GetTree {
    projectId: string
    includeHidden: boolean
    includeMetadata: boolean
    tree: RuleTreeNode[]
  }
}
