import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Request } from 'express'
import { AuthService } from '~/modules/auth/auth.service'
import { getSessionOrThrow } from '~/shared/helpers/auth.helpers'
import { AppLoggerService } from '../logger/logger.service'

@Injectable()
export class SessionGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly logger: AppLoggerService,
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest<Request>()
    const { activeOrganizationId, session, user } = await getSessionOrThrow(req, this.authService)

    req.session = session
    req.activeOrganizationId = activeOrganizationId!
    req.user = user

    return true
  }
}
