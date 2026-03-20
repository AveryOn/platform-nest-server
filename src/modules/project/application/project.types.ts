export interface Project {
  id: string
  organizationId: string
  name: string
  slug: string
  description: string | null
  templateSnapshotId: string | null
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
}

export interface CreateProjectInput {
  name: string
  description?: string | null
  templateSlug?: string
}
