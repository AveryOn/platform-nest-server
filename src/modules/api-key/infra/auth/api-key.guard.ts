import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { ApiKeyAuthGuard } from '~/modules/api-key/infra/auth/api-key-auth.guard'
import { SessionGuard } from '~/modules/auth/infra/session.guard'

@Injectable()
export class SessionOrApiKeyGuard implements CanActivate {
  constructor(
    private readonly sessionGuard: SessionGuard,
    private readonly apiKeyGuard: ApiKeyAuthGuard,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      return await this.sessionGuard.canActivate(context)
    } catch {
      try {
        return await this.apiKeyGuard.canActivate(context)
      } catch {
        throw new UnauthorizedException('Unauthorized')
      }
    }
  }
}
