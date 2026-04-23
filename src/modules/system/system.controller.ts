import { Controller, Get, Inject, Req, UseGuards } from '@nestjs/common'
import type { Request } from 'express'

import { SessionGuard } from '../auth/infra/session.guard'
import {
  AUTH_SERVICE_PORT,
  type AuthServicePort,
} from '../auth/ports/auth.service.port'

@Controller('me')
export class SystemController {
  constructor(
    @Inject(AUTH_SERVICE_PORT)
    private readonly auth: AuthServicePort,
  ) {}
  @Get()
  @UseGuards(SessionGuard)
  getMe(
    @Req()
    req: Request,
  ) {
    const r = req as any

    return {
      user: r.user,
      session: r.session,
      activeOrganizationId: r.activeOrganizationId,
    }
  }

  @Get('sign')
  sign() {}
}
