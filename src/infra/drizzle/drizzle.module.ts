import { Global, Module } from '@nestjs/common'
import { DrizzleService } from '~/infra/drizzle/application/drizzle.service'
import { DRIZZLE_SERVICE_PORT } from '~/infra/drizzle/ports/drizzle.service.port'

@Global()
@Module({
  providers: [
    {
      provide: DRIZZLE_SERVICE_PORT,
      useClass: DrizzleService,
    },
  ],
  exports: [DRIZZLE_SERVICE_PORT],
})
export class DrizzleModule {}
