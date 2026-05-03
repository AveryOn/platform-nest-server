export interface BrandEntity {
  id: string
  name: string
  organizationId: string
  createdAt: string
  updatedAt: string | null
}

export interface BrandRawEntity {
  id: string
  name: string
  organizationId: string
  createdAt: Date
  updatedAt: Date | null
}
