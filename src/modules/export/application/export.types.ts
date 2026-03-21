export interface ResolvedRule {
  id: string
  title: string | null
  body: string
  path: string[]
  groupKind: string
  metadata: unknown
  tags: string[]
  orderGlobal: number
}
