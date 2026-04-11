import { Module } from '@nestjs/common'

import { BetterAuthService } from '~/modules/auth/application/auth.service'
import { SessionGuard } from '~/modules/auth/infra/session.guard'
import { AUTH_SERVICE_PORT } from '~/modules/auth/ports/auth.service.port'

@Module({
  providers: [
    SessionGuard,
    BetterAuthService,
    {
      provide: AUTH_SERVICE_PORT,
      useExisting: BetterAuthService,
    },
  ],
  exports: [AUTH_SERVICE_PORT, BetterAuthService, SessionGuard],
})
export class AuthModule {}
