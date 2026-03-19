import { Global, Module } from '@nestjs/common'
import { REDIS_PORT } from '~/infra/redis/ports/redis.service.port'
import { RedisService } from '~/infra/redis/application/redis.service'

@Global()
@Module({
  providers: [
    {
      provide: REDIS_PORT,
      useClass: RedisService,
    },
  ],
  exports: [REDIS_PORT],
})
/** Wrapper module over RedisCore */
export class RedisWrapperModule {}
