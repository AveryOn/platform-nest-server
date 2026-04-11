import { Global, Module, Scope } from '@nestjs/common'
import { INQUIRER } from '@nestjs/core'
import pino, { Logger } from 'pino'
import { env } from '~/core/env'
import { AsyncContextService } from '~/core/logger/async-context.service'
import { LOGGER_PORT } from '~/core/logger/logger.port'
import { AppLoggerService } from '~/core/logger/logger.service'
import { NodeEnv } from '~/shared/const/app.const'

@Global()
@Module({
  providers: [
    {
      provide: LOGGER_PORT,
      useFactory: () => {
        const isProd = env.NODE_ENV === NodeEnv.production

        return pino({
          level: env.LOG_LEVEL,
          base: undefined, // excludes pid and hostname fields
          timestamp: false,
          formatters: {
            level(label) {
              return { level: label }
            },
          },
          transport: !isProd
            ? {
                target: 'pino-pretty',
                options: {
                  colorize: true,
                  translateTime: 'SYS:standard',
                  ignore: 'pid,hostname,time',
                },
              }
            : void 0,
        })
      },
    },
    {
      provide: AppLoggerService,
      scope: Scope.TRANSIENT,
      inject: [LOGGER_PORT, AsyncContextService, INQUIRER],
      useFactory: (pino: Logger, ctx: AsyncContextService, parent: object) => {
        const moduleName = parent?.constructor?.name ?? 'Unknown'
        const child = pino.child({ module: moduleName })
        return new AppLoggerService(child, ctx)
      },
    },
    AsyncContextService,
  ],
  exports: [LOGGER_PORT, AppLoggerService, AsyncContextService],
})
export class LoggerModule {}
