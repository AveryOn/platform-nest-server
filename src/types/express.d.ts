import 'express'

declare module 'express-serve-static-core' {
  interface Request {
    user: any
    session: any
    activeOrganizationId: string | null
  }
}
