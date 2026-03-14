import { Injectable, NestMiddleware } from '@nestjs/common'
import { randomUUID } from 'node:crypto'
import { Request, Response, NextFunction } from 'express'
import { ModuleRef } from '@nestjs/core'
import { AsyncContextService } from '~/core/logger/async-context.service'

@Injectable()
export class RequestContextMiddleware implements NestMiddleware {
  constructor(private readonly moduleRef: ModuleRef) {}

  use(req: Request, res: Response, next: NextFunction) {
    const context = this.moduleRef.get(AsyncContextService, {
      strict: false,
    })

    const requestId = (req.headers['x-request-id'] as string) ?? randomUUID()

    context.run({ requestId }, next)
  }
}
