import { Global, Module } from '@nestjs/common'
import { DrizzleService } from '~/infra/drizzle/application/drizzle.service'
import { DRIZZLE_PORT } from '~/infra/drizzle/ports/drizzle.service.port'

@Global()
@Module({
  providers: [
    {
      provide: DRIZZLE_PORT,
      useClass: DrizzleService,
    },
  ],
  exports: [DRIZZLE_PORT],
})
export class DrizzleModule {}
