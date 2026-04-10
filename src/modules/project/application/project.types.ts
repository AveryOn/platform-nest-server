export interface Project {
  id: string
  name: string
  description: string | null
  slug: string
  createdAt: Date
  organizationId: string
  templateSnapshotId: string | null
  updatedAt: Date | null
  deletedAt: Date | null
}

export interface CreateProjectInput {
  name: string
  description?: string | null
  templateSlug?: string
}

export interface UpdateProjectInput {
  name?: string
  description?: string | null
}
