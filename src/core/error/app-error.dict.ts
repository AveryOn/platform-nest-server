import { HttpStatus } from '@nestjs/common'

export enum ErrorEnum {
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  UNKNOWN = 'UNKNOWN',
  INVALID_DATA = 'INVALID_DATA',
  GROUP_NOT_FOUND = 'GROUP_NOT_FOUND',
  UNAUTHORIZED = 'UNAUTHORIZED',
  SOURCE_NOT_FOUND = 'SOURCE_NOT_FOUND',
  FORBIDDEN = 'FORBIDDEN',
  CONFLICT = 'CONFLICT',
  UNPROCESSABLE = 'UNPROCESSABLE',
}

interface ErrorChunk {
  code: keyof typeof ErrorEnum
  httpStatus: (typeof HttpStatus)[keyof typeof HttpStatus]
  message: string
}

export const ERRORS: Record<keyof typeof ErrorEnum, ErrorChunk> = {
  UNKNOWN: {
    code: 'UNKNOWN',
    httpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
    message: 'Unknown Error',
  },
  INVALID_CREDENTIALS: {
    code: 'INVALID_CREDENTIALS',
    httpStatus: HttpStatus.UNAUTHORIZED,
    message: 'Invalid credentials',
  },
  INVALID_DATA: {
    code: 'INVALID_DATA',
    httpStatus: HttpStatus.BAD_REQUEST,
    message: 'Invalid data',
  },
  GROUP_NOT_FOUND: {
    code: 'GROUP_NOT_FOUND',
    httpStatus: HttpStatus.NOT_FOUND,
    message: 'Rule Group Not Found',
  },
  UNAUTHORIZED: {
    code: 'UNAUTHORIZED',
    httpStatus: HttpStatus.UNAUTHORIZED,
    message: 'User is not authorized',
  },
  SOURCE_NOT_FOUND: {
    code: 'SOURCE_NOT_FOUND',
    httpStatus: HttpStatus.NOT_FOUND,
    message: 'Source is not found',
  },
  FORBIDDEN: {
    code: 'FORBIDDEN',
    httpStatus: HttpStatus.FORBIDDEN,
    message: 'Access to this resource is denied',
  },
  CONFLICT: {
    code: 'CONFLICT',
    httpStatus: HttpStatus.CONFLICT,
    message:
      'A conflict occurred while trying to create a record; such a record probably already exists',
  },
  UNPROCESSABLE: {
    code: 'UNPROCESSABLE',
    httpStatus: HttpStatus.UNPROCESSABLE_ENTITY,
    message:
      'The data was transferred in a format that is not valid for the operation',
  },
}

export type ErrorKey = keyof typeof ERRORS
