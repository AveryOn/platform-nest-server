export enum LogLevel {
  debug = 'debug',
  info = 'info',
  warn = 'warn',
  error = 'error',
  fatal = 'fatal',
}

export type LogLevelType = keyof typeof LogLevel

export type LogMeta = {
  scope?: string
  context?: Record<string, any>
}

export type LogEntry = {
  timestamp: string // ISO
  level: LogLevel
  requestId: string
  userId?: string
  scope?: string
  message: string
  context?: Record<string, any>
}

export type AsyncLocalStorageType = {
  requestId: string
  userId?: string
}

export const ALSKey = {
  requestId: 'requestId',
  userId: 'userId',
} as const satisfies Record<keyof AsyncLocalStorageType, string>

export type ALSKey = keyof typeof ALSKey

export type LoggerMeta = Record<string, any>
