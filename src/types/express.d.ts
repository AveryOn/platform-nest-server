import 'express'
import type { ApiKeyScope } from '~/modules/api-key/application/api-key.type'

declare module 'express-serve-static-core' {
  interface Request {
    user: any
    session: any
    activeOrganizationId: string | null
    apiKey?: {
      id: string
      brandId: string
      projectId?: string | null
      organizationId: string
      scopes: ApiKeyScope[]
    }
  }
}
