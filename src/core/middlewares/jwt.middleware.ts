import { Injectable, NestMiddleware } from '@nestjs/common'
import { NextFunction, Request, Response } from 'express'
// import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  use(req: Request, _res: Response, next: NextFunction) {
    // const token = req.cookies?.accessToken;

    // if (!token) {
    //   return next();
    // }

    try {
      // IMPORTANT: decode without verify — only a stub
      //   const payload = jwt.decode(token) as any;
      const payload = { userId: '550e8400-e29b-41d4-a716-446655440000' }

      if (payload && typeof payload === 'object') {
        // req.user = { id: payload.userId }
      }
    } catch {
      // ignore errors in the stub
    }

    next()
  }
}
