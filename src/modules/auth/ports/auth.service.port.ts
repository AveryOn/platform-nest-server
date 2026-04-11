import type { SessionContext } from '~/modules/auth/application/auth.types'

export const AUTH_SERVICE_PORT = Symbol('AUTH_SERVICE_PORT')

export interface AuthServicePort {
  getSession(headers: Headers): Promise<SessionContext>
}
