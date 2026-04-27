import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common'
import { Response } from 'express'
import { AppError } from '~/core/error/app-error'
import { ERRORS } from '~/core/error/app-error.dict'

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const res = ctx.getResponse<Response>()

    console.debug({
      exception,
    })

    if (exception instanceof AppError) {
      return res.status(exception.httpStatus).json({
        code: exception.code,
        message: exception.message,
        meta: {
          ...exception.meta,
          context: undefined, // Exclude field context
        },
      })
    }

    // If this is a built-in HttpException
    if (exception instanceof HttpException) {
      const status = exception.getStatus()
      const body = exception.getResponse()

      return res
        .status(status)
        .json(typeof body === 'string' ? { message: body } : body)
    }

    // Any other error
    return res.status(500).json({
      code: ERRORS.UNKNOWN.code,
      message: ERRORS.UNKNOWN.message,
    })
  }
}
