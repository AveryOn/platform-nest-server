import { HttpStatus } from '@nestjs/common'

export enum ErrorEnum {
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  UNKNOWN = 'UNKNOWN',
  INVALID_DATA = 'INVALID_DATA',
}

interface ErrorChunk {
  code: keyof typeof ErrorEnum
  httpStatus: (typeof HttpStatus)[keyof typeof HttpStatus]
  message: string
}

export const ERRORS: Record<keyof typeof ErrorEnum, ErrorChunk> = {
  UNKNOWN: {
    code: 'UNKNOWN',
    httpStatus: 500,
    message: 'Unknown Error',
  },
  USER_NOT_FOUND: {
    code: 'USER_NOT_FOUND',
    httpStatus: 404,
    message: 'User not found',
  },
  INVALID_CREDENTIALS: {
    code: 'INVALID_CREDENTIALS',
    httpStatus: 401,
    message: 'Invalid credentials',
  },
  INVALID_DATA: {
    code: 'INVALID_DATA',
    httpStatus: 400,
    message: 'Invalid data',
  },
}

export type ErrorKey = keyof typeof ERRORS
