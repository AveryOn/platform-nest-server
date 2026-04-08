import { Request } from 'express'
import { AuthService } from '~/modules/auth/auth.service'
import { toWebHeaders } from './http.helpers'
import { AppError } from '~/core/error/app-error'
import { ErrorEnum } from '~/core/error/app-error.dict'

export async function getSessionOrThrow(req: Request, authService: AuthService) {
  const session = await authService.auth.api.getSession({
    headers: toWebHeaders(req),
  })

  if (!session?.user) {
    throw new AppError(ErrorEnum.UNAUTHORIZED)
  }

  if (!session.session?.activeOrganizationId) {
    throw new AppError(ErrorEnum.UNAUTHORIZED)
  }

  return {
    user: session.user,
    session: session.session,
    activeOrganizationId: session.session.activeOrganizationId,
  }
}
