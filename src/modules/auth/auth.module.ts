import { Module } from '@nestjs/common'

import { BetterAuthService } from '~/modules/auth/application/auth.service'
import { AUTH_SERVICE_PORT } from '~/modules/auth/ports/auth.service.port'

@Module({
  providers: [
    BetterAuthService,
    {
      provide: AUTH_SERVICE_PORT,
      useExisting: BetterAuthService,
    },
  ],
  exports: [AUTH_SERVICE_PORT, BetterAuthService],
})
export class AuthModule {}
