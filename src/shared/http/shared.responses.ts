import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'
import { AppError } from '~/core/error/app-error'
import { ErrorEnum } from '~/core/error/app-error.dict'
import type { AppLoggerService } from '~/core/logger/logger.service'

export class OperationSuccessResponse {
  @ApiProperty({
    example: 'success',
    description: 'Status of request',
  })
  @IsString()
  @IsNotEmpty()
  status: 'success'
}

export class OperationFailedResponse {
  @ApiProperty({
    example: 'failed',
    description: 'Status of request',
  })
  @IsString()
  @IsNotEmpty()
  status: 'failed'
}

/**
 * Creates and logs an unauthorized application error for a missing organization context.
 *
 * Used during initial access checks when the current request does not contain
 * a required `organizationId`, for example when there is no active organization
 * in the authenticated session.
 *
 * @param logger - Application logger used by AppError for structured logging.
 * @returns Logged AppError with UNAUTHORIZED error code.
 */
export const notFoundOrgIdError = (logger?: AppLoggerService) =>
  new AppError(ErrorEnum.UNAUTHORIZED, logger, {
    msg: 'Active organization is required',
  }).log('`organizationId` field is a required', {
    scope: 'INITIAL_ACCESS_CHECK',
  })
