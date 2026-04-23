import { Inject, Injectable, LoggerService } from '@nestjs/common'
import type { Logger } from 'pino'
import { AsyncContextService } from './async-context.service'
import { LOGGER_PORT } from './logger.port'
import { sanitizeContext } from './logger.sanitize'
import { LogEntry, LogLevel, LogMeta } from './logger.types'

@Injectable()
export class AppLoggerService implements LoggerService {
  constructor(
    @Inject(LOGGER_PORT)
    private readonly pino: Logger,
    private readonly ctx: AsyncContextService,
  ) {}

  debug(message: string, meta?: LogMeta) {
    this.write(LogLevel.debug, message, meta)
  }
  info(message: string, meta?: LogMeta) {
    this.write(LogLevel.info, message, meta)
  }
  warn(message: string, meta?: LogMeta) {
    this.write(LogLevel.warn, message, meta)
  }
  fatal(message: string, meta?: LogMeta) {
    this.write(LogLevel.fatal, message, meta)
  }

  error(
    message: string,
    traceOrMeta?: string | LogMeta,
    metaMaybe?: LogMeta,
  ) {
    if (typeof traceOrMeta === 'string') {
      this.write(LogLevel.error, message, {
        ...(metaMaybe ?? {}),
        context: {
          ...(metaMaybe?.context ?? {}),
          trace: traceOrMeta,
        },
      })
      return
    }
    this.write(LogLevel.error, message, traceOrMeta as LogMeta)
  }

  // Nest LoggerService compatibility
  log(message: any, meta?: LogMeta) {
    this.info(String(message), meta)
  }
  // warn/error/debug already exist

  private write(level: LogLevel, message: string, meta?: LogMeta) {
    if (!meta) return

    const requestId =
      this.ctx.getValue(this.ctx.ALSKey['requestId']) ?? 'no-request'
    const userId = this.ctx.getValue(this.ctx.ALSKey['userId'])

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      requestId,
      userId,
      scope: meta.scope,
      message,
      context: sanitizeContext(meta.context),
    }

    // pino: msg is taken from message, the rest as fields
    // so that pino does not add time/pid/hostname - this is configured in the config (base: undefined, timestamp: false)
    this.pino[level](
      {
        timestamp: entry.timestamp,
        requestId: entry.requestId,
        userId: entry.userId,
        scope: entry.scope,
        context: entry.context,
      },
      entry.message,
    )
  }
}
