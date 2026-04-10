import { type ErrorKey, ERRORS, ErrorEnum } from '~/core/error/app-error.dict'
import { type AppLoggerService } from '~/core/logger/logger.service'
import { type LogMeta } from '~/core/logger/logger.types'

export class AppError extends Error {
  constructor(
    public readonly key: ErrorKey,
    private readonly logger?: AppLoggerService,
    public readonly details?: unknown,
  ) {
    super(ERRORS[key].message)
  }

  private _log?: {
    message?: string
    meta?: LogMeta
  }

  /** Вызывает logger.error */
  log(message?: string, meta?: LogMeta): this {
    this._log = { message, meta }

    // If a message text is passed in the argument, it takes priority over the system message from ERRORS
    this.message = message ? message : this.message

    if (this.logger) {
      this.logger.error(message ?? this.message, this.stack, meta)
    }
    return this
  }

  get code() {
    return ERRORS[this.key].code
  }
  get httpStatus() {
    return ERRORS[this.key].httpStatus
  }

  get meta() {
    return this._log?.meta
  }
}

export const ERROR = ErrorEnum
