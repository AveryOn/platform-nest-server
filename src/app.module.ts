import { env } from '~/core/env'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { EmailProviderModule } from '~/infra/email-provider/email-provider.module'
import { SendGridModule } from '~/infra/email-provider/sendgrid/sendgrid.module'
import { AuthModule } from './modules/auth/auth.module'
import { UserModule } from '~/modules/user/user.module'
import { SystemModule } from '~/modules/system/system.module'
import { EmailModule } from '~/modules/email/email.module'
import { ProjectModule } from '~/modules/project/project.module'
import { RequestContextMiddleware } from '~/core/middlewares/request.middleware'
import { LoggerModule } from '~/core/logger/logger.module'
import { UserContextInterceptor } from '~/core/interceptors/user-context.interceptor'
import { JwtMiddleware } from '~/core/middlewares/jwt.middleware'
import { PaginatorModule } from '~/shared/paginator/paginator.module'
import { PrismaModule } from '~/infra/prisma/prisma.module'
import { RedisModule } from '@nestjs-modules/ioredis'
import { RedisWrapperModule } from '~/infra/redis/redis.module'
import { DrizzleModule } from '~/infra/drizzle/drizzle.module'

@Module({
  imports: [
    LoggerModule,
    PaginatorModule,
    PrismaModule,
    DrizzleModule,
    SystemModule,
    AuthModule,
    UserModule,
    ProjectModule,
    EmailProviderModule,
    SendGridModule,
    EmailModule,
    RedisModule.forRoot({
      type: 'single',
      url: env.REDIS_URL,
    }),
    RedisWrapperModule,
  ],
  controllers: [],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: UserContextInterceptor },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        JwtMiddleware, 
        RequestContextMiddleware,
      )
      .forRoutes('*')
  }
}
