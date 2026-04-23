import {
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { UserContextInterceptor } from '~/core/interceptors/user-context.interceptor'
import { LoggerModule } from '~/core/logger/logger.module'
import { RequestContextMiddleware } from '~/core/middlewares/request.middleware'
import { DrizzleModule } from '~/infra/drizzle/drizzle.module'
import { AuthModule } from '~/modules/auth/auth.module'
import { ProjectConfigModule } from '~/modules/project-config/project-config.module'
import { ProjectModule } from '~/modules/project/project.module'
import { ResolvedRulesetModule } from '~/modules/resolved-ruleset/resolved-ruleset.module'
import { RuleGroupModule } from '~/modules/rule-group/rule-group.module'
import { RuleModule } from '~/modules/rule/rule.module'
import { SnapshotModule } from '~/modules/snapshot/snapshot.module'
import { SystemModule } from '~/modules/system/system.module'
import { TemplateModule } from '~/modules/template/template.module'
import { TreeModule } from '~/modules/tree/tree.module'
import { PaginatorModule } from '~/shared/paginator/paginator.module'
// import { RedisModule } from '@nestjs-modules/ioredis'
// import { RedisWrapperModule } from '~/infra/redis/redis.module'

@Module({
  imports: [
    LoggerModule,
    PaginatorModule,
    DrizzleModule,
    AuthModule,
    SystemModule,
    ProjectModule,
    RuleGroupModule,
    RuleModule,
    TreeModule,
    ResolvedRulesetModule,
    SnapshotModule,
    ProjectConfigModule,
    TemplateModule,
    // ExportModule,

    // RedisModule.forRoot({
    //   type: 'single',
    //   url: env.REDIS_URL,
    // }),
    // RedisWrapperModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: UserContextInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestContextMiddleware).forRoutes('*')
  }
}
