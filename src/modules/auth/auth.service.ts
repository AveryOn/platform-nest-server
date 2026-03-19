import { Injectable } from '@nestjs/common'
import {
  createBetterAuth,
  type BetterAuthInstance,
} from '~/modules/auth/auth.instance'
import { DrizzleService } from '~/infra/drizzle/drizzle.service'

@Injectable()
export class AuthService {
  public readonly auth: BetterAuthInstance

  constructor(private readonly drizzle: DrizzleService) {
    this.auth = createBetterAuth(this.drizzle.db)
  }
}
