export const AUTH_SERVICE_PORT = Symbol('AUTH_SERVICE_PORT')

export interface AuthServicePort {
  getSession(headers: Headers): Promise<unknown>
}
