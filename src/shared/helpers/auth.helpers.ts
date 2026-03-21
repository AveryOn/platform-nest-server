import { Request } from 'express'
import { AuthService } from '~/modules/auth/auth.service'
import { toWebHeaders } from './http.helpers'

export async function getSessionOrThrow(
  req: Request,
  authService: AuthService,
) {
  const session = await authService.auth.api.getSession({
    headers: toWebHeaders(req),
  })

  if (!session?.user) {
    throw new Error('Unauthorized')
  }

  if (!session.session?.activeOrganizationId) {
    throw new Error('No active organization')
  }

  return {
    user: session.user,
    session: session.session,
    activeOrganizationId: session.session.activeOrganizationId,
  }
}
