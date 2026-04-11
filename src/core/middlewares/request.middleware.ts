import { Inject, Injectable, NestMiddleware } from '@nestjs/common'
import { ModuleRef } from '@nestjs/core'
import { NextFunction, Request, Response } from 'express'
import { randomUUID } from 'node:crypto'
import { AsyncContextService } from '~/core/logger/async-context.service'

@Injectable()
export class RequestContextMiddleware implements NestMiddleware {
  constructor(
    @Inject(ModuleRef)
    private readonly moduleRef: ModuleRef,
  ) {}

  use(req: Request, res: Response, next: NextFunction) {
    const context = this.moduleRef.get(AsyncContextService, {
      strict: false,
    })

    const requestId = (req.headers['x-request-id'] as string) ?? randomUUID()

    context.run({ requestId }, next)
  }
}
