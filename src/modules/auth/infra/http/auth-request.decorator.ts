import {
  createParamDecorator,
  type ExecutionContext,
} from '@nestjs/common'
import type {
  AuthRequest,
  OrgAuthReqPayload,
} from '~/modules/auth/application/auth.types'
import { notFoundOrgIdError } from '~/shared/http/shared.responses'

export const AuthReq = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest<AuthRequest>()

    return {
      user: req.user,
      session: req.session,
      organizationId: req.activeOrganizationId,
    }
  },
)

export const OrgAuthReq = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): OrgAuthReqPayload => {
    const req = ctx.switchToHttp().getRequest<AuthRequest>()

    if (!req.activeOrganizationId) {
      throw notFoundOrgIdError()
    }

    return {
      user: req.user,
      session: req.session,
      activeOrganizationId: req.activeOrganizationId,
    }
  },
)
