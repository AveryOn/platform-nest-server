import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { UserContextInterceptor } from '~/core/interceptors/user-context.interceptor'
import { LoggerModule } from '~/core/logger/logger.module'
import { JwtMiddleware } from '~/core/middlewares/jwt.middleware'
import { RequestContextMiddleware } from '~/core/middlewares/request.middleware'
import { DrizzleModule } from '~/infra/drizzle/drizzle.module'
import { PaginatorModule } from '~/shared/paginator/paginator.module'
// import { RedisModule } from '@nestjs-modules/ioredis'
// import { RedisWrapperModule } from '~/infra/redis/redis.module'

@Module({
  imports: [
    LoggerModule,
    PaginatorModule,
    DrizzleModule,
    // ProjectModule,
    // RuleGroupModule,
    // RuleModule,
    // TreeModule,
    // ExportModule,

    // RedisModule.forRoot({
    //   type: 'single',
    //   url: env.REDIS_URL,
    // }),
    // RedisWrapperModule,
  ],
  controllers: [],
  providers: [{ provide: APP_INTERCEPTOR, useClass: UserContextInterceptor }],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtMiddleware, RequestContextMiddleware).forRoutes('*')
  }
}
