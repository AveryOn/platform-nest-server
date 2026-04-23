import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import type { Request } from 'express'

import {
  AUTH_SERVICE_PORT,
  type AuthServicePort,
} from '~/modules/auth/ports/auth.service.port'
import { toWebHeaders } from '~/shared/helpers/http.helpers'

@Injectable()
export class SessionGuard implements CanActivate {
  constructor(
    @Inject(AUTH_SERVICE_PORT)
    private readonly authService: AuthServicePort,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>()
    const headers = toWebHeaders(request.headers)

    const result = await this.authService.getSession(headers)

    if (!result.session || !result.user) {
      throw new UnauthorizedException('Unauthorized')
    }

    ;(request as Request & Record<string, unknown>).user = result.user
    ;(request as Request & Record<string, unknown>).session =
      result.session
    ;(request as Request & Record<string, unknown>).activeOrganizationId =
      result.session.activeOrganizationId ?? null

    return true
  }
}
