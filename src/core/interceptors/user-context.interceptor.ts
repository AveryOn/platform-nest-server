import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AsyncContextService } from '~/core/logger/async-context.service';

@Injectable()
export class UserContextInterceptor implements NestInterceptor {
  constructor(private readonly ctx: AsyncContextService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest<any>();
    const userId = req?.user?.id; // TODO adjust to real payload
    if (typeof userId === 'string' && userId) {
      this.ctx.setValue(this.ctx.ALSKey['userId'], userId);
    }
    return next.handle();
  }
}