import { Global, Module, Scope } from '@nestjs/common'
import pino, { Logger } from 'pino'
import { AppLoggerService } from './logger.service'
import { AsyncContextService } from './async-context.service'
import { env } from '~/core/env'
import { LOGGER_PORT } from './logger.port'
import { INQUIRER } from '@nestjs/core'

@Global()
@Module({
  providers: [
    {
      provide: LOGGER_PORT,
      useFactory: () => {
        const isProd = env.NODE_ENV === 'production'

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
        const moduleName = parent?.constructor?.name ?? 'Unknown';
        const child = pino.child({ module: moduleName });
        return new AppLoggerService(child, ctx);
      },
    },
    AsyncContextService,
  ],
  exports: [AppLoggerService, AsyncContextService],
})
export class LoggerModule {}
